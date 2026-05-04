package com.bancosol.dao;

import com.bancosol.entities.ColaboradorCampania;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColaboradorCampaniaRepository extends JpaRepository<ColaboradorCampania, Long> {
}