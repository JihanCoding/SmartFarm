package com.smhrd.controller;

import com.smhrd.Service.MailService;
import com.smhrd.repository.UserRepository;

import java.security.SecureRandom;
import java.util.Map;

import org.springframework.web.bind.annotation.*;
import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/focus/api/mail")
public class MailRestController {

    private MailService mailService;
    private UserRepository user_repo;

    public MailRestController(MailService mailService, UserRepository user_repo){
        this.mailService = mailService;
        this.user_repo = user_repo;
    }

    @PostMapping("/send")
    public String sendTemporaryPassword(@RequestBody Map<String, String> formData) {
        System.out.println("메일센드");
        try {
            // 임시 비밀번호 생성
            String temporaryPassword = generateTemporaryPassword();
            
            // 메일 내용 구성
            String subject = "임시 비밀번호 발급 안내";
            String text = "<p>안녕하세요, 임시 비밀번호를 발급해드립니다.</p>" +
                          "<p><strong>임시 비밀번호: " + temporaryPassword + "</strong></p>" +
                          "<p>로그인 후 반드시 비밀번호를 변경해 주세요.</p>";

            // 메일 전송
            mailService.sendEmail(formData.get("email"), subject, text);

            // DB 비밀번호 변경
            user_repo.chagePassword(formData.get("email"), temporaryPassword);

            return "true";
        } catch (MessagingException e) {
            e.printStackTrace();
            return "false";
        }
    }

     // 랜덤 임시 비밀번호 생성 메소드
    private String generateTemporaryPassword() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(8);

        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(characters.length());
            password.append(characters.charAt(index));
        }
        return password.toString();
    }
}