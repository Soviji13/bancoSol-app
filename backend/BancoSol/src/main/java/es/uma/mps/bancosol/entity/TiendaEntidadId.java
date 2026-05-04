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
public class TiendaEntidadId implements java.io.Serializable {
    private static final long serialVersionUID = -173138604436058241L;
    @Column(name = "tienda_id", nullable = false)
    private Integer tiendaId;

    @Column(name = "entidad_id", nullable = false)
    private Integer entidadId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        TiendaEntidadId entity = (TiendaEntidadId) o;
        return Objects.equals(this.tiendaId, entity.tiendaId) &&
                Objects.equals(this.entidadId, entity.entidadId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tiendaId, entidadId);
    }

}