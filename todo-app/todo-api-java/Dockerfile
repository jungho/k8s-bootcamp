# --- Build ---
FROM openjdk:8-jdk-alpine as BUILD

COPY gradle ./gradle
COPY gradlew .

# Layer to download gradle
RUN ./gradlew

COPY build.gradle .

# Download dependencies
RUN ./gradlew getDependencies -x test --continue

COPY src ./src

# Execute build
RUN ./gradlew clean build -x test

# --- Release ---
FROM openjdk:8-jre-alpine

WORKDIR /app

COPY --from=BUILD ./build/libs/*.jar todo-api.jar

ENV MONGODB_URL "localhost:27017"

ENTRYPOINT ["/usr/bin/java"]
CMD ["-jar", "todo-api.jar"]