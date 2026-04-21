package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "entidad_colaboradora")
public class EntidadColaboradora {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "participa_actual")
    private Boolean participaActual;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ultima_campania_id")
    private Campania ultimaCampania;

    @Column(name = "observaciones")
    @Type(type = "org.hibernate.type.TextType")
    private String observaciones;

    @Column(name = "num_tiendas")
    private Integer numTiendas;

    @Column(name = "num_turnos")
    private Integer numTurnos;

    @Column(name = "num_voluntarios")
    private Integer numVoluntarios;

    @Column(name = "colabora_en")
    private String colaboraEn;

}