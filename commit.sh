#!/usr/bin/env bash
set -euo pipefail

# Commit each changed file with an auto-generated, file-specific message and push

root_dir="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$root_dir" ]]; then
  echo "Error: Not inside a git repository." >&2
  exit 1
fi

cd "$root_dir"

# Collect changed files (modified + untracked + renamed)
mapfile -t CHANGES < <(git status --porcelain=v1)
if [[ ${#CHANGES[@]} -eq 0 ]]; then
  echo "No changes to commit."
  exit 0
fi

current_branch="$(git rev-parse --abbrev-ref HEAD)"

guess_action() {
  local status="$1"
  case "$status" in
    '??') echo 'add';;
    'A '*) echo 'add';;
    'D '*) echo 'remove';;
    'R '*) echo 'rename';;
    *) echo 'update';;
  esac
}

guess_scope() {
  local file="$1"
  if [[ "$file" == front-docs/*.md ]]; then
    echo "docs(front)"
  elif [[ "$file" == real-estate-saas/backend/src/modules/* ]]; then
    local mod
    mod="$(sed -E 's@.*/modules/([^/]+)/.*@\1@' <<< "$file")"
    echo "feat(${mod})"
  elif [[ "$file" == real-estate-saas/backend/src/config/* ]]; then
    echo "chore(config)"
  elif [[ "$file" == real-estate-saas/backend/src/routes/* ]]; then
    echo "feat(routes)"
  elif [[ "$file" == real-estate-saas/backend/src/middleware/* ]]; then
    echo "feat(middleware)"
  elif [[ "$file" == real-estate-saas/backend/src/models/* ]]; then
    echo "feat(models)"
  elif [[ "$file" == real-estate-saas/backend/docker-compose*.yml ]]; then
    echo "chore(docker)"
  elif [[ "$file" == real-estate-saas/backend/Dockerfile* ]]; then
    echo "chore(dockerfile)"
  elif [[ "$file" == real-estate-saas/backend/src/utils/* ]]; then
    echo "feat(utils)"
  else
    echo "chore"
  fi
}

format_subject() {
  local scope="$1"; local action="$2"; local file="$3"
  local base
  base="$(basename "$file")"
  case "$action" in
    add) echo "${scope}: add ${base}";;
    remove) echo "${scope}: remove ${base}";;
    rename) echo "${scope}: rename ${base}";;
    *) echo "${scope}: update ${base}";;
  esac
}

# Process each change line
for line in "${CHANGES[@]}"; do
  # status is first 2 chars; the rest is path (handle rename syntax)
  status="${line:0:2}"
  rest="${line:3}"
  file="${rest}"
  if [[ "$status" =~ ^R ]]; then
    # format: R  old -> new
    file="$(sed -E 's@^R[ M]? (.+) -> (.+)$@\2@' <<< "$rest")"
  fi

  # Normalize path (remove leading ./)
  file="${file#./}"

  # Skip deletions at commit time (they still get committed with rm)
  if [[ "$status" == "D "* ]]; then
    git rm --quiet -- "$file" || true
    scope="$(guess_scope "$file")"
    subject="$(format_subject "$scope" "remove" "$file")"
    git commit -m "$subject" --no-verify || true
    continue
  fi

  # Stage file
  git add -- "$file" || true

  action="$(guess_action "$status")"
  scope="$(guess_scope "$file")"
  subject="$(format_subject "$scope" "$action" "$file")"

  # Commit (group per-file)
  git commit -m "$subject" --no-verify || true
done

# Push
git push origin "$current_branch"
echo "Pushed to origin/${current_branch}"


