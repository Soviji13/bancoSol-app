package com.bancosol.dao;

import com.bancosol.entities.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DireccionRepository extends JpaRepository<Direccion, Long> {

    @Query("SELECT d FROM Direccion d WHERE LOWER(d.calle) = LOWER(:calle) AND d.numero = :numero AND d.localidad.id = :locId")
    Optional<Direccion> buscarDireccionExacta(
            @Param("calle") String calle,
            @Param("numero") Short numero,
            @Param("locId") Long locId
    );

    @Query("SELECT d FROM Direccion d WHERE " +
            "UPPER(d.calle) = UPPER(:calle) AND " +
            "d.numero = :numero AND " +
            "d.localidad.id = :localidadId AND " +
            "d.codigoPostal.id = :cpId AND " +
            "d.esCapital = :esCapital AND " +
            "((:distritoId IS NULL AND d.distrito IS NULL) OR (d.distrito.id = :distritoId))")
    Optional<Direccion> buscarDireccionExacta(
            @Param("calle") String calle,
            @Param("numero") Short numero,
            @Param("localidadId") Long localidadId,
            @Param("cpId") Long cpId,
            @Param("distritoId") Long distritoId,
            @Param("esCapital") Boolean esCapital
    );
}
