package com.bancosol.dao;

import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.entities.ResponsableEntidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntidadColaboradoraRepository extends JpaRepository<EntidadColaboradora, Long> {
    
    List <EntidadColaboradora> findByCoordinador_Id(Long coordinadorId);

    @Query("""
        SELECT COUNT(DISTINCT tiendaAsignada.id)
        FROM ResponsableEntidad responsable
        JOIN responsable.colaborador colaborador
        LEFT JOIN colaborador.tiendasAsignadas tiendaAsignada
        WHERE colaborador.coordinador.id = :coordinadorId
    """)
    Long contarTiendasPorCoordinador(@Param("coordinadorId") Long coordinadorId);

}