package com.bancosol.dao;

import com.bancosol.entities.DistritoCp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistritoCpRepository extends JpaRepository<DistritoCp, Long> {
}
