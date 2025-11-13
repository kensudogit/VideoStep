package com.videostep.user.service;

import com.videostep.user.entity.UserProfile;
import com.videostep.user.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ユーザーサービス
 */
@Service
public class UserService {

    @Autowired
    private UserProfileRepository profileRepository;

    public UserProfile getProfile(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found"));
    }

    @Transactional
    public UserProfile createOrUpdateProfile(Long userId, String name, String language) {
        UserProfile profile = profileRepository.findByUserId(userId)
                .orElse(new UserProfile());
        
        profile.setUserId(userId);
        if (name != null) {
            profile.setName(name);
        }
        if (language != null) {
            profile.setLanguage(language);
        }
        
        return profileRepository.save(profile);
    }

    @Transactional
    public UserProfile updateProfile(Long userId, UserProfile updateData) {
        UserProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found"));
        
        if (updateData.getName() != null) {
            profile.setName(updateData.getName());
        }
        if (updateData.getBio() != null) {
            profile.setBio(updateData.getBio());
        }
        if (updateData.getAvatarUrl() != null) {
            profile.setAvatarUrl(updateData.getAvatarUrl());
        }
        if (updateData.getLanguage() != null) {
            profile.setLanguage(updateData.getLanguage());
        }
        
        return profileRepository.save(profile);
    }
}

