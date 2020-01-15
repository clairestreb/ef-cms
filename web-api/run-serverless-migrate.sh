#!/bin/bash -e

pushd ./web-api/terraform/main
  ../bin/deploy-init.sh "${1}"
  ELASTICSEARCH_ENDPOINT="$(terraform output elasticsearch_endpoint)"
  export ELASTICSEARCH_ENDPOINT
popd

./web-api/run-serverless.sh "${1}" "${2}" "migrateHandlers.js" "serverless-migrate.yml" "build:api:migrate"
