package group4.backend.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class IssueVo {



        private Long id;
        private Long userId;
        private String title;
        private String brief;
        private String description;
        private String location;
        private String status;
        private String witnessInfo;
        private LocalDateTime happenTime;
        List<String> urls;





}
