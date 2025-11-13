package com.videostep.video.controller;

import com.videostep.video.dto.CreateVideoRequest;
import com.videostep.video.dto.VideoDto;
import com.videostep.video.service.VideoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 動画コントローラー
 */
@RestController
@RequestMapping("/videos")
@CrossOrigin(origins = "*")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createVideo(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CreateVideoRequest request) {
        try {
            VideoDto video = videoService.createVideo(userId, request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", video);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getVideo(@PathVariable Long id) {
        try {
            VideoDto video = videoService.getVideoById(id);
            videoService.incrementViewCount(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", video);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getVideosByUser(@PathVariable Long userId) {
        try {
            List<VideoDto> videos = videoService.getVideosByUserId(userId);
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

    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> getPublicVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        try {
            PageResponse<VideoDto> pageResponse = videoService.getPublicVideos(page, size);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", pageResponse.getContent());
            response.put("pagination", Map.of(
                    "currentPage", pageResponse.getCurrentPage(),
                    "totalPages", pageResponse.getTotalPages(),
                    "totalElements", pageResponse.getTotalElements(),
                    "pageSize", pageResponse.getPageSize(),
                    "hasNext", pageResponse.isHasNext(),
                    "hasPrevious", pageResponse.isHasPrevious(),
                    "isFirst", pageResponse.isFirst(),
                    "isLast", pageResponse.isLast()));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchVideos(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        try {
            PageResponse<VideoDto> pageResponse = videoService.searchVideos(keyword, page, size);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", pageResponse.getContent());
            response.put("pagination", Map.of(
                    "currentPage", pageResponse.getCurrentPage(),
                    "totalPages", pageResponse.getTotalPages(),
                    "totalElements", pageResponse.getTotalElements(),
                    "pageSize", pageResponse.getPageSize(),
                    "hasNext", pageResponse.isHasNext(),
                    "hasPrevious", pageResponse.isHasPrevious(),
                    "isFirst", pageResponse.isFirst(),
                    "isLast", pageResponse.isLast()));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getVideosByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        try {
            PageResponse<VideoDto> pageResponse = videoService.getVideosByCategory(category, page, size);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", pageResponse.getContent());
            response.put("pagination", Map.of(
                    "currentPage", pageResponse.getCurrentPage(),
                    "totalPages", pageResponse.getTotalPages(),
                    "totalElements", pageResponse.getTotalElements(),
                    "pageSize", pageResponse.getPageSize(),
                    "hasNext", pageResponse.isHasNext(),
                    "hasPrevious", pageResponse.isHasPrevious(),
                    "isFirst", pageResponse.isFirst(),
                    "isLast", pageResponse.isLast()));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateVideoStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> statusUpdate) {
        try {
            String status = (String) statusUpdate.get("status");
            String videoUrl = (String) statusUpdate.get("videoUrl");
            Long duration = statusUpdate.get("duration") != null ? Long.valueOf(statusUpdate.get("duration").toString())
                    : null;
            Long fileSize = statusUpdate.get("fileSize") != null ? Long.valueOf(statusUpdate.get("fileSize").toString())
                    : null;

            VideoDto video = videoService.updateVideoStatus(id, status, videoUrl, duration, fileSize);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", video);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteVideo(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            videoService.deleteVideo(id, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Video deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }
}
