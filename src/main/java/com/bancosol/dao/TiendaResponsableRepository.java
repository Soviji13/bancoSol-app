
//francisco javier garcia sierra ia 0%
//necesaria par a poder tratar la tabla intermedia TiendaResponsable de la bbdd

package com.bancosol.dao;

import com.bancosol.entities.TiendaResponsable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TiendaResponsableRepository extends JpaRepository<TiendaResponsable, Long> {
}