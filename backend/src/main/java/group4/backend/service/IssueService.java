package group4.backend.service;

import group4.backend.dto.IssueAddOrUpdateDto;
import group4.backend.vo.IssueVo;

import java.util.List;

public interface IssueService {


    Long upsertIssue(Long id, IssueAddOrUpdateDto issueAddOrUpdateDto);

    void deleteIssue(Long id, Long issueId);

    List<IssueVo> getIssuesByUserId(Long id);

    List<IssueVo> getAllIssues();

    void updateIssueStatus(Long issueId, String status);
}
