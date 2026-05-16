package com.bancosol.dao;

import com.bancosol.entities.ZonaGeografica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ZonaGeograficaRepository extends JpaRepository<ZonaGeografica, Long> {
    @Query("SELECT z FROM ZonaGeografica z WHERE LOWER(z.nombre) = LOWER(:nombre)")
    Optional<ZonaGeografica> buscarPorNombre(@Param("nombre") String nombre);

}