package com.bancosol.dao;

import com.bancosol.entities.TiendaCampania;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TiendaCampaniaRepository extends JpaRepository<TiendaCampania, Long> {
}