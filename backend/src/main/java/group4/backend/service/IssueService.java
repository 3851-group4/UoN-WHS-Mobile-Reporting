package group4.backend.service;

import group4.backend.dto.IssueAddOrUpdateDto;

public interface IssueService {
    Long upsertIssue(Long id, IssueAddOrUpdateDto issueAddOrUpdateDto);
}
