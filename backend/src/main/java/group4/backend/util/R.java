package group4.backend.util;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;


// result data
@Data
public class R<T> implements Serializable {

    @Serial
    private static final long serialVersionUID = 411731814484355577L;

    private int code;
    private String msg;
    private T data;

    public R() {
        this.code = 200;
        this.msg = "success";
    }

    public  R(T data ){


        this.code =200;
        this.msg = "success";
        this.data = data;

    }


    public static R error() {
        return error(500, "unknow error");
    }

    public static R error(String msg) {
        return error(500, msg);
    }

    public static R error(int code, String msg) {
        R r = new R();
        r.setCode(code);
        r.setMsg(msg);
        return r;
    }



    public static <T> R<T> ok( T data) {
        R<T> r = new R<>(data);

        return r;
    }

    public static R ok() {
        return new R();
    }


}
