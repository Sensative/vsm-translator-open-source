# Generating the Basic Translators

This guide is for developers who maintain the basic translators. If you are looking for a decoder to use in your LNS, see [README.md](README.md) instead.

The basic translators are generated from two templates and the schemas in `../dots-translator-generated.cjs`. All work happens on the `dots-basic-translators` branch, which is kept rebased on `main`.

## Before you start

- Node.js is installed.
- Your working tree is clean (`git status` shows nothing to commit). The rebase refuses to run over uncommitted changes.
- Nobody else is pushing to `dots-basic-translators` at the same time. Step 2 force-pushes the branch.

## Steps

Run every command from the `basic-translators` folder.

### 1. Check whether the main template changed

Do this **before** rebasing. After the rebase your branch already contains `main`, so the check below would always come back empty.

```bash
git checkout dots-basic-translators
git fetch origin
git log --oneline HEAD..origin/main -- ../dots-translator.template.cjs
```

- **No output:** nothing to port. Continue with step 2.
- **Commits listed:** the main developer changed `dots-translator.template.cjs`. Write down the commit hashes, then follow [Porting changes from the main template](#porting-changes-from-the-main-template) after step 2.

### 2. Rebase on main

```bash
bash git_rebase.sh
```

This checks out `dots-basic-translators`, fetches, rebases it on `origin/main` and force-pushes it. The script is not marked executable, so run it with `bash`.

If the rebase stops on a conflict, resolve it, run `git rebase --continue`, and then push the result yourself:

```bash
git push --force-with-lease origin dots-basic-translators
```

### 3. Generate the translators

```bash
./generate-basic-translators.sh
```

The output should look like this:

```
Translator version: 0.2.191
Generating Basic translators for chirpstack-v3.
Generating Basic translators for ttn-and-chirpstack-v4.
Ready.
```

The generator reads the schemas from `../dots-translator-generated.cjs` and the translator version from `../package.json`. It then deletes every `.js` and `.csv` file in `chirpstack-v3/` and `thethingsnetwork-chirpstack-v4/` and writes them again, together with a CSV index of all translators (`1-dots-basic-...-translators-index.csv`).

> **Do not keep hand-made files in those two folders.** The generator deletes them without warning.

Check that every generated file is valid JavaScript:

```bash
for f in chirpstack-v3/*.js thethingsnetwork-chirpstack-v4/*.js; do node --check "$f" || echo "FAILED: $f"; done
```

### 4. Update the README table

If the CSV index changed, update the table in [README.md](README.md) to match it:

```bash
git diff -- '*.csv'
```

The table has one row per CSV row, with the columns Product Application, Versions and CRCs. In the CRCs column, replace the CSV's `|` separators with `, `.

### 5. Commit and push

Keep the commits apart, the same way the history does:

```bash
# Only if you ported template changes
git add chirpstack-v3/template thethingsnetwork-chirpstack-v4/template
git commit -m "[Templates] <what changed>."

git add -A chirpstack-v3 thethingsnetwork-chirpstack-v4
git commit -m "Regenerated basic translators."

# Only if the README table changed
git add README.md
git commit -m "README table updated with <what changed>."

git push origin dots-basic-translators
```

A normal push is enough here, because step 2 already force-pushed the rebased branch.

## Porting changes from the main template

The basic templates are adapted copies of `../dots-translator.template.cjs`. When the main developer changes that file, make the same change in **both** of these:

- `chirpstack-v3/template/dots-chirpstack-v3-decoder-template.cjs`
- `thethingsnetwork-chirpstack-v4/template/dots-ttn-and-chirpstack-v4-decoder-template.cjs`

To see what changed, show each commit you wrote down in step 1:

```bash
git show <commit-hash> -- ../dots-translator.template.cjs
```

### Write it as ES5

ChirpStack v3 only runs ES5 JavaScript, and the main template uses newer syntax. Rewrite the change as you port it:

| Main template (ES6+)                         | Basic templates (ES5)                     |
|----------------------------------------------|-------------------------------------------|
| `const x = 1;` / `let x = 1;`                | `var x = 1;`                              |
| `(a, b) => a + b`                            | `function (a, b) { return a + b; }`       |
| `` `Value: ${v}` ``                          | `"Value: " + v`                           |
| `const { a, b } = obj;`                      | `var a = obj.a; var b = obj.b;`           |
| `for (const item of list)`                   | `for (var i = 0; i < list.length; i++)`   |
| `function f(a = 1)`                          | `function f(a) { if (a === undefined) a = 1; }` |

Keep the TTN and ChirpStack v4 template the same as the v3 one wherever you can, so the two stay easy to compare.

This should print nothing once the v3 template is ES5 again:

```bash
grep -nE '\b(const|let)\b|=>|`' chirpstack-v3/template/dots-chirpstack-v3-decoder-template.cjs
```

### Keep what is specific to the basic templates

- **The LNS entry function at the top:** `Decode` in the ChirpStack v3 template and `decodeUplink` in the TTN and ChirpStack v4 template. The main template has no equivalent.
- **The `/// DO NOT CHANGE THE BELOW` block.** The generator fills it in. The basic templates call the schema table `schema`; the main template calls it `knownSchemas`.
- **The `new Date(...)` wrappers around timestamps**, for example `new Date(sampleTimestamp).getTime()`. They fix a "getTime is not a function" error on the LNS.
- **Leave out the main template's Node-only ending:** `selfTest()`, `process.exit(...)` and `exports.translate = translate;` do not belong in the basic templates.

## Adding a new product

Only applications listed in `utils/valid-sensors.cjs` get translators. To add one, add its name to that list exactly as it appears in the `name:` field in `../dots-translator-generated.cjs`, then generate again (step 3).

A schema is only generated if it has at least one released version of R11 or above, or a generation II version (R1000 and above). Schemas with an empty `versions` field are skipped.

## How the files are named

| Pattern                                 | Example                                         |
|-----------------------------------------|-------------------------------------------------|
| One version                             | `Puck-radar-R30.js`                             |
| A range of versions                     | `Square-air-R27-to-R29.js`                      |
| Generation I and generation II versions | `Seat-occupancy-R30-to-R33-and-R1000-to-R1001.js` |
| Variants that share exactly the same versions get their lowest CRC added | `Air-R1000-to-R1001-1270577071.js` |

One translator can serve several CRCs when their mappings are compatible. The CRCs it serves are listed in the CSV index and in the README table.

## Troubleshooting

| Problem | What to do |
|---------|------------|
| `Permission denied` when running `./git_rebase.sh` | Run it as `bash git_rebase.sh`. |
| `cannot rebase: You have unstaged changes` | Commit or stash your changes, then run step 2 again. |
| A product is missing from the output | Check that it is listed in `utils/valid-sensors.cjs` and that it has a version of R11 or above, or R1000 and above, in `../dots-translator-generated.cjs`. |
| `Generated filename collision for CRC ...` | Two translators came out with the same filename, which points to a bug in `utils/`. The output folders are left half-empty at that point, so do not commit them. Fix the generator and run step 3 again. |
