package group4.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class IssueAddOrUpdateDto {

    private Long id;
    private Long userId;
    private String title;
    private String brief;
    private String description;
    private String location;
    private String status;
    private String witnessInfo;
    private LocalDateTime happenTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    // issue pictures url
    private List<String> urls;


}
