# User API #

> API that is used to manage users. Through this API, a client will be able to create and retrieve users.

## Running the app ##

### Environment Variables ###

You can set the following environment to customize how the API runs:

- `IS_TEST_MODE` = whether to run in test mode or not
- `APP_LOG_LEVEL` = application log level
- `AZURE_IDENTITY_META_DATA` = for instance, https://login.microsoftonline.com/architech.onmicrosoft.com/v2.0/.well-known/openid-configuration
- `AZURE_APP_ID` = Azure AD registered application ID

### Running the app in development ###

#### Development Prerequisites ####

- Node 8.x 
- Docker and Docker Compose

#### Development Execution ####

> While we're developing the application we will want to bring up all of the applications dependencies, then execute the app
to try it out.

With the [environment variables](#environment-variables) set run

 1. `docker-compose up -d` - to bring up all of the app's dependencies (databases, other services, etc.)
 1. `npm install` - to install any library dependencies
 1. `MONGODB_URL='mongodb://localhost:27018/user-api' npm dev` - to start the application in development mode

In your browser or REST client go to `http://localhost:8080` to try out the app API.

### Running the app in docker-compose ###

When we want to try out our application's docker container, usually to test out application's image definition or how
the application might behave inside a container, we first build the image:

`docker-compose -f docker-compose.yml -f docker-compose.build.yml build`

Then bring it up in a docker-compose environment.

`docker-compose -f docker-compose.yml -f docker-compose.build.yml up`

In your browser or REST client go to `http://localhost:8080` to try out the app API.

## Testing ##

### Unit Tests ###

Unit tests can be run by calling `npm test`

## Application information ##

### Authentication Modes ###

> For authentication, the API supports both production mode and test mode. For both of these modes, the
authentication token is passed through the HTTP `Authorization` header.

- Production authentication goes through the Azure Active Directory. The authentication token that is passed in
is acquired from Azure through the intrinsic flow
- Test mode requires the client application to pass through a Base 64 encoded JSON string as the authentication token.
The format of the JSON is: `{"email":"test@architech.ca","firstName":"John","lastName":"Smith"}`. You can encode the
JSON string from this [site](https://www.base64encode.org/).

### Swagger ###

> Swagger is incorporated in this project to document the REST endpoints and to allow developers to play around with
the API. The Swagger URL is `http://${HOST}:${PORT}/swagger`

### Azure AD Setup ###

> See [Azure AD OpenID Connect Example](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-protocols-openid-connect-code) for instructions on how to get these values for your Azure AD tenant.