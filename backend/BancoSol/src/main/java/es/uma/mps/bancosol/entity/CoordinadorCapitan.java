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
@Table(name = "coordinador_capitan")
public class CoordinadorCapitan {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "entidad")
    private String entidad;

    @Column(name = "area")
    private String area;

    @Column(name = "tiendas")
    private Integer tiendas;

    @Column(name = "permiso_mod")
    private Boolean permisoMod;

}