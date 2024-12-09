FROM openjdk:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy JAR file to the container
ARG JAR_FILE=target/blognest-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]