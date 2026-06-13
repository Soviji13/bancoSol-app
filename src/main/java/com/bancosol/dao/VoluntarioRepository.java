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

    //filtro por campaña igual q en tiendas!!!!
    @EntityGraph(attributePaths = {
            "responsableEntidad",
            "responsableEntidad.contacto",
            "responsableEntidad.entidad"
    })
    @Query("SELECT v FROM Voluntario v JOIN v.responsable.colaborador.campanias c WHERE c.id = :idCampania")
    List<Voluntario> filtrarPorCampania(@Param("idCampania") Long idCampania);

    //filtros avanzados arreglados con los nombres reales de la BD q vimos en los logs!!!!
    @EntityGraph(attributePaths = {
            "responsableEntidad",
            "responsableEntidad.contacto",
            "responsableEntidad.entidad"
    })
    @Query("SELECT DISTINCT v FROM Voluntario v " +
            "JOIN v.responsable.colaborador.campanias c " +
            "LEFT JOIN v.responsable r " +
            "LEFT JOIN r.contacto cont " +
            "LEFT JOIN r.entidad e " +
            "WHERE c.id = :idCampania " +
            "AND (:nombre = '' OR LOWER(cont.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) " +
            "AND (:entidadId = -1L OR e.id = :entidadId) " +
            "AND (:horasSueltas IS NULL OR v.horasSueltas = :horasSueltas)")
    List<Voluntario> filtrarVoluntariosAvanzado(
            @Param("idCampania") Long idCampania,
            @Param("nombre") String nombre,
            @Param("entidadId") Long entidadId,
            @Param("horasSueltas") Boolean horasSueltas
    );
}