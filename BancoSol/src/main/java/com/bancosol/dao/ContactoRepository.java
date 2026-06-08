package com.bancosol.dao;

import com.bancosol.entities.Contacto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContactoRepository extends JpaRepository<Contacto, Long> {

    Optional<Contacto> findByEmail(String email);

    Optional<Contacto> findByTelefono(String telefono);
}
