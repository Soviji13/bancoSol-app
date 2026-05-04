package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "notificacion")
public class Notificacion {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "asunto")
    private String asunto;

    @Column(name = "descripcion")
    @Type(type = "org.hibernate.type.TextType")
    private String descripcion;

    @Column(name = "interfaz")
    private Integer interfaz;

}