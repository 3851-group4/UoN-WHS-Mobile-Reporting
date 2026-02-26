package group4.backend.mapper;

import group4.backend.entity.Issue;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface IssueMapper  {


    @Insert("insert into issue(user_id,title,brief,description,location,status,happen_time,create_time,update_time) values(#{userId},#{title},#{brief},#{description},#{location},#{status},#{happenTime},#{createTime},#{updateTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Issue issue);


    void update(Issue issue);

    @Select("select * from issue where id=#{id}")
    Issue selectById(Long id);

    @Delete("delete from issue where id=#{issueId}")
    void delete(Long issueId);

    @Select("select * from issue where user_id=#{id}")
    List<Issue> selectByUserId(Long id);

    @Select("select * from issue")
    List<Issue> selectAll();

    @Update("update issue set status=#{status}, update_time=#{updateTime} where id=#{id}")
    void updateStatus(@Param("id") Long id, @Param("status") String status, @Param("updateTime") LocalDateTime updateTime);
}
