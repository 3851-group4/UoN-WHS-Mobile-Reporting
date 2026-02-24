package group4.backend.config;


import com.resend.Resend;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ResendConfig {


    @Bean
    public Resend resend(){


        return new Resend("re_BanKPQfX_CXrZ4p2UmXgtdnqLRiMYgJpW");


    }

}
