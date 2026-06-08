package com.bancosol.dao;

import com.bancosol.entities.Turno;
import com.bancosol.entities.enums.TurnoDia;
import com.bancosol.entities.enums.TurnoFranja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional; // ¡Importante!

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {

    @Query("SELECT t FROM Turno t WHERE t.dia = :dia AND t.franjaHoraria = :franja")
    Optional<Turno> findByDiaAndFranja(@Param("dia") TurnoDia dia, @Param("franja") TurnoFranja franja);
}