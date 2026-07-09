#!/bin/bash

# This script performs a rebase of the 'dots-basic-translators' branch with the latest changes from the 'main' branch.
# 
# Steps:
# 1. Checkout the 'dots-basic-translators' branch.
# 2. Fetch the latest changes from the remote repository.
# 3. Rebase the 'dots-basic-translators' branch with the 'main' branch from the remote repository.
# 4. Force push the rebased 'dots-basic-translators' branch to the remote repository.

git checkout dots-basic-translators
git fetch origin
git rebase origin/main
git push origin dots-basic-translators --force