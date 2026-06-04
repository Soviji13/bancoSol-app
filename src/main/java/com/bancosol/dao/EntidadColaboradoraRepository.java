package com.bancosol.dao;

import com.bancosol.entities.EntidadColaboradora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntidadColaboradoraRepository extends JpaRepository<EntidadColaboradora, Long> {
    
    List<EntidadColaboradora> findByCoordinador_Id(Long coordinadorId);
}