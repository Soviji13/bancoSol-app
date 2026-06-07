package com.bancosol.dao;

import com.bancosol.entities.Localidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocalidadRepository extends JpaRepository<Localidad, Long> {

    // Añadido por Sofía Si Villalba Jiménez (Ayuda de la IA)
    List<Localidad> findByZonaGeografica_Id(Long zonaGeograficaId);
}