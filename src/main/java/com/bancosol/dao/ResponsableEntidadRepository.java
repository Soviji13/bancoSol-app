package com.bancosol.dao;

import com.bancosol.entities.ResponsableEntidad;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Sofía Sí Villalba Jiménez - Ayuda IA para querys donde se comentan
@Repository
public interface ResponsableEntidadRepository extends JpaRepository<ResponsableEntidad, Long> {

        // Ayuda IA
        @Query("SELECT r FROM ResponsableEntidad r WHERE r.esContactoPrincipal = true " +
                        "AND r.colaborador.id = :idEntidad")
        ResponsableEntidad findPrincipalByEntidadId(@Param("idEntidad") Long idEntidad);

        Optional<ResponsableEntidad> findByUsuarioId(Long usuarioId);

}
