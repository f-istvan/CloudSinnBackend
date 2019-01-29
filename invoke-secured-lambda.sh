#!/usr/bin/env bash

echo

curl -X GET \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <TOKEN>" \
      https://<API_URL>/dev/list-stacks

echo
