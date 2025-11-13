# Build stage
FROM gradle:8.5-jdk21 AS build
WORKDIR /workspace
# Copy root Gradle files
COPY build.gradle settings.gradle ./
# Copy service-specific files
COPY services/user-service/build.gradle ./services/user-service/
COPY services/user-service/src ./services/user-service/src
# Build from root, specifying the project
RUN gradle :services:user-service:clean :services:user-service:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/services/user-service/build/libs/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]

