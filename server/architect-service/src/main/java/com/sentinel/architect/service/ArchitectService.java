package com.sentinel.architect.service;

import com.sentinel.architect.exception.ResourceNotFoundException;
import com.sentinel.architect.model.GeneratorRequest;
import com.sentinel.architect.model.GeneratorResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service  // Spring DI — marks this as a service bean
public class ArchitectService {

    // ── Main entry point ─────────────────────────────────────────
    public GeneratorResponse generate(GeneratorRequest request) {
        String language = request.getLanguage().toLowerCase();
        String database = request.getDatabase().toLowerCase();
        Integer port    = request.getPort();

        String dockerfile    = generateDockerfile(request);
        String dockerCompose = Boolean.TRUE.equals(request.getIncludeCompose())
                ? generateDockerCompose(request)
                : null;
        String[] tips = generateTips(language, database);

        return GeneratorResponse.builder()
                .language(language)
                .database(database)
                .port(port)
                .dockerfile(dockerfile)
                .dockerCompose(dockerCompose)
                .tips(tips)
                .build();
    }

    // ── Dockerfile Generator ─────────────────────────────────────
    private String generateDockerfile(GeneratorRequest req) {
        return switch (req.getLanguage().toLowerCase()) {
            case "nodejs"  -> generateNodeDockerfile(req);
            case "python"  -> generatePythonDockerfile(req);
            case "go"      -> generateGoDockerfile(req);
            case "java"    -> generateJavaDockerfile(req);
            default        -> throw new ResourceNotFoundException(
                    "Unsupported language: " + req.getLanguage()
                    + ". Supported: nodejs, python, go, java"
            );
        };
    }

    // ── Node.js Dockerfile ───────────────────────────────────────
    private String generateNodeDockerfile(GeneratorRequest req) {
        String nodeVersion = req.getNodeVersion() != null ? req.getNodeVersion() : "20";
        String pm          = req.getPackageManager() != null ? req.getPackageManager() : "npm";
        String installCmd  = switch (pm) {
            case "yarn" -> "yarn install --frozen-lockfile";
            case "pnpm" -> "pnpm install --frozen-lockfile";
            default     -> "npm ci --only=production";
        };

        return """
                # ── Node.js %s ────────────────────────────────────────────
                FROM node:%s-alpine

                WORKDIR /app

                # Install dependencies first (better layer caching)
                COPY package*.json ./
                RUN %s

                # Copy source
                COPY . .

                EXPOSE %d

                CMD ["node", "server.js"]
                """.formatted(nodeVersion, nodeVersion, installCmd, req.getPort());
    }

    // ── Python Dockerfile ────────────────────────────────────────
    private String generatePythonDockerfile(GeneratorRequest req) {
        String pythonVersion = req.getPythonVersion() != null ? req.getPythonVersion() : "3.12";

        return """
                # ── Python %s ─────────────────────────────────────────────
                FROM python:%s-slim

                WORKDIR /app

                # Install dependencies first (better layer caching)
                COPY requirements.txt .
                RUN pip install --no-cache-dir -r requirements.txt

                # Copy source
                COPY . .

                EXPOSE %d

                CMD ["python", "app.py"]
                """.formatted(pythonVersion, pythonVersion, req.getPort());
    }

    // ── Go Dockerfile ────────────────────────────────────────────
    private String generateGoDockerfile(GeneratorRequest req) {
        return """
                # ── Go (Multi-stage build) ────────────────────────────────
                # Stage 1: Build
                FROM golang:1.22-alpine AS builder

                WORKDIR /app

                COPY go.mod go.sum ./
                RUN go mod download

                COPY . .
                RUN CGO_ENABLED=0 GOOS=linux go build -o main .

                # Stage 2: Minimal runtime image
                FROM alpine:latest

                WORKDIR /app

                COPY --from=builder /app/main .

                EXPOSE %d

                CMD ["./main"]
                """.formatted(req.getPort());
    }

    // ── Java / Spring Boot Dockerfile ────────────────────────────
    private String generateJavaDockerfile(GeneratorRequest req) {
        return """
                # ── Java / Spring Boot (Multi-stage build) ────────────────
                # Stage 1: Build
                FROM maven:3.9.6-eclipse-temurin-21 AS builder

                WORKDIR /app

                COPY pom.xml .
                RUN mvn dependency:go-offline -B

                COPY src ./src
                RUN mvn clean package -DskipTests

                # Stage 2: Run
                FROM eclipse-temurin:21-jre-alpine

                WORKDIR /app

                COPY --from=builder /app/target/*.jar app.jar

                EXPOSE %d

                ENTRYPOINT ["java", "-jar", "app.jar"]
                """.formatted(req.getPort());
    }

