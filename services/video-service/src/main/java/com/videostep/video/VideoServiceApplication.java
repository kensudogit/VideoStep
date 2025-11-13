package com.videostep.video;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * 動画サービスアプリケーション
 * 動画のアップロード、管理、再生を担当
 */
@SpringBootApplication
@EnableFeignClients
public class VideoServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(VideoServiceApplication.class, args);
    }
}
