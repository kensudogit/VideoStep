package com.videostep.translation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * 翻訳サービスアプリケーション
 * 24言語対応の自動翻訳機能を提供
 */
@SpringBootApplication
@EnableFeignClients
public class TranslationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TranslationServiceApplication.class, args);
    }
}
