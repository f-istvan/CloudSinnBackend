## AWS Lambda authorizer example with Auth0

This example application deploys an AWS API Gateway with two AWS Lambda functions:
* a Token type authorizer lambda (contains JWT token authentication)
* and a `hello` lambda secured by the lambda authorizer (a valid JWT token is needed to call it)  

### Deploy the application

#### Prerequisite

* Install serverless framework on your local
* Create an Auth0 account and a new tenant (tenant name e.g.: qwertz543210)

![New Tenant](https://github.com/f-istvan/Auth0-AWS-Lambda-Authorizer/blob/master/pictures/new-tenant.png)

* In Auth0 dashboard go to APIs -> API explorer and create a test application to use the API Explorer.

![New API](https://github.com/f-istvan/Auth0-AWS-Lambda-Authorizer/blob/master/pictures/new-api.png)

* After creating the test application a test token should appear on the page. Copy it and replace `<TOKEN>` in the `invoke-secure-lambda.sh` below.
* Fill in the `./src/env.yml` file. Using the `qwertz543210` tenant we created the file should look like this:

```text
JWKS_URI: https://qwertz543210.auth0.com/.well-known/jwks.json
AUDIENCE: https://qwertz543210.auth0.com/api/v2/
TOKEN_ISSUER: https://qwertz543210.auth0.com/
```

#### Deploy with serverless framework

```bash
serverless deploy --region eu-west-1
```

### Call the secured endpoint

Call the `/hello` endpoint with `curl`. Open `invoke-secure-lambda.sh` and replace the followings:

* `<TOKEN>` - this should be replaced by now (see previous steps) 
* `<API_GATEWAY_URL>` - You will find this in AWS API Gateway console under `Stages`.

NOTE: my stage is `dev` 

```bash
curl -X GET \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <TOKEN>" \
     https://<API_GATEWAY_URL>/dev/hello?name=thisIsPassedToTheLambda
``` 

### Remove the application

```bash
serverless remove --region eu-west-1
```
