# Build stage
FROM gradle:8.5-jdk21 AS build
WORKDIR /workspace
# Copy root Gradle files
COPY build.gradle settings.gradle ./
# Copy shared common-lib (required by settings.gradle)
COPY shared/common-lib/build.gradle ./shared/common-lib/
# Copy service-specific files
COPY services/api-gateway/build.gradle ./services/api-gateway/
COPY services/api-gateway/src ./services/api-gateway/src
# Build from root, specifying the project
RUN gradle :services:api-gateway:clean :services:api-gateway:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/services/api-gateway/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

