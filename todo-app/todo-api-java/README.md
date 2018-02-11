# Todo API #

> API that is used to manage the Todo list of the current user. Through this API, the user will be able to create,
retrieve, update and delete Todo items. The user must be authenticated in order to use this API.

## Running the App ##

### Environment Variables ###

The following environment variables need to be set to get the dependent microservices up and running:

- `IS_TEST_MODE` = whether to run in test mode or not
- `APP_LOG_LEVEL` = application log level
- `AZURE_IDENTITY_META_DATA` = for instance, https://login.microsoftonline.com/architech.onmicrosoft.com/v2.0/.well-known/openid-configuration
- `AZURE_APP_ID` = Azure AD registered application ID
- `AZURE_CLIENT_SECRET` = Azure AD registered application's secret key

### Running the app in development ###

#### Development Prerequisites ####

- Java 8 SDK 
- Docker and Docker Compose

#### Development Execution ####

While we're developing the application we will want to bring up all of the applications dependencies, then execute the app
to try it out.

With the [environment variables](#environment-variables) set run

 1. `docker-compose up -d` - to bring up all of the app's dependencies (databases, other services, etc.)
 1. `./gradlew bootRun` - to run the app

In your browser or REST client go to `http://localhost:8080` to try out the app API.

### Running the app in docker-compose ###

When we want to try out our application's docker container, usually to test out application's image definition or how
the application might behave inside a container, we first build the image:

`docker-compose -f docker-compose.yml -f docker-compose.build.yml build`

Then bring it up in a docker-compose environment.

`docker-compose -f docker-compose.yml -f docker-compose.build.yml up`

In your browser or REST client go to `http://localhost:8080` to try out the app API.

## Testing ##

### Integration Testing ###

> A separate docker image is used to execute integration tests. It is defined in the `Dockerfile.test` file. This exists to execute 
integration tests in a docker environment where all of the dependencies are available. This is especially desirable in a
CI/CD environment where the executing nodes will not have the language specific tools to execute the integration tests outside of a container.
These also exist separately from the main docker image since we do not want non-production code inside image.
Ie, test classes or a full Java Development Kit.

The simplest way to execute the integration test container:

`docker-compose -f docker-compose.yml -f docker-compose.test.yml run todo-api-test`

## Application information ##

### Authentication Modes ###

> For authentication, the API supports both production mode and test mode. For both of these modes, the
authentication token is passed through the HTTP `Authorization` header.

- Production authentication goes through the Azure Active Directory. The authentication token that is passed in
is acquired from Azure through the intrinsic flow
- Test mode requires the client application to pass through a Base 64 encoded JSON string as the authentication token.
The format of the JSON is: `{"email":"test@architech.ca","firstName":"John","lastName":"Smith"}`. You can encode the
JSON string from this [site](https://www.base64encode.org/).

### Dependencies ###

> The Todo API depends on the User API to identify the current user. It receives the current user's email from Azure
and delegates to the User API to retrieve the user data associated to the email.

### Swagger ###

> Swagger is incorporated in this project to document the REST endpoints and to allow developers to play around with
the API. The Swagger URL is `http://${HOST}:${PORT}/swagger-ui.html`

### Azure AD Setup ###

> For more information on how to set up Azure AD authentication, please visit this
[site](https://docs.microsoft.com/en-us/java/azure/spring-framework/configure-spring-boot-starter-java-app-with-azure-active-directory).
Focus on the `Create and configure a new Azure Active Directory instance` section of the document.
