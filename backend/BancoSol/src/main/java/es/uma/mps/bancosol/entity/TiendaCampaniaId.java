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
public class TiendaCampaniaId implements java.io.Serializable {
    private static final long serialVersionUID = -6664238054796196514L;
    @Column(name = "campania_id", nullable = false)
    private Integer campaniaId;

    @Column(name = "tienda_id", nullable = false)
    private Integer tiendaId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        TiendaCampaniaId entity = (TiendaCampaniaId) o;
        return Objects.equals(this.campaniaId, entity.campaniaId) &&
                Objects.equals(this.tiendaId, entity.tiendaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(campaniaId, tiendaId);
    }

}