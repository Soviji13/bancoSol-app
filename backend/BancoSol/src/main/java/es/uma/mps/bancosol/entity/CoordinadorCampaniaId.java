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
public class CoordinadorCampaniaId implements java.io.Serializable {
    private static final long serialVersionUID = 3313756721525361078L;
    @Column(name = "coordinador_id", nullable = false)
    private Integer coordinadorId;

    @Column(name = "campania_id", nullable = false)
    private Integer campaniaId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        CoordinadorCampaniaId entity = (CoordinadorCampaniaId) o;
        return Objects.equals(this.coordinadorId, entity.coordinadorId) &&
                Objects.equals(this.campaniaId, entity.campaniaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(coordinadorId, campaniaId);
    }

}