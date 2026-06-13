//Queries realizadas por Jose
package com.bancosol.dao;

import com.bancosol.entities.Coordinador;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoordinadorRepository extends JpaRepository<Coordinador, Long> {

    @Override
    @EntityGraph(attributePaths = {
            "contacto",
            "usuario",
            "campanias"
    })
    List<Coordinador> findAll();

    @Override
    @EntityGraph(attributePaths = {
            "contacto",
            "usuario",
            "campanias"
    })
    Optional<Coordinador> findById(Long id);

    boolean existsByUsuario_Id(Long usuarioId);

    boolean existsByContacto_Id(Long contactoId);
}