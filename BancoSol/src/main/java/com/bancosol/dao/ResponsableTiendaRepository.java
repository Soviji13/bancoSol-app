package com.bancosol.dao;

import com.bancosol.entities.ResponsableTienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.bancosol.entities.Usuario;

@Repository
public interface ResponsableTiendaRepository extends JpaRepository<ResponsableTienda, Long> {
  Optional<ResponsableTienda> findByUsuario(Usuario usuario);
}
