// Black-box tests for cli.js. Run with: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
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
