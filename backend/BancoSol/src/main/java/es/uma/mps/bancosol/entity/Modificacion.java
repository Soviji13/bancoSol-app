package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "modificacion")
public class Modificacion {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "interfaz", length = 100)
    private String interfaz;

    @Column(name = "accion")
    private String accion;

}