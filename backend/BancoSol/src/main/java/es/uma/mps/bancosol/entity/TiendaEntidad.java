package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "tienda_entidad")
public class TiendaEntidad {
    @EmbeddedId
    private TiendaEntidadId id;

    @MapsId("tiendaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tienda_id", nullable = false)
    private Tienda tienda;

    @MapsId("entidadId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "entidad_id", nullable = false)
    private EntidadColaboradora entidad;

}