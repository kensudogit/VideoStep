package com.videostep.video.controller;

import com.videostep.video.dto.CreatePlaylistRequest;
import com.videostep.video.dto.PlaylistDto;
import com.videostep.video.service.PlaylistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * プレイリストコントローラー
 */
@RestController
@RequestMapping("/playlists")
@CrossOrigin(origins = "*")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPlaylist(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CreatePlaylistRequest request) {
        try {
            PlaylistDto playlist = playlistService.createPlaylist(userId, request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", playlist);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getUserPlaylists(
            @RequestHeader("X-User-Id") Long userId) {
        try {
            List<PlaylistDto> playlists = playlistService.getUserPlaylists(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", playlists);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPlaylist(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            PlaylistDto playlist = playlistService.getPlaylistById(id, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", playlist);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PostMapping("/{id}/videos/{videoId}")
    public ResponseEntity<Map<String, Object>> addVideoToPlaylist(
            @PathVariable Long id,
            @PathVariable Long videoId,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            PlaylistDto playlist = playlistService.addVideoToPlaylist(id, videoId, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", playlist);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}/videos/{videoId}")
    public ResponseEntity<Map<String, Object>> removeVideoFromPlaylist(
            @PathVariable Long id,
            @PathVariable Long videoId,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            playlistService.removeVideoFromPlaylist(id, videoId, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Video removed from playlist");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePlaylist(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CreatePlaylistRequest request) {
        try {
            PlaylistDto playlist = playlistService.updatePlaylist(id, userId, request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", playlist);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePlaylist(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            playlistService.deletePlaylist(id, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Playlist deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    /**
     * 公開プレイリスト一覧を取得（認証不要）
     */
    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> getPublicPlaylists(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            List<PlaylistDto> playlists = playlistService.getPublicPlaylists(page, size);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", playlists);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 特定ユーザーの公開プレイリストを取得
     */
    @GetMapping("/user/{userId}/public")
    public ResponseEntity<Map<String, Object>> getPublicPlaylistsByUserId(
            @PathVariable Long userId) {
        try {
            List<PlaylistDto> playlists = playlistService.getPublicPlaylistsByUserId(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", playlists);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
