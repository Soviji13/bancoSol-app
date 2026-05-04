package main.resources.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "\"Cadena\"")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cadena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @Column(name = "\"nombre\"", nullable = false, columnDefinition = "text")
    private String nombre;

    @Column(name = "\"codigo\"", nullable = false, columnDefinition = "text")
    private String codigo;
}