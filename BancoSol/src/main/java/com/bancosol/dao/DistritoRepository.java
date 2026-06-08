package com.bancosol.dao;

import com.bancosol.entities.Distrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DistritoRepository extends JpaRepository<Distrito, Long> {

    @Query("SELECT d FROM Distrito d WHERE LOWER(d.nombre) = LOWER(:nombre)")
    Optional<Distrito> buscarPorNombre(@Param("nombre") String nombre);
}
