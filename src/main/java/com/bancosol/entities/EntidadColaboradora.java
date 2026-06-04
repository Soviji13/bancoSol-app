package com.bancosol.entities;

import jakarta.persistence.*;
        import lombok.*;

        import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"Entidad_colaboradora\"", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntidadColaboradora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(name = "estado_activo", nullable = false)
    private Boolean estadoActivo = false;

    private String observaciones;

    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coordinador_id")
    private Coordinador coordinador;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "direccion_id", nullable = false, unique = true)
    private Direccion direccion;

    @PrePersist
    @PreUpdate
    private void asegurarMayusculas() {
        if (this.nombre != null) this.nombre = this.nombre.toUpperCase();
    }

    //Refactorización de entidadColaboradora

    // Refactorización - Sofía Si Villalba Jiménez (Ayuda de IA)
    // Vincular correctamente la tabla intermedia Tienda_colaborador

    @OneToMany(mappedBy = "colaborador", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<TiendaColaborador> tiendasAsignadas = new ArrayList<>();

    @ManyToMany(mappedBy = "colaboradores")
    private List<Campania> campanias = new ArrayList<>();

    /* 
    @ManyToMany
    @JoinTable(
            name = "\"Tienda_colaborador\"",
            joinColumns = @JoinColumn(name = "colaborador_id"),
            inverseJoinColumns = @JoinColumn(name = "tienda_id")
    )
    private List<Tienda> tiendas = new ArrayList<>();

    */

    // Responsables de entidad (refactorización - Sofía Si Villalba Jiménez)
    // Ayuda de la IA
    @OneToMany(mappedBy = "colaborador", fetch = FetchType.LAZY)
    private List<ResponsableEntidad> responsables;

}