package com.bancosol.dao;

import com.bancosol.entities.Coordinador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.bancosol.entities.Usuario;

@Repository
public interface CoordinadorRepository extends JpaRepository<Coordinador, Long> {
  Optional<Coordinador> findByUsuario(Usuario usuario);
}