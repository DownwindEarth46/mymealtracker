package backend.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/ping")
public class PingController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> ping() {
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "message", "get ping'd kid",
            "timestamp", Instant.now().toString()
        ));
    }
}