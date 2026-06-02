package com.bancosol.dao;
import com.bancosol.entities.Campania;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CampaniaRepository extends JpaRepository<Campania, Long> {

    Optional<Campania> findByActivaTrue();
}