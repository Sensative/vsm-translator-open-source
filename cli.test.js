// Black-box tests for cli.js. Run with: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));

const cli = (...args) => {
    const { status, stdout, stderr } = spawnSync(process.execPath, ["cli.js", ...args], { cwd: repoRoot, encoding: "utf8" });
    return { status, out: stdout + stderr };
};

test("README example decodes", () => {
    const { status, out } = cli("1325798073", "1", "509b0074110197", "2024-11-28T14:57:19.000Z");
    assert.equal(status, 0);
    assert.match(out, /amplitude: 116/);
    assert.match(out, /distance: 4\.07/);
});

test("null translation result does not crash", () => {
    const { status, out } = cli("40829709", "1", "b00a2c");
    assert.equal(status, 0);
    assert.doesNotMatch(out, /TypeError/);
    assert.match(out, /No result/);
});

test("usage errors print their reason", () => {
    const { status, out } = cli("1", "999", "00");
    assert.equal(status, 1);
    assert.match(out, /Port appears incorrect/);
});

for (const hex of ["zzzz", "b00azz", "b00", ""]) {
    test(`invalid hex payload '${hex}' is rejected`, () => {
        const { status, out } = cli("40829709", "1", hex);
        assert.equal(status, 1);
        assert.match(out, /Failed to parse hex payload/);
    });
}

test("invalid timestamp is rejected", () => {
    const { status, out } = cli("1325798073", "1", "509b0074110197", "garbage");
    assert.equal(status, 1);
    assert.match(out, /Failed to parse date/);
    assert.doesNotMatch(out, /Invalid Date/);
});


// Encoding a downlink. Released applications, so the expected bytes do not move with new builds:
// Motion-measure 40829709 (motionThreshold_m_s2: id 179, word, scale 0.001) and Tracker
// 3802553086 (four long inputs).

test("encode on port 2: 5-byte records, checked by decoding", () => {
    const { status, out } = cli("encode", "40829709", "motionThreshold_m_s2=0.92");
    assert.equal(status, 0);
    assert.match(out, /fPort 2 {2}5 bytes {2}hex B300000398 {2}base64 swAAA5g=/);
    assert.match(out, /Checked/);
});

test("encode on port 1: id and a value sized by the id", () => {
    const { status, out } = cli("encode", "40829709", "motionThreshold_m_s2=0.92", "--port", "1");
    assert.equal(status, 0);
    assert.match(out, /fPort 1 {2}3 bytes {2}hex 330398 /);
});

test("encode --raw takes the value as it is sent", () => {
    const { status, out } = cli("encode", "40829709", "motionThreshold_m_s2=920", "--raw");
    assert.equal(status, 0);
    assert.match(out, /hex B300000398 /);
});

const trackerSettings = ["stillMotionThreshold_mm_s2=920", "movingMotionThreshold_mm_s2=460",
                         "movingScanIntervalMinutes=600", "stationaryScanIntervalMinutes=1440"];

test("encode on port 1 puts each 4-byte value last in its own downlink, for older firmware", () => {
    const { status, out } = cli("encode", "3802553086", ...trackerSettings, "--port", "1");
    assert.equal(status, 0);
    assert.match(out, /2 downlinks/);
    assert.match(out, /hex 3303983401CC3C00000258 /);
    assert.match(out, /hex 3D000005A0 /);
});

test("encode on port 1 with --no-legacy packs 4-byte values freely", () => {
    const { status, out } = cli("encode", "3802553086", ...trackerSettings, "--port", "1", "--no-legacy");
    assert.equal(status, 0);
    assert.match(out, /1 downlink\b/);
    assert.match(out, /hex 3303983401CC3C000002583D000005A0 /);
});

test("encode splits port 2 downlinks by --max-size", () => {
    const { status, out } = cli("encode", "3802553086", ...trackerSettings, "--max-size", "10");
    assert.equal(status, 0);
    assert.match(out, /2 downlinks/);
});

