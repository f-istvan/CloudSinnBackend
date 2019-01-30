#!/usr/bin/env bash

echo

curl -X GET \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <TOKEN>" \
     https://1w9xogmta5.execute-api.eu-west-1.amazonaws.com/dev/resources

echo
