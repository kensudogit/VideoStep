package com.videostep.video.controller;

import com.videostep.video.dto.VideoDto;
import com.videostep.video.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 推奨動画コントローラー
 */
@RestController
@RequestMapping("/videos/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/popular")
    public ResponseEntity<Map<String, Object>> getPopularVideos(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<VideoDto> videos = recommendationService.getPopularVideos(limit);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", videos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getRecommendedByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<VideoDto> videos = recommendationService.getRecommendedByCategory(category, limit);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", videos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<Map<String, Object>> getLatestVideos(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<VideoDto> videos = recommendationService.getLatestVideos(limit);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", videos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/related/{videoId}")
    public ResponseEntity<Map<String, Object>> getRelatedVideos(
            @PathVariable Long videoId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<VideoDto> videos = recommendationService.getRelatedVideos(videoId, limit);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", videos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
