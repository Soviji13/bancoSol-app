package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "colaborador_campania")
public class ColaboradorCampania {
    @EmbeddedId
    private ColaboradorCampaniaId id;

    @MapsId("idCampania")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_campania", nullable = false)
    private Campania idCampania;

}