package group4.backend.service.impl;

import group4.backend.dto.IssueAddOrUpdateDto;
import group4.backend.entity.Issue;
import group4.backend.enums.IssueStatusEnum;
import group4.backend.mapper.IssueMapper;
import group4.backend.service.IssueService;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class IssueServiceImpl implements IssueService {

    @Autowired
    IssueMapper issueMapper;


    // add or update issue
    @Override
    public Long upsertIssue(Long id, IssueAddOrUpdateDto issueAddOrUpdateDto) {

        Issue issue = new Issue();
        BeanUtils.copyProperties(issueAddOrUpdateDto,issue);
        issue.setUserId(id);



        // add issue
        if(issue.getId()==null)
        {

            issue.setStatus(IssueStatusEnum.PENDING.getStatus());
            issue.setCreateTime(LocalDateTime.now());
            issue.setUpdateTime(LocalDateTime.now());

            issueMapper.insert(issue);
        }
        else {
            // update issue

          Issue issue1 =  issueMapper.selectById(issue.getId());
          if(issue1==null) {
              throw new RuntimeException("issue not found");
          }
          if(!issue1.getStatus().equals(IssueStatusEnum.PENDING.getStatus())){
              throw new RuntimeException("issue not in pending status");
          }
            issue.setUpdateTime(LocalDateTime.now());

            issueMapper.update(issue);
        }


        return issue.getId();


    }
}
