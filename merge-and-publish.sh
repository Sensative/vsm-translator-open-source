#!/bin/bash
set -e

# Check if there are changes to merge
git fetch origin main
if git diff --quiet HEAD...origin/main; then
    echo "No changes to merge from main. Exiting."
    exit 0
fi

# Merge main but keep our package.json
git merge origin/main --no-commit --no-ff || true
git checkout --ours package.json
git add package.json

# Complete the merge if there were changes
git diff --cached --quiet || git commit -m "Merge origin/main, keeping local package.json"

# Bump patch version in package.json
current_version=$(node -p "require('./package.json').version")
new_version=$(echo "$current_version" | awk -F. '{print $1"."$2"."$3+1}')
sed -i "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json

echo "Bumped version: $current_version -> $new_version"

# Commit version bump
git add package.json
git commit -m "Bump version to $new_version"

# Push to remote
git push

echo ""
echo "Done! Now run: npm publish"
