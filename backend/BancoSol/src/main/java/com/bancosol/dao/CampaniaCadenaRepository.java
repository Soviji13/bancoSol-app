package com.bancosol.dao;

import com.bancosol.entities.CampaniaCadena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampaniaCadenaRepository extends JpaRepository<CampaniaCadena, Long> {
}