package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Direccion\"", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String calle;

    private Short numero;

    @Column(name = "datos_adicionales")
    private String datosAdicionales;

    @Column(name = "es_capital", nullable = false)
    private Boolean esCapital = false;

    // Relaciones (Foreign Keys)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "localidad_id")
    private Localidad localidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cp_id")
    private CodigoPostal codigoPostal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "distrito_id")
    private Distrito distrito;

    // Aunque la BBDD ya tiene un CHECK para que el distrito solo exista si es capital,
    // es buena práctica limpiar el dato en Java por si acaso.
    @PrePersist
    @PreUpdate
    private void validarCapital() {
        if (!Boolean.TRUE.equals(this.esCapital)) {
            this.distrito = null; // Si no es capital, nos aseguramos de que no haya distrito
        }
    }
}