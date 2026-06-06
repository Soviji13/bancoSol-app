package com.bancosol.dao;

import com.bancosol.entities.Tienda;
import org.springframework.data.jpa.repository.JpaRepository;
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
}