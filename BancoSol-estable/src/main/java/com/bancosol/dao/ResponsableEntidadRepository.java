package com.bancosol.dao;

import com.bancosol.entities.ResponsableEntidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponsableEntidadRepository extends JpaRepository<ResponsableEntidad, Long> {
}
