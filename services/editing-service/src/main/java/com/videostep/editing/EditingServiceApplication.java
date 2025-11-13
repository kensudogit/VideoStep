package com.videostep.editing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * 編集サービスアプリケーション
 * スライド型動画編集機能を提供
 */
@SpringBootApplication
@EnableFeignClients
public class EditingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EditingServiceApplication.class, args);
    }
}
