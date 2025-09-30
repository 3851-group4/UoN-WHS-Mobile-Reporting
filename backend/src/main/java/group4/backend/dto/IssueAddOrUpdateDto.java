package group4.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IssueAddOrUpdateDto {

    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime happenTime;


}
