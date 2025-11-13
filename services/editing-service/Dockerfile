# Build stage
FROM gradle:8.5-jdk21 AS build
WORKDIR /workspace
# Copy root Gradle files
COPY build.gradle settings.gradle ./
# Copy service-specific files
COPY services/editing-service/build.gradle ./services/editing-service/
COPY services/editing-service/src ./services/editing-service/src
# Build from root, specifying the project
RUN gradle :services:editing-service:clean :services:editing-service:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/services/editing-service/build/libs/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]

