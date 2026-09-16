#!/usr/bin/env bash
set -euo pipefail

repo="totriumphorg-jpg/artzvezda-redesign"
remote_url="$(git remote get-url user_github)"
token="$(printf '%s' "$remote_url" | sed -E 's#https://x-access-token:([^@]+)@github\.com/.*#\1#')"

if [[ -z "$token" || "$token" == "$remote_url" ]]; then
  echo "Could not obtain repository authentication token."
  exit 1
fi

api() {
  curl --silent --show-error --fail-with-body \
    --header "Accept: application/vnd.github+json" \
    --header "Authorization: Bearer ${token}" \
    --header "X-GitHub-Api-Version: 2022-11-28" \
    "$@"
}

if api "https://api.github.com/repos/${repo}/pages" > /tmp/artzvezda-pages.json 2> /tmp/artzvezda-pages.err; then
  echo "GitHub Pages is already configured."
else
  api --request POST \
    --header "Content-Type: application/json" \
    --data '{"build_type":"workflow"}' \
    "https://api.github.com/repos/${repo}/pages" > /tmp/artzvezda-pages.json
  echo "GitHub Pages configured for GitHub Actions."
fi

api "https://api.github.com/repos/${repo}/pages" | jq '{url: (.html_url // .url), status, build_type, cname}'
