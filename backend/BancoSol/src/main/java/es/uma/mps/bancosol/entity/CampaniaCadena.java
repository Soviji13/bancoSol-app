package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "campania_cadena")
public class CampaniaCadena {
    @EmbeddedId
    private CampaniaCadenaId id;

    @MapsId("campaniaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "campania_id", nullable = false)
    private Campania campania;

    @MapsId("cadenaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cadena_id", nullable = false)
    private Cadena cadena;

    @Column(name = "participa")
    private Boolean participa;

}