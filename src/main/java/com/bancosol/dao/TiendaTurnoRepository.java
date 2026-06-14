//francisco javier garcia sierra

// ----- justificacion uso ia -----
// problema de transacciones jpa: al modificar, el delete se quedaba en cache y chocaba con el insert nuevo dando error 500 de unique. solucionado con @Modifying(clearAutomatically = true, flushAutomatically = true) pa forzar el borrado real en sql al instante!!!!
// --------------------------------

package com.bancosol.dao;

import com.bancosol.entities.TiendaTurno;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TiendaTurnoRepository extends JpaRepository<TiendaTurno, Long> {

    //traemos tienda y turno directamente para evitar el n+1 consultas
    @EntityGraph(attributePaths = {
            "tienda",
            "turno"
    })
    List<TiendaTurno> findByVoluntarioId(Long voluntarioId);

    //AYUDA IA
    //forzamos q vacie la cache de persistencia y borre de verdad en bd rapido!!!!
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM TiendaTurno tt WHERE tt.voluntario.id = :voluntarioId")
    void deleteByVoluntarioId(@Param("voluntarioId") Long voluntarioId);
}