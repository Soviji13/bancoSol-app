package es.uma.mps.bancosol.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "codigo_postal")
public class CodigoPostal {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "codigo", nullable = false)
    private Integer codigo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ubicacion_id", nullable = false)
    private Ubicacion ubicacion;

}