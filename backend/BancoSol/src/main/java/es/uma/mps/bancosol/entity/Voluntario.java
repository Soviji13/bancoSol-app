package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "voluntario")
public class Voluntario {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tienda_id", nullable = false)
    private Tienda tienda;

    @Column(name = "capitan", length = 50)
    private String capitan;

    @Column(name = "observaciones")
    @Type(type = "org.hibernate.type.TextType")
    private String observaciones;

    @Column(name = "horas_sueltas")
    private Boolean horasSueltas;

    @Column(name = "hora_comienzo")
    private Instant horaComienzo;

    @Column(name = "hora_final")
    private Instant horaFinal;

}