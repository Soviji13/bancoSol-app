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
public class ColaboradorCampaniaId implements java.io.Serializable {
    private static final long serialVersionUID = 2831247851761315315L;
    @Column(name = "id_campania", nullable = false)
    private Integer idCampania;

    @Column(name = "id_colaborador", nullable = false)
    private Integer idColaborador;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ColaboradorCampaniaId entity = (ColaboradorCampaniaId) o;
        return Objects.equals(this.idColaborador, entity.idColaborador) &&
                Objects.equals(this.idCampania, entity.idCampania);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idColaborador, idCampania);
    }

}