package com.bancosol.dao;

import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.entities.ResponsableEntidad;
import com.bancosol.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResponsableEntidadRepository extends JpaRepository<ResponsableEntidad, Long> {

    Optional<ResponsableEntidad> findByColaboradorAndUsuario(EntidadColaboradora colab, Usuario user);
}
