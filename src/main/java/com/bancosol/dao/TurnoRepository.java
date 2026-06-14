package com.bancosol.dao;

import com.bancosol.entities.Turno;
import com.bancosol.entities.enums.TurnoDia;
import com.bancosol.entities.enums.TurnoFranja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {

    //francisco javier garcia sierra 0% ia
    //busca el turno para no duplicarlos en base de datos!!!!
    Optional<Turno> findByDiaAndFranjaHorariaAndCampania_Id(TurnoDia dia, TurnoFranja franjaHoraria, Long campaniaId);
}