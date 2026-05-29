package com.bancosol.dao;

import com.bancosol.entities.ZonaGeografica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ZonaGeograficaRepository extends JpaRepository<ZonaGeografica, Long> {
}