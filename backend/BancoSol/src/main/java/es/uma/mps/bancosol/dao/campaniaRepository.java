package es.uma.mps.bancosol.dao;

import es.uma.mps.bancosol.entity.Campania;
import org.springframework.data.jpa.repository.JpaRepository;

public interface campaniaRepository extends JpaRepository<Campania, Integer> {
}
