package com.videostep.video.controller;

import com.videostep.video.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * 動画アップロードコントローラー
 */
@RestController
@RequestMapping("/videos")
@CrossOrigin(origins = "*")
public class VideoUploadController {

    @Autowired
    private VideoService videoService;

    @PostMapping("/{id}/upload")
    public ResponseEntity<Map<String, Object>> uploadVideo(
            @PathVariable Long id,
            @RequestParam("video") MultipartFile file,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            if (file.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "File is empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // ファイルサイズチェック (500MB制限)
            if (file.getSize() > 500 * 1024 * 1024) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "File size exceeds 500MB limit");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // ファイルタイプチェック
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("video/")) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "Invalid file type. Only video files are allowed");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // 動画ファイルを保存（実際の実装ではS3などに保存）
            // ここでは簡略化のため、ファイル名を返す
            String fileName = file.getOriginalFilename();
            String videoUrl = "/uploads/videos/" + id + "/" + fileName;

            // 動画のステータスを更新
            videoService.updateVideoStatus(id, "PROCESSING", videoUrl, null, file.getSize());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Video uploaded successfully");
            response.put("videoUrl", videoUrl);
            response.put("fileSize", file.getSize());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
