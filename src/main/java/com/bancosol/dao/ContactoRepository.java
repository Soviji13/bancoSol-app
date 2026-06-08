package com.bancosol.dao;

import com.bancosol.entities.Contacto;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ContactoRepository extends JpaRepository<Contacto, Long> {

    // Añadido por Sofía Si Villalba Jiménez (Ayuda IA para gestionar errores de repetición)
    boolean existsByTelefono(String telefono);
    boolean existsByEmail(String email);
}