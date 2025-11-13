package com.videostep.video.service;

import com.videostep.video.dto.VideoDto;
import com.videostep.video.entity.Video;
import com.videostep.video.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 動画推奨サービス
 * シンプルな推奨アルゴリズムを実装
 */
@Service
public class RecommendationService {

    @Autowired
    private VideoRepository videoRepository;

    /**
     * 人気動画を取得（いいね数と視聴回数に基づく）
     */
    public List<VideoDto> getPopularVideos(int limit) {
        List<Video> videos = videoRepository.findByIsPublicTrueOrderByCreatedAtDesc();
        return videos.stream()
                .sorted((v1, v2) -> {
                    // スコア計算: いいね数 * 2 + 視聴回数
                    long score1 = (v1.getLikeCount() * 2) + v1.getViewCount();
                    long score2 = (v2.getLikeCount() * 2) + v2.getViewCount();
                    return Long.compare(score2, score1);
                })
                .limit(limit)
                .map(VideoMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * カテゴリに基づく推奨動画
     */
    public List<VideoDto> getRecommendedByCategory(String category, int limit) {
        List<Video> videos = videoRepository.findByCategoryAndIsPublicTrueOrderByCreatedAtDesc(category);
        return videos.stream()
                .sorted((v1, v2) -> {
                    long score1 = (v1.getLikeCount() * 2) + v1.getViewCount();
                    long score2 = (v2.getLikeCount() * 2) + v2.getViewCount();
                    return Long.compare(score2, score1);
                })
                .limit(limit)
                .map(VideoMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * 最新動画を取得
     */
    public List<VideoDto> getLatestVideos(int limit) {
        List<Video> videos = videoRepository.findByIsPublicTrueOrderByCreatedAtDesc();
        return videos.stream()
                .limit(limit)
                .map(VideoMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * 関連動画を取得（同じカテゴリまたはタグ）
     */
    public List<VideoDto> getRelatedVideos(Long videoId, int limit) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        List<Video> relatedVideos = videoRepository.findByIsPublicTrueOrderByCreatedAtDesc();
        return relatedVideos.stream()
                .filter(v -> !v.getId().equals(videoId))
                .filter(v -> {
                    // 同じカテゴリまたはタグが一致する動画
                    boolean sameCategory = video.getCategory() != null &&
                            video.getCategory().equals(v.getCategory());
                    boolean sameTag = video.getTags() != null && v.getTags() != null &&
                            video.getTags().contains(v.getTags());
                    return sameCategory || sameTag;
                })
                .limit(limit)
                .map(VideoMapper::toDto)
                .collect(Collectors.toList());
    }
}
