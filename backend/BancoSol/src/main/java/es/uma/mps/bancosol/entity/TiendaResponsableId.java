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
public class TiendaResponsableId implements java.io.Serializable {
    private static final long serialVersionUID = -3765643847727864146L;
    @Column(name = "tienda_id", nullable = false)
    private Integer tiendaId;

    @Column(name = "responsable_id", nullable = false)
    private Integer responsableId;

    @Column(name = "campania_id", nullable = false)
    private Integer campaniaId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        TiendaResponsableId entity = (TiendaResponsableId) o;
        return Objects.equals(this.campaniaId, entity.campaniaId) &&
                Objects.equals(this.tiendaId, entity.tiendaId) &&
                Objects.equals(this.responsableId, entity.responsableId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(campaniaId, tiendaId, responsableId);
    }

}