package com.sentinel.architect.controller;

import com.sentinel.architect.model.GeneratorRequest;
import com.sentinel.architect.model.GeneratorResponse;
import com.sentinel.architect.service.ArchitectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/architect")
public class ArchitectController {

    // ── Constructor injection (best practice over @Autowired) ────
    private final ArchitectService architectService;

    public ArchitectController(ArchitectService architectService) {
        this.architectService = architectService;
    }

    // ── @desc    Generate Dockerfile + docker-compose
    // ── @route   POST /api/architect/generate
    // ── @access  Public
    @PostMapping("/generate")
    public ResponseEntity<GeneratorResponse> generate(
            @Valid @RequestBody GeneratorRequest request
    ) {
        GeneratorResponse response = architectService.generate(request);
        return ResponseEntity.ok(response);
    }

    // ── @desc    Get supported languages and databases
    // ── @route   GET /api/architect/options
    // ── @access  Public
    @GetMapping("/options")
    public ResponseEntity<Map<String, Object>> getOptions() {
        return ResponseEntity.ok(Map.of(
            "languages", List.of(
                Map.of("value", "nodejs",  "label", "Node.js",  "versions", List.of("18", "20", "22")),
                Map.of("value", "python",  "label", "Python",   "versions", List.of("3.11", "3.12")),
                Map.of("value", "go",      "label", "Go",       "versions", List.of("1.22")),
                Map.of("value", "java",    "label", "Java",     "versions", List.of("21"))
            ),
            "databases", List.of(
                Map.of("value", "mongodb",    "label", "MongoDB"),
                Map.of("value", "postgresql", "label", "PostgreSQL"),
                Map.of("value", "mysql",      "label", "MySQL"),
                Map.of("value", "none",       "label", "No Database")
            ),
            "packageManagers", List.of("npm", "yarn", "pnpm")
        ));
    }

    // ── @desc    Health check
    // ── @route   GET /api/architect/health
    // ── @access  Public
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "service", "sentinel-architect-service",
            "status",  "running ✅",
            "port",    "8080"
        ));
    }
}