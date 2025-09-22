package group4.backend.entity;

import lombok.Data;

import java.time.LocalDateTime;


@Data
public class IssuePicture {
    private Long id;
    private Long issueId;
    private String url;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;


}
