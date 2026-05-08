package com.bancosol.dao;

import com.bancosol.entities.TiendaColaborador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TiendaColaboradorRepository extends JpaRepository<TiendaColaborador, Long>{
}