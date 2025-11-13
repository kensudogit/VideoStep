package com.videostep.editing.service;

import com.videostep.editing.dto.CreateEditProjectRequest;
import com.videostep.editing.dto.EditSlideRequest;
import com.videostep.editing.entity.EditProject;
import com.videostep.editing.entity.EditSlide;
import com.videostep.editing.repository.EditProjectRepository;
import com.videostep.editing.repository.EditSlideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 編集サービス
 * スライド型動画編集機能を提供
 */
@Service
public class EditingService {

    @Autowired
    private EditProjectRepository projectRepository;

    @Autowired
    private EditSlideRepository slideRepository;

    @Transactional
    public EditProject createProject(Long userId, CreateEditProjectRequest request) {
        EditProject project = new EditProject();
        project.setVideoId(request.getVideoId());
        project.setUserId(userId);
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStatus("DRAFT");
        return projectRepository.save(project);
    }

    public List<EditProject> getProjectsByUser(Long userId) {
        return projectRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    public EditProject getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Transactional
    public EditSlide addSlide(Long projectId, EditSlideRequest request) {
        EditProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        EditSlide slide = new EditSlide();
        slide.setProjectId(projectId);
        slide.setSequence(request.getSequence());
        slide.setSlideUrl(request.getSlideUrl());
        slide.setTitle(request.getTitle());
        slide.setText(request.getText());
        slide.setStartTime(request.getStartTime());
        slide.setEndTime(request.getEndTime());
        slide.setTransitionType(request.getTransitionType());

        EditSlide saved = slideRepository.save(slide);
        project.setStatus("EDITING");
        projectRepository.save(project);
        return saved;
    }

    public List<EditSlide> getSlidesByProject(Long projectId) {
        return slideRepository.findByProjectIdOrderBySequenceAsc(projectId);
    }

    @Transactional
    public EditProject completeProject(Long projectId) {
        EditProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setStatus("COMPLETED");
        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long projectId, Long userId) {
        EditProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (!project.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this project");
        }
        slideRepository.deleteByProjectId(projectId);
        projectRepository.deleteById(projectId);
    }
}
