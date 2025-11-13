package com.videostep.video.controller;

import com.videostep.video.dto.CommentDto;
import com.videostep.video.dto.CreateCommentRequest;
import com.videostep.video.dto.VideoDto;
import com.videostep.video.service.VideoInteractionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 動画インタラクションコントローラー
 */
@RestController
@RequestMapping("/videos")
@CrossOrigin(origins = "*")
public class VideoInteractionController {

    @Autowired
    private VideoInteractionService interactionService;

    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            boolean isLiked = interactionService.toggleLike(id, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isLiked", isLiked);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> isLiked(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            boolean isLiked = interactionService.isLiked(id, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isLiked", isLiked);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Map<String, Object>> createComment(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CreateCommentRequest request) {
        try {
            CommentDto comment = interactionService.createComment(id, userId, request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", comment);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<Map<String, Object>> getComments(@PathVariable Long id) {
        try {
            List<CommentDto> comments = interactionService.getComments(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", comments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Map<String, Object>> deleteComment(
            @PathVariable Long commentId,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            interactionService.deleteComment(commentId, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Comment deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Map<String, Object>> toggleFavorite(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            boolean isFavorited = interactionService.toggleFavorite(id, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isFavorited", isFavorited);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/{id}/favorite")
    public ResponseEntity<Map<String, Object>> isFavorited(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            boolean isFavorited = interactionService.isFavorited(id, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isFavorited", isFavorited);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/favorites")
    public ResponseEntity<Map<String, Object>> getFavoriteVideos(
            @RequestHeader("X-User-Id") Long userId) {
        try {
            List<VideoDto> videos = interactionService.getFavoriteVideos(userId);
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
}

