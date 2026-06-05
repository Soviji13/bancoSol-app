package com.bancosol.dao;

import com.bancosol.entities.ResponsableEntidad;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponsableEntidadRepository extends JpaRepository<ResponsableEntidad, Long> {
        @Query (
                "SELECT r FROM ResponsableEntidad r WHERE r.esContactoPrincipal = true " +
                "AND r.colaborador.id = :idEntidad"
        )
        ResponsableEntidad findPrincipalByEntidadId(@Param("idEntidad") Long idEntidad);

}
