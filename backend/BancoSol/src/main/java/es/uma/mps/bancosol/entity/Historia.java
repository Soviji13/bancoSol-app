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
@Table(name = "historia")
public class Historia {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "mostrar_todo")
    private Boolean mostrarTodo;

    @Column(name = "mostrar_incidencia")
    private Boolean mostrarIncidencia;

    @Column(name = "mostrar_notificacion")
    private Boolean mostrarNotificacion;

    @Column(name = "mostrar_modificacion")
    private Boolean mostrarModificacion;

}