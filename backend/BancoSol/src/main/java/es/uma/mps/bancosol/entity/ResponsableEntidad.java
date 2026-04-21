package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "responsable_entidad")
public class ResponsableEntidad {
    @EmbeddedId
    private ResponsableEntidadId id;

    @MapsId("idEntidad")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_entidad", nullable = false)
    private EntidadColaboradora idEntidad;

    @MapsId("idContacto")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_contacto", nullable = false)
    private Contacto idContacto;

}