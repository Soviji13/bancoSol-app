package com.bancosol.dao;

import com.bancosol.entities.ColaboradorCampania;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ColaboradorCampaniaRepository extends JpaRepository<ColaboradorCampania, Long> {

    // Método que servirá para la regla: "Última participación de la Entidad"
    // Busca todas las participaciones de una entidad y las ordena por el año de la campaña.
    //List<ColaboradorCampania> findByEntidadIdOrderByCampaniaAnioDesc(Long entidadId);
}