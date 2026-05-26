package com.bancosol.dao;

import com.bancosol.entities.SolicitudCambio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudCambioRepository extends JpaRepository<SolicitudCambio, Long> {
}