    // ── docker-compose.yml Generator ─────────────────────────────
    private String generateDockerCompose(GeneratorRequest req) {
        String language = req.getLanguage().toLowerCase();
        String database = req.getDatabase().toLowerCase();
        Integer port    = req.getPort();

        StringBuilder sb = new StringBuilder();

        sb.append("version: '3.9'\n\n");
        sb.append("services:\n\n");

        // App service
        sb.append("  app:\n");
        sb.append("    build: .\n");
        sb.append("    container_name: my-app\n");
        sb.append("    restart: unless-stopped\n");
        sb.append("    ports:\n");
        sb.append("      - \"%d:%d\"\n".formatted(port, port));

        if (!database.equals("none")) {
            sb.append("    environment:\n");
            sb.append(getDatabaseEnvVars(database, language));
            sb.append("    depends_on:\n");
            sb.append("      - db\n");
        }

        sb.append("    networks:\n");
        sb.append("      - app-network\n\n");

        // Database service
        if (!database.equals("none")) {
            sb.append(getDatabaseService(database));
        }

        // Networks
        sb.append("networks:\n");
        sb.append("  app-network:\n");
        sb.append("    driver: bridge\n\n");

        // Volumes
        if (!database.equals("none")) {
            sb.append("volumes:\n");
            sb.append("  db-data:\n");
            sb.append("    driver: local\n");
        }

        return sb.toString();
    }

    // ── Database service block ───────────────────────────────────
    private String getDatabaseService(String database) {
        return switch (database) {
            case "mongodb" -> """
                      db:
                        image: mongo:7.0
                        container_name: mongodb
                        restart: unless-stopped
                        ports:
                          - "27017:27017"
                        volumes:
                          - db-data:/data/db
                        networks:
                          - app-network

                    """;
            case "postgresql" -> """
                      db:
                        image: postgres:16-alpine
                        container_name: postgresql
                        restart: unless-stopped
                        ports:
                          - "5432:5432"
                        environment:
                          POSTGRES_DB: appdb
                          POSTGRES_USER: appuser
                          POSTGRES_PASSWORD: changeme
                        volumes:
                          - db-data:/var/lib/postgresql/data
                        networks:
                          - app-network

                    """;
            case "mysql" -> """
                      db:
                        image: mysql:8.0
                        container_name: mysql
                        restart: unless-stopped
                        ports:
                          - "3306:3306"
                        environment:
                          MYSQL_DATABASE: appdb
                          MYSQL_USER: appuser
                          MYSQL_PASSWORD: changeme
                          MYSQL_ROOT_PASSWORD: rootpassword
                        volumes:
                          - db-data:/var/lib/mysql
                        networks:
                          - app-network

                    """;
            default -> "";
        };
    }

    // ── Database environment variables ───────────────────────────
    private String getDatabaseEnvVars(String database, String language) {
        return switch (database) {
            case "mongodb"    -> "      MONGODB_URI: mongodb://db:27017/appdb\n";
            case "postgresql" -> "      DATABASE_URL: postgresql://appuser:changeme@db:5432/appdb\n";
            case "mysql"      -> "      DATABASE_URL: mysql://appuser:changeme@db:3306/appdb\n";
            default           -> "";
        };
    }

    // ── Tips Generator ───────────────────────────────────────────
    private String[] generateTips(String language, String database) {
        List<String> tips = new ArrayList<>();

        // Language tips
        switch (language) {
            case "nodejs" -> {
                tips.add("Use 'npm ci' instead of 'npm install' in Docker for reproducible builds.");
                tips.add("Use alpine base image to keep the image size minimal.");
            }
            case "python" -> {
                tips.add("Use --no-cache-dir with pip to reduce image size.");
                tips.add("Consider using a .dockerignore to exclude __pycache__ and .venv.");
            }
            case "go" -> {
                tips.add("Multi-stage build keeps the final image extremely small (~10MB).");
                tips.add("Set CGO_ENABLED=0 for a fully static binary.");
            }
            case "java" -> {
                tips.add("Multi-stage build separates compile and runtime environments.");
                tips.add("Use JRE not JDK in the final stage — much smaller image.");
            }
        }

        // Database tips
        switch (database) {
            case "mongodb"    -> tips.add("Always use volumes for MongoDB data persistence.");
            case "postgresql" -> tips.add("Change default POSTGRES_PASSWORD before deploying to production.");
            case "mysql"      -> tips.add("Never use MYSQL_ROOT_PASSWORD in production — use a dedicated user.");
            case "none"       -> tips.add("No database selected — add one later in docker-compose if needed.");
        }

        // General tips
        tips.add("Add a .dockerignore file to exclude node_modules, .env, and build artifacts.");
        tips.add("Use 'docker-compose up --build' to rebuild images after code changes.");

        return tips.toArray(new String[0]);
    }
}