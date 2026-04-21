package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class ResponsableEntidadId implements java.io.Serializable {
    private static final long serialVersionUID = 1270764207662951281L;
    @Column(name = "id_entidad", nullable = false)
    private Integer idEntidad;

    @Column(name = "id_contacto", nullable = false)
    private Integer idContacto;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ResponsableEntidadId entity = (ResponsableEntidadId) o;
        return Objects.equals(this.idEntidad, entity.idEntidad) &&
                Objects.equals(this.idContacto, entity.idContacto);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idEntidad, idContacto);
    }

}