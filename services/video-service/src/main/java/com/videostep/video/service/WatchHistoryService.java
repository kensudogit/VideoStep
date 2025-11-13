package com.videostep.video.service;

import com.videostep.video.dto.VideoDto;
import com.videostep.video.entity.Video;
import com.videostep.video.entity.WatchHistory;
import com.videostep.video.repository.VideoRepository;
import com.videostep.video.repository.WatchHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 視聴履歴サービス
 */
@Service
public class WatchHistoryService {

    @Autowired
    private WatchHistoryRepository historyRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Transactional
    public void recordWatch(Long videoId, Long userId, Long watchDuration, Long lastPosition) {
        Optional<WatchHistory> existing = historyRepository.findByVideoIdAndUserId(videoId, userId);

        if (existing.isPresent()) {
            WatchHistory history = existing.get();
            history.setWatchDuration(history.getWatchDuration() + watchDuration);
            history.setLastPosition(lastPosition);
            history.setWatchedAt(java.time.LocalDateTime.now());
            historyRepository.save(history);
        } else {
            WatchHistory history = new WatchHistory();
            history.setVideoId(videoId);
            history.setUserId(userId);
            history.setWatchDuration(watchDuration);
            history.setLastPosition(lastPosition);
            historyRepository.save(history);
        }
    }

    public List<VideoDto> getWatchHistory(Long userId) {
        List<WatchHistory> histories = historyRepository.findByUserIdOrderByWatchedAtDesc(userId);
        return histories.stream()
                .map(history -> {
                    Video video = videoRepository.findById(history.getVideoId()).orElse(null);
                    return video != null ? VideoMapper.toDto(video) : null;
                })
                .filter(v -> v != null)
                .collect(Collectors.toList());
    }

    public Long getLastPosition(Long videoId, Long userId) {
        Optional<WatchHistory> history = historyRepository.findByVideoIdAndUserId(videoId, userId);
        return history.map(WatchHistory::getLastPosition).orElse(0L);
    }

    @Transactional
    public void clearWatchHistory(Long userId) {
        List<WatchHistory> histories = historyRepository.findByUserIdOrderByWatchedAtDesc(userId);
        historyRepository.deleteAll(histories);
    }
}
