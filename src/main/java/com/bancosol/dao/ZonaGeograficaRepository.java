package com.bancosol.dao;

import com.bancosol.entities.ZonaGeografica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ZonaGeograficaRepository extends JpaRepository<ZonaGeografica, Long> {

    // Hecho por Sofía, devuelve solo la zona asignada a esa localidad
    Optional<ZonaGeografica> findByLocalidades_Id(Long localidadId);
}