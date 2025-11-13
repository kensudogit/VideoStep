package com.videostep.editing.controller;

import com.videostep.editing.dto.CreateEditProjectRequest;
import com.videostep.editing.dto.EditSlideRequest;
import com.videostep.editing.entity.EditProject;
import com.videostep.editing.entity.EditSlide;
import com.videostep.editing.service.EditingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 編集コントローラー
 */
@RestController
@RequestMapping("/editing")
@CrossOrigin(origins = "*")
public class EditingController {

    @Autowired
    private EditingService editingService;

    @PostMapping("/projects")
    public ResponseEntity<Map<String, Object>> createProject(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CreateEditProjectRequest request) {
        try {
            EditProject project = editingService.createProject(userId, request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", project);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/projects")
    public ResponseEntity<Map<String, Object>> getProjects(
            @RequestHeader("X-User-Id") Long userId) {
        try {
            List<EditProject> projects = editingService.getProjectsByUser(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", projects);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<Map<String, Object>> getProject(@PathVariable Long id) {
        try {
            EditProject project = editingService.getProjectById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", project);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PostMapping("/projects/{projectId}/slides")
    public ResponseEntity<Map<String, Object>> addSlide(
            @PathVariable Long projectId,
            @Valid @RequestBody EditSlideRequest request) {
        try {
            EditSlide slide = editingService.addSlide(projectId, request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", slide);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/projects/{projectId}/slides")
    public ResponseEntity<Map<String, Object>> getSlides(@PathVariable Long projectId) {
        try {
            List<EditSlide> slides = editingService.getSlidesByProject(projectId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", slides);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/projects/{projectId}/complete")
    public ResponseEntity<Map<String, Object>> completeProject(@PathVariable Long projectId) {
        try {
            EditProject project = editingService.completeProject(projectId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", project);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/projects/{projectId}")
    public ResponseEntity<Map<String, Object>> deleteProject(
            @PathVariable Long projectId,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            editingService.deleteProject(projectId, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Project deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }
}
