changed_files="$(git diff HEAD^ HEAD --name-only)"

check_run_on_changes() {
  echo "Inside the sh watcher file script, whoami: $USER"
  NODE_MODULES_DIR="node_modules"

  if [ -d "$NODE_MODULES_DIR" ]; then
      # look for empty dir
      if [ "$(ls -A $NODE_MODULES_DIR)" ]; then
          echo "directory $NODE_MODULES_DIR exists, checking for changes in $1"
          if echo "$changed_files" | grep -q "$1"; then
            echo "There are changes in $1 file. Installing..."
            eval "$2"
          else
            echo "$1 file has not changed. Skipping $2"
          fi
      else
          echo "Take action $NODE_MODULES_DIR is empty"
          eval "$2"
      fi
  else
    echo "directory $NODE_MODULES_DIR does not exist - installing node modules.."
    eval "$2"
  fi
}

check_run_on_changes package-lock.json "npm ci"
