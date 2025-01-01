package com.example.keepitup.model.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MailDTO {
    private String to;
    private String subject;
    private String text;
}
