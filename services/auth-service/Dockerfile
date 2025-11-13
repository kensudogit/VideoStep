# Build stage
FROM gradle:8.5-jdk21 AS build
WORKDIR /workspace
# Copy root Gradle files
COPY build.gradle settings.gradle ./
# Copy service-specific files
COPY services/auth-service/build.gradle ./services/auth-service/
COPY services/auth-service/src ./services/auth-service/src
# Build from root, specifying the project
RUN gradle :services:auth-service:clean :services:auth-service:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/services/auth-service/build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]

