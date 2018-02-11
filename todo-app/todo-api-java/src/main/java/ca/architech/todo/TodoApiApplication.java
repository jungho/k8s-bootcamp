package ca.architech.todo;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
@EnableMongoRepositories("ca.architech.todo.services")
public class TodoApiApplication extends WebMvcConfigurerAdapter {
    private static final Log logger;

    static {
        logger = LogFactory.getLog(TodoApiApplication.class);
    }

    public static void main(String[] args) {
        String mongodb_url = System.getenv("MONGODB_URL");
        logger.info(String.format("MONGODB_URL was set to: %s", mongodb_url));
        SpringApplication.run(TodoApiApplication.class, args);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String allowed_origins = System.getenv("ALLOWED_ORIGINS");

        logger.info(String.format("origins set to %s", allowed_origins));

        if (allowed_origins != null) {
            registry.addMapping("/api/todos/**")
                    .allowedOrigins(allowed_origins)
                    .allowedMethods("GET", "PUT", "DELETE", "PATCH", "POST")
                    .allowCredentials(false).maxAge(3600);
        }
    }
}
