//Query realizada por Jose
package com.bancosol.dao;

import com.bancosol.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);

    // Sofía añadido para lanzar errores
    boolean existsByEmail (String email);
}