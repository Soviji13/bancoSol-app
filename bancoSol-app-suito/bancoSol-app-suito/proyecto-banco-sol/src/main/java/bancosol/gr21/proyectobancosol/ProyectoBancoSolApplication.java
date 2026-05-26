package bancosol.gr21.proyectobancosol;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.bancosol")
@EnableJpaRepositories(basePackages = "com.bancosol.dao")
@EntityScan(basePackages = "com.bancosol.entities")
public class ProyectoBancoSolApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProyectoBancoSolApplication.class, args);
    }

}
