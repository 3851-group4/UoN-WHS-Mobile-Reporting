package group4.backend.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> {

    private Integer page;
    private Integer pageSize;
    private Long total;
    private Long totalPages;
    private List<T> records;
}
