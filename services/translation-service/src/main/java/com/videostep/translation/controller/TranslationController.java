package com.videostep.translation.controller;

import com.videostep.translation.dto.TranslationRequest;
import com.videostep.translation.dto.TranslationResponse;
import com.videostep.translation.service.TranslationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 翻訳コントローラー
 */
@RestController
@RequestMapping("/translations")
@CrossOrigin(origins = "*")
public class TranslationController {

    @Autowired
    private TranslationService translationService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> translate(@Valid @RequestBody TranslationRequest request) {
        try {
            TranslationResponse response = translationService.translate(request);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    @GetMapping("/video/{videoId}")
    public ResponseEntity<Map<String, Object>> getTranslationsByVideo(
            @PathVariable Long videoId,
            @RequestParam(required = false) String targetLanguage) {
        try {
            List<TranslationResponse> translations = translationService.getTranslationsByVideo(videoId, targetLanguage);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", translations);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    @GetMapping("/languages")
    public ResponseEntity<Map<String, Object>> getSupportedLanguages() {
        try {
            String[] languages = translationService.getSupportedLanguages();
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", languages);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }
}

