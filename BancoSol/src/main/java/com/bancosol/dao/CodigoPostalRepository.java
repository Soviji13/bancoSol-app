package com.bancosol.dao;

import com.bancosol.entities.CodigoPostal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodigoPostalRepository extends JpaRepository<CodigoPostal, Long> {

    @Query("SELECT cp FROM CodigoPostal cp WHERE cp.codigo = :codigo")
    Optional<CodigoPostal> buscarPorCodigo(@Param("codigo") Integer codigo);
}
