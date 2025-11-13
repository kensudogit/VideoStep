package com.videostep.video.controller;

import com.videostep.video.dto.VideoDto;
import com.videostep.video.service.WatchHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 視聴履歴コントローラー
 */
@RestController
@RequestMapping("/videos/history")
@CrossOrigin(origins = "*")
public class WatchHistoryController {

    @Autowired
    private WatchHistoryService historyService;

    @PostMapping("/{videoId}")
    public ResponseEntity<Map<String, Object>> recordWatch(
            @PathVariable Long videoId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, Long> request) {
        try {
            Long watchDuration = request.getOrDefault("watchDuration", 0L);
            Long lastPosition = request.getOrDefault("lastPosition", 0L);
            historyService.recordWatch(videoId, userId, watchDuration, lastPosition);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getWatchHistory(
            @RequestHeader("X-User-Id") Long userId) {
        try {
            List<VideoDto> videos = historyService.getWatchHistory(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", videos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{videoId}/position")
    public ResponseEntity<Map<String, Object>> getLastPosition(
            @PathVariable Long videoId,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            Long position = historyService.getLastPosition(videoId, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("position", position);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> clearWatchHistory(
            @RequestHeader("X-User-Id") Long userId) {
        try {
            historyService.clearWatchHistory(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Watch history cleared");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
