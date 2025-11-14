package com.videostep.auth.controller;

import com.videostep.auth.dto.AuthResponse;
import com.videostep.auth.dto.LoginRequest;
import com.videostep.auth.dto.RegisterRequest;
import com.videostep.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 認証コントローラー
 * サードパーティCookie廃止対応: HttpOnly Cookieを使用
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"*"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Value("${app.cookie.domain:}")
    private String cookieDomain;

    @Value("${app.cookie.secure:true}")
    private boolean cookieSecure;

    @Value("${app.cookie.same-site:none}")
    private String cookieSameSite;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse httpResponse) {
        try {
            AuthResponse response = authService.register(request);
            
            // HttpOnly Cookieを設定（サードパーティCookie廃止対応）
            setAuthCookie(httpResponse, response.getToken());
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse httpResponse) {
        try {
            AuthResponse response = authService.login(request);
            
            // HttpOnly Cookieを設定（サードパーティCookie廃止対応）
            setAuthCookie(httpResponse, response.getToken());
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    /**
     * 認証トークンをHttpOnly Cookieに設定
     * サードパーティCookie廃止対応: SameSite=None; Secureを使用
     */
    private void setAuthCookie(HttpServletResponse response, String token) {
        // SameSite属性を明示的に設定（Set-Cookieヘッダーに直接設定）
        StringBuilder cookieHeader = new StringBuilder();
        cookieHeader.append("auth_token=").append(token);
        cookieHeader.append("; Path=/");
        cookieHeader.append("; HttpOnly");
        cookieHeader.append("; Max-Age=").append(7 * 24 * 60 * 60); // 7日間
        
        // SameSite属性の設定
        cookieHeader.append("; SameSite=").append(cookieSameSite);
        
        // Secure属性の設定（HTTPS環境またはSameSite=Noneの場合）
        if (cookieSecure || "None".equalsIgnoreCase(cookieSameSite)) {
            cookieHeader.append("; Secure");
        }
        
        // Domain設定（指定されている場合）
        if (cookieDomain != null && !cookieDomain.isEmpty()) {
            cookieHeader.append("; Domain=").append(cookieDomain);
        }
        
        response.setHeader("Set-Cookie", cookieHeader.toString());
    }

    /**
     * ログアウトエンドポイント（Cookieを削除）
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletResponse httpResponse) {
        // Cookieを削除
        Cookie cookie = new Cookie("auth_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        
        if (cookieDomain != null && !cookieDomain.isEmpty()) {
            cookie.setDomain(cookieDomain);
        }
        
        httpResponse.addCookie(cookie);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Logged out successfully");
        return ResponseEntity.ok(result);
    }
}
