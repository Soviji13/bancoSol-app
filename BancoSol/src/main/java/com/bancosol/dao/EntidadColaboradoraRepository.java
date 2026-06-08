package com.bancosol.dao;

import com.bancosol.entities.Direccion;
import com.bancosol.entities.EntidadColaboradora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntidadColaboradoraRepository extends JpaRepository<EntidadColaboradora, Long> {

    long countByDireccion(Direccion direccion);
}
