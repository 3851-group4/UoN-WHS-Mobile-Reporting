package group4.backend.enums;

public enum IssueStatusEnum {


    PENDING(1, "pending"),
    IN_PROGRESS(2, "processing"),
    COMPLETED(3, "completed");

    private final int code;
    private final String status;

    IssueStatusEnum(int code, String description) {
        this.code = code;
        this.status = description;
    }

    public int getCode() {
        return code;
    }

    public String getStatus() {
        return status;
    }


    // get status enum by status
    public static IssueStatusEnum fromStatus(String status) {
        for (IssueStatusEnum statusEnum : IssueStatusEnum.values()) {
            if (statusEnum.getStatus().equalsIgnoreCase(status)) {
                return statusEnum;
            }
        }
        throw new IllegalArgumentException("status error");
    }

}


