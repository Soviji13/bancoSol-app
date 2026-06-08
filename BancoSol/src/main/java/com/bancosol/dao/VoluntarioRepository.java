package com.bancosol.dao;

import com.bancosol.entities.Voluntario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoluntarioRepository extends JpaRepository<Voluntario, Long> {


    //los voluntarios se filtran por defecto por campañas al mostrar las tablas
    @Query("SELECT DISTINCT v FROM Voluntario v " +
            "JOIN v.responsable r " +
            "JOIN r.colaborador c " +
            "JOIN c.campanias camp " +
            "WHERE camp.id = :campaniaId")
    List<Voluntario> findByCampaniaId(@Param("campaniaId") Long campaniaId);

    //filtros de voluntarios por todas las categorias q hay disponibles para filtrar
    @Query("SELECT DISTINCT v FROM Voluntario v " +
            "JOIN v.responsable r " +
            "JOIN r.colaborador c " +
            "JOIN c.campanias camp " +
            "LEFT JOIN v.tiendaTurnos tt " +
            "LEFT JOIN tt.tienda t " +
            "WHERE camp.id = :campaniaId " +
            "AND (:voluntarioId IS NULL OR v.id = :voluntarioId) " +
            "AND (:entidad IS NULL OR c.nombre = :entidad) " +
            "AND (:responsable IS NULL OR r.contacto.nombre = :responsable) " +
            "AND (:tienda IS NULL OR t.nombre = :tienda)")
    List<Voluntario> findFiltrados(
            @Param("campaniaId") Long campaniaId,
            @Param("voluntarioId") Long voluntarioId,
            @Param("entidad") String entidad,
            @Param("responsable") String responsable,
            @Param("tienda") String tienda
    );
}