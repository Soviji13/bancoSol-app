//francisco javier garcia sierra 0% ia

package com.bancosol.dao;

import com.bancosol.entities.TiendaTurno;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TiendaTurnoRepository extends JpaRepository<TiendaTurno, Long> {

    //buscamos las asignaciones de un voluntario trayendo la tienda y el turno de golpe para evitar n+1!!!!
    @EntityGraph(attributePaths = {"tienda", "turno"})
    List<TiendaTurno> findByVoluntarioId(Long voluntarioId);
}