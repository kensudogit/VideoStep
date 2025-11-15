# Build stage
FROM gradle:8.5-jdk21 AS build
WORKDIR /workspace
# Copy root Gradle files
COPY build.gradle settings.gradle ./
# Copy shared common-lib (required by settings.gradle)
COPY shared/common-lib/build.gradle ./shared/common-lib/
# Copy service-specific files
COPY services/service-registry/build.gradle ./services/service-registry/
COPY services/service-registry/src ./services/service-registry/src
# Build from root, specifying the project
RUN gradle :services:service-registry:clean :services:service-registry:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/services/service-registry/build/libs/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]

