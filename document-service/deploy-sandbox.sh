#!/usr/bin/env bash
set -eo pipefail

function check_env_vars_exist() {
    echo "Checking appropriate environment variables are set."

    if [[ -z "${ENVIRONMENT}" ]]
    then
        echo "No ENVIRONMENT environment variable was specified."
        exit 1
    fi
}


function prepare_serverless() {
    echo "Preparing to run Serverless."

    rm -rf ./node_modules/
    npm install
}

function run_development() {

    if [[ "${ENVIRONMENT}" == "dev" ]] || [[ "${ENVIRONMENT}" == "staging" ]] || [[ "${ENVIRONMENT}" == "prod" ]]; then
        echo "Cannot use this script to deploy to dev, staging or prod."
        exit 1
    fi

    echo "Running dev contributor setup in AWS for ${ENVIRONMENT}"
    echo
    export SLS_STAGE=${ENVIRONMENT}

    pushd ./terraform/dev/
    terraform init
    SLS_DEPLOYMENT_BUCKET=$(terraform output sls_deployment_bucket)
    export SLS_DEPLOYMENT_BUCKET=$SLS_DEPLOYMENT_BUCKET
    popd

    echo "running serverless deploy --stage ${SLS_STAGE} --region us-east-1"

    ./node_modules/.bin/sls deploy --stage "${SLS_STAGE}" --region us-east-1
}

function configure_custom_logging() {
    REST_API_ID=$(aws apigateway get-rest-apis --query "items[?name=='${ENVIRONMENT}-ef-cms'].id" --output text)
    export REST_API_ID=$REST_API_ID
    aws apigateway update-stage \
        --rest-api-id "${REST_API_ID}" \
        --stage-name "${ENVIRONMENT}" \
        --region us-east-1 \
        --patch-operations op=replace,path=/*/*/logging/dataTrace,value=true
}

check_env_vars_exist
prepare_serverless
run_development
configure_custom_logging
