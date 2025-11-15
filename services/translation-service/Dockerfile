# Build stage
FROM gradle:8.5-jdk21 AS build
WORKDIR /workspace
# Copy root Gradle files
COPY build.gradle settings.gradle ./
# Copy shared common-lib (required by settings.gradle)
COPY shared/common-lib/build.gradle ./shared/common-lib/
# Copy service-specific files
COPY services/translation-service/build.gradle ./services/translation-service/
COPY services/translation-service/src ./services/translation-service/src
# Build from root, specifying the project
RUN gradle :services:translation-service:clean :services:translation-service:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/services/translation-service/build/libs/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]

