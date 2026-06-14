// Sofía Si Villalba Jiménez - Uso de IA generativa 

package com.bancosol.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.entities.TiendaColaborador;

import jakarta.transaction.Transactional;

import java.util.List;

@Repository
public interface TiendaColaboradorRepository extends JpaRepository<TiendaColaborador, Long> {

    // Para poder obtener las entidades con sus tiendas correspondientes a la
    // campaña
    // Generado con IA (pero razonado y pensado por mí) - Sofía Si Villalba Jiménez

    // Entendiéndolo, parece ser que LEFT es necesario, para que aunque la entidad
    // colaboradora aún no tenga tiendas asignadas (no debería, pero podría pasar)
    // la entidad colaboradora de igual forma se pueda devolver

    // Por otro lado, sin FETCH, las relaciones "lazy" no devolverían correctamente
    // los datos. En este caso, necesitamos acceder a un objeto, no a una columna de
    // la tabla
    @Query("SELECT tc FROM TiendaColaborador tc " +
            "JOIN FETCH tc.colaborador c " +
            "JOIN FETCH tc.tienda t " +
            "WHERE tc.campania.id = :idCampania")
    List<TiendaColaborador> findTiendaColabByCampaniaId(@Param("idCampania") Long idCampania);

    List<TiendaColaborador> findByColaboradorId(Long colaboradorId);

    List<TiendaColaborador> findByCampaniaId(Long campaniaId);

    @Transactional
    void deleteByColaboradorId(Long idColaborador);

    @Query("SELECT DISTINCT c FROM EntidadColaboradora c " +
            "JOIN c.campanias cam " +
            "LEFT JOIN c.tiendasAsignadas tc ON tc.campania.id = :campaniaId " +
            "LEFT JOIN tc.tienda t " +
            "WHERE cam.id = :campaniaId " +
            "AND (CAST(:activo AS boolean) IS NULL OR c.estadoActivo = :activo) " +
            "AND (CAST(:esCapital AS boolean) IS NULL OR c.direccion.esCapital = :esCapital) " +
            "AND (CAST(:localidadId AS long) IS NULL OR c.direccion.localidad.id = :localidadId) " +
            "AND (:nombreTienda IS NULL OR :nombreTienda = '' OR LOWER(t.nombre) LIKE LOWER(CONCAT('%', :nombreTienda, '%')))")
    List<EntidadColaboradora> findFiltrosByCampania(
            @Param("campaniaId") Long campaniaId,
            @Param("activo") Boolean activo,
            @Param("esCapital") Boolean esCapital,
            @Param("localidadId") Long localidadId,
            @Param("nombreTienda") String nombreTienda);
}
