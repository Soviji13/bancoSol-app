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
@Table(name = "clasificacion")
public class Clasificacion {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "nota_ubicacion")
    private Integer notaUbicacion;

    @Column(name = "num_clientes")
    private Integer numClientes;

    @Column(name = "recaudacion")
    private Integer recaudacion;

    @Column(name = "total")
    private Integer total;

    @Column(name = "categoria")
    private Integer categoria;

}