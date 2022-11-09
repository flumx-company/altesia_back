#!/bin/bash

branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
echo "Current branch is $branch"

PULL_CHANGES=$(git pull origin_ssh "$branch")
echo "$PULL_CHANGES"

sh ./_automation/ci/package-lock-watcher.sh

ALREADY_UP_TO_DATE="Already up to date."
if grep -q "$ALREADY_UP_TO_DATE" <<< "$PULL_CHANGES"; then
  echo "Skip build part. $ALREADY_UP_TO_DATE"
else
  pm2 delete altesia_back
  npm run build
  pm2 start npm --name "altesia_back" -- run "start:dev"
fi