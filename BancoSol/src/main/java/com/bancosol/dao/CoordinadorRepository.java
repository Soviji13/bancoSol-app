package com.bancosol.dao;

import com.bancosol.entities.Coordinador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface  CoordinadorRepository extends JpaRepository<Coordinador, Long> {
}