test("encode refuses a value that does not fit port 1", () => {
    const { status, out } = cli("encode", "40829709", "sampleInterval_s=200", "--port", "1");
    assert.equal(status, 1);
    assert.match(out, /outside -128\.\.127/);
});

test("encode names the settable inputs for an unknown name", () => {
    const { status, out } = cli("encode", "40829709", "nosuch=1");
    assert.equal(status, 1);
    assert.match(out, /cannot be set.*Settable: tempHysteresis/);
});

test("encode refuses an application the translator does not know", () => {
    const { status, out } = cli("encode", "12345", "x=1");
    assert.equal(status, 1);
    assert.match(out, /does not know application CRC 12345/);
});

test("encode --vso takes the symbols from a .vso file", () => {
    const dir = mkdtempSync(join(tmpdir(), "cli-test-"));
    const file = join(dir, "Example.vso");
    writeFileSync(file, "C 1 # 0x1\nM input level 163 0xa3  1\nM input threshold_m_s2 179 0xb3  0.001\n");
    try {
        const { status, out } = cli("encode", "--vso", file, "level=3", "threshold_m_s2=0.3");
        assert.equal(status, 0);
        assert.match(out, /Example \(1\), port 2/);
        assert.match(out, /hex A300000003B30000012C /);
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
});

// Decoding a settings downlink, the mirror of encode

test("decode reads back what encode wrote, on both ports", () => {
    for (const port of ["2", "1"]) {
        const encoded = cli("encode", "3802553086", ...trackerSettings, "--port", port, "--no-legacy");
        assert.equal(encoded.status, 0);
        const hex = /hex ([0-9A-F]+)/.exec(encoded.out)[1];
        const { status, out } = cli("decode", "3802553086", hex, "--port", port);
        assert.equal(status, 0);
        for (const setting of trackerSettings)
            assert.match(out, new RegExp(setting.replace("=", " = ") + " \\(raw"));
    }
});

test("decode applies the scale, or not with --raw", () => {
    assert.match(cli("decode", "40829709", "B300000398").out, /motionThreshold_m_s2 = 0\.92 \(raw 920\)/);
    assert.match(cli("decode", "40829709", "B300000398", "--raw").out, /motionThreshold_m_s2 = 920$/m);
});

test("decode warns of a 4-byte value that is not last on port 1", () => {
    const { status, out } = cli("decode", "3802553086", "3C000002583303 98".replace(" ", ""), "--port", "1");
    assert.equal(status, 0);
    assert.match(out, /firmware before dots 8b47e73 misreads/);
});

test("decode shows a short port 2 payload as a read request", () => {
    const { status, out } = cli("decode", "40829709", "B3A3");
    assert.equal(status, 0);
    assert.match(out, /read request[\s\S]*motionThreshold_m_s2[\s\S]*sampleInterval_s/);
});

test("decode rejects a port 2 payload that is not whole records", () => {
    const { status, out } = cli("decode", "40829709", "B300000398A3");
    assert.equal(status, 1);
    assert.match(out, /Not a whole number of 5-byte records/);
});

test("decode rejects a port 1 value that is cut short", () => {
    const { status, out } = cli("decode", "40829709", "3303", "--port", "1");
    assert.equal(status, 1);
    assert.match(out, /only 1 left/);
});

test("decode names references that are not in the map", () => {
    const { status, out } = cli("decode", "40829709", "BF00000001");
    assert.equal(status, 0);
    assert.match(out, /ref 191 \(0xbf\) = 1, not in Motion-measure's map/);
});

test("decode with a port decodes an uplink, as without the word", () => {
    const { status, out } = cli("decode", "1325798073", "1", "509b0074110197", "2024-11-28T14:57:19.000Z");
    assert.equal(status, 0);
    assert.match(out, /amplitude: 116/);
    assert.match(out, /distance: 4\.07/);
});

test("decode of an uplink takes no settings options", () => {
    const { status, out } = cli("decode", "40829709", "1", "330398", "--raw");
    assert.equal(status, 1);
    assert.match(out, /An uplink takes no options/);
});
