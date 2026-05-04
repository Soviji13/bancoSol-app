package com.bancosol.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "\"Entidad_colaboradora\"", schema = "public")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EntidadColaboradora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @Column(name = "\"nombre\"", nullable = false)
    private String nombre;

    @Column(name = "\"estado_activo\"", nullable = false)
    private Boolean estadoActivo;

    @Column(name = "\"observaciones\"")
    private String observaciones;

    @Column(name = "\"num_tiendas\"", nullable = false)
    private Short numTiendas;

    @Column(name = "\"num_turnos\"", nullable = false)
    private Short numTurnos;

    @Column(name = "\"num_voluntarios\"", nullable = false)
    private Short numVoluntarios;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"coordinador_id\"")
    private Coordinador coordinador;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "\"direccion_id\"", nullable = false)
    private Direccion direccion;
}