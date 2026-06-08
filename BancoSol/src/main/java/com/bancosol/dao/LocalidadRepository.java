package com.bancosol.dao;

import com.bancosol.entities.Localidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocalidadRepository extends JpaRepository<Localidad, Long> {

    @Query("SELECT l FROM Localidad l WHERE LOWER(l.nombre) = LOWER(:nombre)")
    Optional<Localidad> buscarPorNombre(@Param("nombre") String nombre);
}
