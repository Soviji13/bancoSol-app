// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa 0%)

package com.bancosol.mapper;

import org.springframework.stereotype.Component;

import com.bancosol.dto.UsuarioDTO;
import com.bancosol.entities.Usuario;

@Component
public class UsuarioMapper extends MapperDTO <UsuarioDTO, Usuario> {

    public UsuarioDTO toDTO (Usuario u) {

        UsuarioDTO dto = new UsuarioDTO();

        dto.setId(u.getId());
        dto.setEmail(u.getEmail());
        dto.setRol(u.getRol());

        return dto;
    }
}