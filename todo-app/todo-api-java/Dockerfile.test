# --- Build ---
FROM openjdk:8-jdk-alpine as BUILD

COPY gradle ./gradle
COPY gradlew .

# Layer to download gradle
RUN ./gradlew

COPY build.gradle .

# Download dependencies
RUN ./gradlew getDependencies -x test --continue

RUN echo 'Dependencies Downloaded'

COPY src ./src

ENV FAIL_TESTS false

ENTRYPOINT ["./gradlew"]

CMD ["test"]
