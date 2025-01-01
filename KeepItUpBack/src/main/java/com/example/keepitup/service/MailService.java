package com.example.keepitup.service;

public interface MailService {
    void sendSimpleEmail(String to, String subject, String text);
}