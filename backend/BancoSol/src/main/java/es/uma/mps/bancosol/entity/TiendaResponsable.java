package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "tienda_responsable")
public class TiendaResponsable {
    @EmbeddedId
    private TiendaResponsableId id;

    @MapsId("tiendaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tienda_id", nullable = false)
    private Tienda tienda;

    @MapsId("responsableId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "responsable_id", nullable = false)
    private ResponsableTienda responsable;

    @MapsId("campaniaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "campania_id", nullable = false)
    private Campania campania;

}