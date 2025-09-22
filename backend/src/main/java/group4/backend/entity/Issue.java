package group4.backend.entity;

import lombok.Data;

import java.time.LocalDateTime;


@Data
public class Issue {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String location;
    private String status;
    private LocalDateTime happenTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;


}
