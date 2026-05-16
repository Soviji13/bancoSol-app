package com.bancosol.dao;

import com.bancosol.entities.TiendaTurno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TiendaTurnoRepository extends JpaRepository<TiendaTurno, Long> {
}