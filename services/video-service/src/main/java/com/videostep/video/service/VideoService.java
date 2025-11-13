package com.videostep.video.service;

import com.videostep.video.dto.CreateVideoRequest;
import com.videostep.video.dto.PageResponse;
import com.videostep.video.dto.VideoDto;
import com.videostep.video.entity.Video;
import com.videostep.video.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 動画サービス
 */
@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Transactional
    public VideoDto createVideo(Long userId, CreateVideoRequest request) {
        Video video = new Video();
        video.setUserId(userId);
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setCategory(request.getCategory());
        video.setTags(request.getTags());
        video.setIsPublic(request.getIsPublic());
        video.setStatus("UPLOADING");
        video.setViewCount(0L);
        video.setLikeCount(0L);

        Video savedVideo = videoRepository.save(video);
        return convertToDto(savedVideo);
    }

    public VideoDto getVideoById(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        return convertToDto(video);
    }

    public List<VideoDto> getVideosByUserId(Long userId) {
        return videoRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<VideoDto> getPublicVideos() {
        return videoRepository.findByIsPublicTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PageResponse<VideoDto> getPublicVideos(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Video> videoPage = videoRepository.findByIsPublicTrueOrderByCreatedAtDesc(pageable);

        List<VideoDto> content = videoPage.getContent()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                videoPage.getNumber(),
                videoPage.getTotalPages(),
                videoPage.getTotalElements(),
                videoPage.getSize(),
                videoPage.hasNext(),
                videoPage.hasPrevious(),
                videoPage.isFirst(),
                videoPage.isLast());
    }

    public List<VideoDto> searchVideos(String keyword) {
        return videoRepository.searchByKeyword(keyword)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PageResponse<VideoDto> searchVideos(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Video> videoPage = videoRepository.searchPublicVideosByKeyword(keyword, pageable);

        List<VideoDto> content = videoPage.getContent()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                videoPage.getNumber(),
                videoPage.getTotalPages(),
                videoPage.getTotalElements(),
                videoPage.getSize(),
                videoPage.hasNext(),
                videoPage.hasPrevious(),
                videoPage.isFirst(),
                videoPage.isLast());
    }

    public PageResponse<VideoDto> getVideosByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Video> videoPage = videoRepository.findByCategoryAndIsPublicTrueOrderByCreatedAtDesc(category, pageable);

        List<VideoDto> content = videoPage.getContent()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                videoPage.getNumber(),
                videoPage.getTotalPages(),
                videoPage.getTotalElements(),
                videoPage.getSize(),
                videoPage.hasNext(),
                videoPage.hasPrevious(),
                videoPage.isFirst(),
                videoPage.isLast());
    }

    @Transactional
    public VideoDto updateVideoStatus(Long id, String status, String videoUrl, Long duration, Long fileSize) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        video.setStatus(status);
        if (videoUrl != null) {
            video.setVideoUrl(videoUrl);
        }
        if (duration != null) {
            video.setDuration(duration);
        }
        if (fileSize != null) {
            video.setFileSize(fileSize);
        }
        Video updatedVideo = videoRepository.save(video);
        return convertToDto(updatedVideo);
    }

    @Transactional
    public void incrementViewCount(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        video.setViewCount(video.getViewCount() + 1);
        videoRepository.save(video);
    }

    @Transactional
    public void deleteVideo(Long id, Long userId) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        if (!video.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this video");
        }
        videoRepository.deleteById(id);
    }

    private VideoDto convertToDto(Video video) {
        VideoDto dto = new VideoDto();
        dto.setId(video.getId());
        dto.setUserId(video.getUserId());
        dto.setTitle(video.getTitle());
        dto.setDescription(video.getDescription());
        dto.setVideoUrl(video.getVideoUrl());
        dto.setThumbnailUrl(video.getThumbnailUrl());
        dto.setDuration(video.getDuration());
        dto.setFileSize(video.getFileSize());
        dto.setStatus(video.getStatus());
        dto.setCategory(video.getCategory());
        dto.setTags(video.getTags());
        dto.setViewCount(video.getViewCount());
        dto.setLikeCount(video.getLikeCount());
        dto.setIsPublic(video.getIsPublic());
        dto.setCreatedAt(video.getCreatedAt());
        dto.setUpdatedAt(video.getUpdatedAt());
        return dto;
    }
}
