package com.bancosol.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactoDTO {

    private Long id;

    private String nombre;

    private String email;

    private String telefono;

    private List<Long> idsEntidades;
}