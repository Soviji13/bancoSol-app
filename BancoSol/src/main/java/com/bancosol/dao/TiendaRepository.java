package com.bancosol.dao;

import com.bancosol.entities.Tienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TiendaRepository extends JpaRepository<Tienda, Long> {


    //Fran: seleccion de campaña para la lista de tiendas
    @Query("SELECT t FROM Tienda t JOIN t.campanias c WHERE c.id = :campaniaId")
    List<Tienda> findByCampaniasId(@Param("campaniaId") Long campaniaId);

    //Ia fran: query para filtrar tiendas por campos
    //Para hacer una única pasada por la base de datos y construir filtros dinámicos sin tener que cargar
    //todas las tiendas en memoria y filtrarlas en Java, optimizando el rendimiento
    @Query("SELECT DISTINCT t FROM Tienda t " +
            "LEFT JOIN t.cadena cad " +
            "LEFT JOIN t.direccion d " +
            "LEFT JOIN d.localidad loc " +
            "LEFT JOIN loc.zonaGeografica z " +
            "LEFT JOIN d.distrito dist " +
            "LEFT JOIN t.colaboradores col " +
            "LEFT JOIN t.responsableTienda resp " +
            "LEFT JOIN t.campanias c " +
            "WHERE (:campaniaId IS NULL OR c.id = :campaniaId) " +
            "AND (:nombre IS NULL OR UPPER(t.nombre) LIKE :nombre) " + // <-- Mucho más limpio y tipado para Postgres
            "AND (:cadenaId IS NULL OR cad.id = :cadenaId) " +
            "AND (:localidadId IS NULL OR loc.id = :localidadId) " +
            "AND (:distritoId IS NULL OR dist.id = :distritoId) " +
            "AND (:zonaGeoId IS NULL OR z.id = :zonaGeoId) " +
            "AND (:colaboradorId IS NULL OR col.id = :colaboradorId) " +
            "AND (:responsableTiendaId IS NULL OR resp.id = :responsableTiendaId) " +
            "AND (:esFranquicia IS NULL OR t.esFranquicia = :esFranquicia) " +
            "AND (:participaActiva IS NULL OR " +
            "    (:participaActiva = true AND :activeCampaniaId IS NOT NULL AND :activeCampaniaId IN (SELECT c2.id FROM t.campanias c2)) OR " +
            "    (:participaActiva = false AND (:activeCampaniaId IS NULL OR :activeCampaniaId NOT IN (SELECT c3.id FROM t.campanias c3))))")
    List<Tienda> filtrarTiendas(
            @Param("campaniaId") Long campaniaId,
            @Param("nombre") String nombre,
            @Param("cadenaId") Long cadenaId,
            @Param("localidadId") Long localidadId,
            @Param("distritoId") Long distritoId,
            @Param("zonaGeoId") Long zonaGeoId,
            @Param("colaboradorId") Long colaboradorId,
            @Param("responsableTiendaId") Long responsableTiendaId,
            @Param("participaActiva") Boolean participaActiva,
            @Param("esFranquicia") Boolean esFranquicia,
            @Param("activeCampaniaId") Long activeCampaniaId
    );
}