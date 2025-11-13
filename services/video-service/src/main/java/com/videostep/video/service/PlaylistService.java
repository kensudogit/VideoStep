package com.videostep.video.service;

import com.videostep.video.dto.CreatePlaylistRequest;
import com.videostep.video.dto.PlaylistDto;
import com.videostep.video.dto.VideoDto;
import com.videostep.video.entity.Playlist;
import com.videostep.video.entity.PlaylistVideo;
import com.videostep.video.entity.Video;
import com.videostep.video.repository.PlaylistRepository;
import com.videostep.video.repository.PlaylistVideoRepository;
import com.videostep.video.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * プレイリストサービス
 */
@Service
public class PlaylistService {

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private PlaylistVideoRepository playlistVideoRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Transactional
    public PlaylistDto createPlaylist(Long userId, CreatePlaylistRequest request) {
        Playlist playlist = new Playlist();
        playlist.setUserId(userId);
        playlist.setName(request.getName());
        playlist.setDescription(request.getDescription());
        playlist.setIsPublic(request.getIsPublic());
        playlist.setVideoCount(0L);

        Playlist saved = playlistRepository.save(playlist);
        return convertToDto(saved);
    }

    public List<PlaylistDto> getUserPlaylists(Long userId) {
        List<Playlist> playlists = playlistRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return playlists.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 公開プレイリスト一覧を取得（共有用）
     */
    public List<PlaylistDto> getPublicPlaylists(int page, int size) {
        List<Playlist> playlists = playlistRepository.findByIsPublicTrueOrderByCreatedAtDesc();
        // ページネーション処理（簡易版）
        int start = page * size;
        int end = Math.min(start + size, playlists.size());
        if (start >= playlists.size()) {
            return List.of();
        }
        return playlists.subList(start, end).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 特定ユーザーの公開プレイリストを取得
     */
    public List<PlaylistDto> getPublicPlaylistsByUserId(Long userId) {
        List<Playlist> playlists = playlistRepository.findByUserIdAndIsPublicTrueOrderByCreatedAtDesc(userId);
        return playlists.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PlaylistDto getPlaylistById(Long playlistId, Long userId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        // プライベートプレイリストは所有者のみアクセス可能
        if (!playlist.getIsPublic() && !playlist.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to access this playlist");
        }

        PlaylistDto dto = convertToDto(playlist);
        // 動画を取得
        List<PlaylistVideo> playlistVideos = playlistVideoRepository.findByPlaylistIdOrderByPositionAsc(playlistId);
        List<VideoDto> videos = playlistVideos.stream()
                .map(pv -> {
                    Video video = videoRepository.findById(pv.getVideoId()).orElse(null);
                    return video != null ? VideoMapper.toDto(video) : null;
                })
                .filter(v -> v != null)
                .collect(Collectors.toList());
        dto.setVideos(videos);
        return dto;
    }

    @Transactional
    public PlaylistDto addVideoToPlaylist(Long playlistId, Long videoId, Long userId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        if (!playlist.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to modify this playlist");
        }

        if (playlistVideoRepository.existsByPlaylistIdAndVideoId(playlistId, videoId)) {
            throw new RuntimeException("Video already in playlist");
        }

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        // 位置を決定（最後に追加）
        List<PlaylistVideo> existingVideos = playlistVideoRepository.findByPlaylistIdOrderByPositionAsc(playlistId);
        int nextPosition = existingVideos.size();

        PlaylistVideo playlistVideo = new PlaylistVideo();
        playlistVideo.setPlaylistId(playlistId);
        playlistVideo.setVideoId(videoId);
        playlistVideo.setPosition(nextPosition);
        playlistVideoRepository.save(playlistVideo);

        // 動画数を更新
        playlist.setVideoCount(playlist.getVideoCount() + 1);
        playlistRepository.save(playlist);

        return getPlaylistById(playlistId, userId);
    }

    @Transactional
    public void removeVideoFromPlaylist(Long playlistId, Long videoId, Long userId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        if (!playlist.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to modify this playlist");
        }

        PlaylistVideo playlistVideo = playlistVideoRepository.findByPlaylistIdOrderByPositionAsc(playlistId)
                .stream()
                .filter(pv -> pv.getVideoId().equals(videoId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Video not in playlist"));

        playlistVideoRepository.delete(playlistVideo);

        // 動画数を更新
        playlist.setVideoCount(Math.max(0, playlist.getVideoCount() - 1));
        playlistRepository.save(playlist);
    }

    @Transactional
    public void deletePlaylist(Long playlistId, Long userId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        if (!playlist.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this playlist");
        }

        playlistVideoRepository.deleteByPlaylistId(playlistId);
        playlistRepository.deleteById(playlistId);
    }

    @Transactional
    public PlaylistDto updatePlaylist(Long playlistId, Long userId, CreatePlaylistRequest request) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        if (!playlist.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to modify this playlist");
        }

        playlist.setName(request.getName());
        playlist.setDescription(request.getDescription());
        playlist.setIsPublic(request.getIsPublic());

        Playlist updated = playlistRepository.save(playlist);
        return convertToDto(updated);
    }

    private PlaylistDto convertToDto(Playlist playlist) {
        PlaylistDto dto = new PlaylistDto();
        dto.setId(playlist.getId());
        dto.setUserId(playlist.getUserId());
        dto.setName(playlist.getName());
        dto.setDescription(playlist.getDescription());
        dto.setIsPublic(playlist.getIsPublic());
        dto.setVideoCount(playlist.getVideoCount());
        dto.setCreatedAt(playlist.getCreatedAt());
        dto.setUpdatedAt(playlist.getUpdatedAt());
        return dto;
    }
}
