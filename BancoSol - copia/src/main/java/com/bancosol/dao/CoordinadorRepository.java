package com.bancosol.dao;

import com.bancosol.entities.Coordinador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoordinadorRepository extends JpaRepository<Coordinador, Long> {

    boolean existsByUsuario_Id(Long usuarioId);

    boolean existsByContacto_Id(Long contactoId);
}