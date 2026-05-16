package com.bancosol.dao;

import com.bancosol.entities.ResponsableTienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponsableTiendaRepository extends JpaRepository<ResponsableTienda, Long> {
}
