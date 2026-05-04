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
public class CampaniaCadenaId implements java.io.Serializable {
    private static final long serialVersionUID = -8021026685531548053L;
    @Column(name = "campania_id", nullable = false)
    private Integer campaniaId;

    @Column(name = "cadena_id", nullable = false)
    private Integer cadenaId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        CampaniaCadenaId entity = (CampaniaCadenaId) o;
        return Objects.equals(this.campaniaId, entity.campaniaId) &&
                Objects.equals(this.cadenaId, entity.cadenaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(campaniaId, cadenaId);
    }

}