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
public class TiendaTurnoId implements java.io.Serializable {
    private static final long serialVersionUID = 1550667337493080432L;
    @Column(name = "id_entidad", nullable = false)
    private Integer idEntidad;

    @Column(name = "id_responsable", nullable = false)
    private Integer idResponsable;

    @Column(name = "id_turno", nullable = false)
    private Integer idTurno;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        TiendaTurnoId entity = (TiendaTurnoId) o;
        return Objects.equals(this.idEntidad, entity.idEntidad) &&
                Objects.equals(this.idResponsable, entity.idResponsable) &&
                Objects.equals(this.idTurno, entity.idTurno);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idEntidad, idResponsable, idTurno);
    }

}