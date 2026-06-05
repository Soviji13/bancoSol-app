package com.bancosol.dao;

import com.bancosol.entities.EntidadColaboradora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntidadColaboradoraRepository extends JpaRepository<EntidadColaboradora, Long> {
    
    List <EntidadColaboradora> findByCoordinador_Id(Long coordinadorId);
}