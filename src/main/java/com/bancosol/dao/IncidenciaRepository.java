package com.bancosol.dao;

import com.bancosol.entities.Incidencia;
import com.bancosol.entities.enums.EstadoIncidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidenciaRepository extends JpaRepository<Incidencia, Long> {

    List<Incidencia> findAllByOrderByFechaHoraDesc();

    List<Incidencia> findByEstadoOrderByFechaHoraDesc(EstadoIncidencia estado);
}