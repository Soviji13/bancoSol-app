package com.bancosol.dao;

import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.entities.ResponsableEntidad;
import com.bancosol.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResponsableEntidadRepository extends JpaRepository<ResponsableEntidad, Long> {

    Optional<ResponsableEntidad> findByColaboradorAndUsuario(EntidadColaboradora colab, Usuario user);

    @Query("SELECT r FROM ResponsableEntidad r WHERE UPPER(r.contacto.nombre) = UPPER(:nombre) AND UPPER(r.colaborador.nombre) = UPPER(:entidad)")
    Optional<ResponsableEntidad> findByNombreAndEntidad(
            @Param("nombre") String nombre,
            @Param("entidad") String entidad);

    Optional<ResponsableEntidad> findByUsuario(Usuario usuario);
}