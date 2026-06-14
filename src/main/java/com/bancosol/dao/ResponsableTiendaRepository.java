package com.bancosol.dao;

import com.bancosol.entities.ResponsableTienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResponsableTiendaRepository extends JpaRepository<ResponsableTienda, Long> {

    // francisco javier garciasiserra consulta ia para ayuda sobre NOT IN y
    // anidamiento de selects en query
    @Query("SELECT r FROM ResponsableTienda r WHERE r.id NOT IN (SELECT t.responsableTienda.id FROM Tienda t WHERE t.responsableTienda IS NOT NULL)")
    List<ResponsableTienda> findResponsablesSinTienda();

    // Sofía Si Villalba Jiménez 0 IA
    Optional<ResponsableTienda> findByUsuarioId(Long usuarioId);
}
