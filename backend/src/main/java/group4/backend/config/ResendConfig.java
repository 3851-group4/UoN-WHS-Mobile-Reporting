package group4.backend.config;


import com.resend.Resend;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ResendConfig {


    @Bean
    public Resend resend(){

        // replace it to your api key
        String apiKey = System.getenv("RESEND_API_KEY");

        return new Resend(apiKey);


    }

}
