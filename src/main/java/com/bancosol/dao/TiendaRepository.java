package com.bancosol.dao;

import com.bancosol.entities.Tienda;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TiendaRepository extends JpaRepository<Tienda, Long> {

    // Sofía Si Villalba Jiménez (Ayuda de la IA para razonar el por qué es necesario hacer esto)
    // Devuelve todas las tiendas de una campaña
    @Query("SELECT t FROM Tienda t JOIN t.campanias c WHERE c.id = :idCampania")
    List<Tienda> findByCampaniaId(@Param("idCampania") Long idCampania);


    //francisco javier garcia sierra
    //como la interfaz de tiendas te devuelve la tabla SIEMPRE filtrada por campañas, debemos aplicar siempre ese filtro
    //ademas nos traemos todos los datos q vamos a necesitar tanto para la tabla como para mostrar los detalles / modificar
    //lo hacemos a través de @EntityGraph q es lo mismo que hacer un join fetch (para evitar el n+1 cons) pero de forma mucho
    //mas limpia y dejando nuestra query mucho mas legible.
    //esta idea viene de haber visto q jose, (asi q tmb creditos a el) lo aplica en su
    //coordinadorRepository, y decidi investigar un poco las funcionalidades nativas de jpa, ya que me sorprendio
    //lo limpio y escueto q se veía
    //USO DE IA: consulta sobre como funciona el @EntityGraph y otras herramientas nativas de JPA por si las
    //aplico en el futuro
    @EntityGraph(attributePaths = {
            "direccion",
            "direccion.localidad",
            "direccion.distrito",
            "direccion.codigoPostal",
            "cadena",
            "responsableTienda",
            "responsableTienda.contacto"
    })
    @Query("SELECT t from Tienda t JOIN t.campanias c WHERE c.id = :idCampania")
    List<Tienda> filtrarPorCampania(@Param("idCampania") Long idCampania);


    //USO DE IA: correccion de la query ya q se me habia olvidado el lower y haber filtrado por campañas tambien, ADEMAS
    //ha petado por haberle metido null desde los inputs al no saber de q tipo es, asiq la ia me ha dado una solucion
    //poniendo "valores seguros" (-1L o vacíos)
    @EntityGraph(attributePaths = {
            "direccion",
            "direccion.localidad",
            "direccion.distrito",
            "direccion.codigoPostal",
            "cadena",
            "responsableTienda",
            "responsableTienda.contacto"
    })
    @Query("SELECT DISTINCT t FROM Tienda t " +
            "JOIN t.campanias c " +
            "LEFT JOIN t.direccion d " +
            "LEFT JOIN d.localidad loc " +
            "LEFT JOIN d.distrito dist " +
            "LEFT JOIN loc.zonaGeografica zona " +
            "LEFT JOIN t.colaboradores col " +
            "WHERE c.id = :idCampania " +
            "AND (:nombre = '' OR LOWER(t.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) " +
            "AND (:cadenaId = -1L OR t.cadena.id = :cadenaId) " +
            "AND (:localidadId = -1L OR loc.id = :localidadId) " +
            "AND (:distritoId = -1L OR dist.id = :distritoId) " +
            "AND (:zonaGeoId = -1L OR zona.id = :zonaGeoId) " +
            "AND (:colaboradorId = -1L OR col.id = :colaboradorId) " +
            "AND (:franquiciaStr = 'TODAS' OR (:franquiciaStr = 'SI' AND t.esFranquicia = true) OR (:franquiciaStr = 'NO' AND t.esFranquicia = false))")
    List<Tienda> filtrarTiendasAvanzado(
            @Param("idCampania") Long idCampania,
            @Param("nombre") String nombre,
            @Param("cadenaId") Long cadenaId,
            @Param("localidadId") Long localidadId,
            @Param("distritoId") Long distritoId,
            @Param("zonaGeoId") Long zonaGeoId,
            @Param("colaboradorId") Long colaboradorId,
            @Param("franquiciaStr") String franquiciaStr
    );
}
