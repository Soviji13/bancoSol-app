package com.bancosol.dao;

import com.bancosol.entities.CoordinadorCampania;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoordinadorCampaniaRepository extends JpaRepository<CoordinadorCampania, Long> {
}
