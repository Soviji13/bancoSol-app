package com.bancosol.dao;

import com.bancosol.entities.EntidadColaboradora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntidadColaboradoraRepository extends JpaRepository<EntidadColaboradora, Long> {
    List<EntidadColaboradora> findByCoordinador_Id(Long coordinadorId);

    // Para poder obtener las entidades con sus tiendas correspondientes a la campaña
    // Generado con IA (pero razonado y pensado por mí) - Sofía Si Villalba Jiménez

    // Entendiéndolo, parece ser que LEFT es necesario, para que aunque la entidad
    // colaboradora aún no tenga tiendas asignadas (no debería, pero podría pasar)
    // la entidad colaboradora de igual forma se pueda devolver

    // Por otro lado, sin FETCH, las relaciones "lazy" no devolverían correctamente
    // los datos. En este caso, necesitamos acceder a un objeto, no a una columna de la tabla

    @Query("SELECT DISTINCT e FROM EntidadColaboradora e " +
            "LEFT JOIN FETCH e.tiendasAsignadas tc " +          
            "LEFT JOIN FETCH tc.tienda t " +
            "WHERE tc.campania.id = :idCampania")
    List<EntidadColaboradora> findByCampaniaWithTiendas(@Param("idCampania") Long idCampania);
}