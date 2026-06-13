//francisco javier garcia sierra 0% ia

package com.bancosol.dao;

import com.bancosol.entities.Voluntario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoluntarioRepository extends JpaRepository<Voluntario, Long> {

    //la campania se saca por el camino exacto: voluntario -> tienda-turno -> turno -> campania!!!!
    //usamos subconsulta pq la entidad voluntario no tiene mapeada la lista de tiendaTurnos
    @EntityGraph(attributePaths = {"responsable", "responsable.contacto", "responsable.colaborador"})
    @Query("SELECT DISTINCT v FROM Voluntario v " +
            "WHERE v.id IN (SELECT tt.voluntario.id FROM TiendaTurno tt WHERE tt.turno.campania.id = :campaniaId)")
    List<Voluntario> buscarPorCampaniaId(@Param("campaniaId") Long campaniaId);

    //filtros avanzados cruzados
    @EntityGraph(attributePaths = {"responsable", "responsable.contacto", "responsable.colaborador"})
    @Query("SELECT DISTINCT v FROM Voluntario v " +
            "WHERE v.id IN (SELECT tt.voluntario.id FROM TiendaTurno tt WHERE tt.turno.campania.id = :campaniaId) " +
            "AND (:voluntarioId IS NULL OR v.id = :voluntarioId) " +
            "AND (:entidad IS NULL OR v.responsable.colaborador.nombre = :entidad) " +
            "AND (:responsable IS NULL OR v.responsable.contacto.nombre = :responsable) " +
            "AND (:tienda IS NULL OR v.id IN (SELECT tt2.voluntario.id FROM TiendaTurno tt2 WHERE tt2.tienda.nombre = :tienda))")
    List<Voluntario> buscarFiltrados(
            @Param("campaniaId") Long campaniaId,
            @Param("voluntarioId") Long voluntarioId,
            @Param("entidad") String entidad,
            @Param("responsable") String responsable,
            @Param("tienda") String tienda
    );
}