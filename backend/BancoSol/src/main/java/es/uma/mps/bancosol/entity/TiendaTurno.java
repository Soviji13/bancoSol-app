package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "tienda_turno")
public class TiendaTurno {
    @EmbeddedId
    private TiendaTurnoId id;

    @MapsId("idEntidad")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_entidad", nullable = false)
    private EntidadColaboradora idEntidad;

    @MapsId("idResponsable")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_responsable", nullable = false)
    private ResponsableTienda idResponsable;

    @MapsId("idTurno")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_turno", nullable = false)
    private Turno idTurno;

}