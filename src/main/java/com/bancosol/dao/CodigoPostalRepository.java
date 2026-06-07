package com.bancosol.dao;

import com.bancosol.entities.CodigoPostal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodigoPostalRepository extends JpaRepository<CodigoPostal, Long> {

    // Sofía Si Villalba Jiménez - Ayuda IA
    // Devuelve los códigos postales que no tienen distrito
    @Query("SELECT cp FROM CodigoPostal cp WHERE cp.distritos IS EMPTY")
    List<CodigoPostal> findCpsSinDistrito();
}
