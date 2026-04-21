package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "incidencia")
public class Incidencia {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "hora")
    private Instant hora;

    @Column(name = "fecha")
    private LocalDate fecha;

    @Column(name = "descripcion")
    @Type(type = "org.hibernate.type.TextType")
    private String descripcion;

    @Column(name = "asunto")
    private String asunto;

}