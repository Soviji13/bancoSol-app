package com.bancosol.dao;

import com.bancosol.entities.Campania;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CampaniaRepository extends JpaRepository<Campania, Long> {
}