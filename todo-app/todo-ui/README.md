# Todo-ui #

 > This front end application was created in [React](https://reactjs.org/) / [Redux](https://redux.js.org/) to showcase the functionality behind the todo api, and user api microservices.  
 The application ties the services together creating a seamless experience for the end user.
 
## Functionality ##

 - Utilize Azure Active Directory to Authenticate users.
 - Create new todos providing due dates and categories.
 - Update/complete todos.
 - Delete todos.
 - Filter todos by completion status.
 - Filter todos by category.
 
After a user has successfully authenticated themselves with Azure AD, the app will save the token in the [localStorage Object](https://www.w3schools.com/html/html5_webstorage.asp).  
The token is then added to the Authorization header of any request that is sent to the api.

The application is communicating with two services(user-api, todo-api).  We use [NGINX](https://www.nginx.com) as a proxy to these services.  
When the app communicates with the user-api service it calls `/api/users` and when it wants to 
communicate with the todo-api it will call `/api/todos`.
 
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). 
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Running the App ##

### Environment Variables ###

The following environment variables need to be set to get the dependent microservices up and running:

 - `AZURE_APP_ID` = (Required) This is the ID of the application registered in Azure AD
 - `AZURE_CLIENT_SECRET` = (Required) The value of a secret key inside the registered application in Azure AD
 - `AZURE_IDENTITY_META_DATA` = (Required) The URL to retrieve metadata from Azure AD. This will be unique to the Azure AD instance.
 It is typically of the form: `https://login.microsoftonline.com/xxxxxxorg.onmicrosoft.com/v2.0/.well-known/openid-configuration`
 - `IS_TEST_MODE` = (Optional; Defaults to false) Whether to start the microservices in "Test Mode", meaning Azure AD is not required to login to the app.

There is a `setenv.sh` file in the parent folder which, when filled in can be used as a convenient way to set environment variables.
Once filled in run `source setenv.sh`

### Running the app in development ###

#### Development Prerequisites ####

 - Node 8.x
 - Yarn 1.x *Note*: npm should work here as well but we don't guarantee the package-lock.json is maintained.
 - Docker and Docker Compose

#### Development Environment Variables ####

 On top of [Environment Variables](#environment-variables) defined, the following are needed during development of the todo-ui:

 - `REACT_APP_TEST_MODE` = (Optional; Defaults to false) - this will set the app in test mode and allow a user to login without AD (NOTE: API's must be in test mode as well)
 - `REACT_APP_CLIENT_ID` = (Required) This is the ID of the application registered in Azure AD. *Note*: This is the same value as AZURE_APP_ID
 - `REACT_APP_TENANT` = (Required) The tenant which owns the particular instance of Azure AD.
 This is typically of the form `xxxxxxxorg.onmicrosoft.com`. This should match the middle section of the URL found in the AZURE_IDENTITY_META_DATA variable.

 These values of environment variables of the pattern REACT_APP_* are automatically injected into the application where ever `process.env.REACT_APP_*` is found.

#### Development Execution ####

When the environment variables are set run the app:

 1. `docker-compose up -d`
 1. `yarn install`
 1. `yarn run start`

In your browser go to `http://localhost:3000`

### Running the app in docker-compose ###

>To test out how the application behaves inside of a container it can be helpful to bring it up in a docker-compose environment locally.

On top of [Environment Variables](#environment-variables) defined, the following are needed during execution in a docker environment:

 - `AZURE_AD_TENANT` = (Required) The tenant which owns the particular instance of Azure AD. *Note*: this is the same value as
 `REACT_APP_TENANT` would be.
 
We can first build the image leveraging docker-compose:

`docker-compose -f docker-compose.yml -f docker-compose.build.yml build`

Then bring it up in a docker-compose environment.

`docker-compose -f docker-compose.yml -f docker-compose.build.yml up`

In your browser go to `http://localhost`

*Note*: This attempts to bind to port 80 on your host OS. It will fail if another process is already bound to that port.

## Testing ##

The app contains units tests as well as e2e tests.

### Unit Tests ###

>The unit tests are running using create react app's setup of [Jest](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#running-tests)

You can run the unit tests in watch mode(re-run as you save) by running:
``yarn run test``

or you can run Jest as a one time process(not in watch mode) with:
``CI=true yarn run test``

### E2E tests ###

>The e2e tests are running using [Protractor](http://www.protractortest.org/#/tutorial)

With the application up and running (See [Development Execution](#development-execution) above)

Run
`yarn webdriver update && yarn webdriver start && yarn run e2etest` 

this will run all tests in 'src/test/e2e/*.e2e.js'

### E2E tests with docker ###

>The end-to-end tests can be executed in a docker environment by leveraging a separate docker image as defined by `Dockerfile.test`.
This exists so that we can inject this testing container into an environment running a todo-ui container and execute tests against it.
It also prevents the need for nodes in a CI/CD environment to have specific tools required to run these tests.
Ie, Headless Chrome, NPM, etc.

First the image needs to built:

`docker-compose -f docker-compose.yml -f docker-compose.build.yml -f docker-compose.test.yml build`

Then execute the tester image:

`docker-compose -f docker-compose.yml -f docker-compose.build.yml -f docker-compose.test.yml run todo-ui-tester`