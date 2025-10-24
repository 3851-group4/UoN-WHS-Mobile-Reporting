package group4.backend.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    @Value("${minio.endpoint}")
    private String endpoint="test";

    @Value("${minio.access-key}")
    private String accessKey=System.getenv("MINIO_ACCESS_KEY");

    @Value("${minio.secret-key}")
    private String secretKey=System.getenv("MINIO_SECRET_KEY");

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }
}
