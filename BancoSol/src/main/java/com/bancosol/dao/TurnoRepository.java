package com.bancosol.dao;

import com.bancosol.entities.Turno;
import com.bancosol.entities.enums.TurnoDia;
import com.bancosol.entities.enums.TurnoFranja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {

    // CORREGIDO: Ahora busca el turno ESPECÍFICO de la campaña elegida
    @Query("SELECT t FROM Turno t WHERE t.dia = :dia AND t.franjaHoraria = :franja AND t.campania.id = :campaniaId")
    Optional<Turno> findByDiaAndFranjaAndCampaniaId(@Param("dia") TurnoDia dia, @Param("franja") TurnoFranja franja, @Param("campaniaId") Long campaniaId);
}