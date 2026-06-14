//Generado por IA partiendo del modelo de bbdd aprobado por el profesor. Posteriormente revisado por el equipo
package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"Responsable_tienda\"", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResponsableTienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contacto_id")
    private Contacto contacto;

    @PrePersist @PreUpdate
    private void asegurarMayusculas() {
        if (this.nombre != null) this.nombre = this.nombre.toUpperCase();
    }


    //francisco javier garcia sierra:
    //EStba mal, no es 1:m sino 1:1
    @OneToOne(mappedBy = "responsableTienda")
    private Tienda tienda;

    @ManyToMany(mappedBy = "responsables")
    private List<Campania> campanias = new ArrayList<>();




}