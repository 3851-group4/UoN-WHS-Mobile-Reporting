package group4.backend.controller;


import com.google.gson.Gson;
import group4.backend.dto.IssueAddOrUpdateDto;
import group4.backend.entity.Issue;
import group4.backend.entity.User;
import group4.backend.service.IssueService;
import group4.backend.util.R;
import group4.backend.vo.IssueVo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issue")
public class IssueController {


    @Autowired
    IssueService issueService;

    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Autowired
    Gson gson;



}
