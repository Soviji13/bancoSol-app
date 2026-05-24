package com.bancosol.mapper;

import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.Usuario;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CoordinadorMapperTest {

    private final CoordinadorMapper mapper = new CoordinadorMapper();

    @Test
    void deberiaConvertirCoordinadorADTO() {
        Contacto contacto = new Contacto();
        contacto.setId(10L);
        contacto.setNombre("Juan Pérez");
        contacto.setEmail("juan@email.com");
        contacto.setTelefono("600000000");

        Usuario usuario = new Usuario();
        usuario.setId(20L);
        usuario.setEmail("usuario@email.com");

        Campania campania = new Campania();
        campania.setId(30L);
        campania.setNombre("Campaña 2026");
        campania.setActiva(true);
        campania.setAnio((short) 2026);

        Coordinador coordinador = new Coordinador();
        coordinador.setId(1L);
        coordinador.setArea("Málaga");
        coordinador.setTiendas((short) 5);
        coordinador.setPermisoModificar(true);
        coordinador.setContacto(contacto);
        coordinador.setUsuario(usuario);
        coordinador.setCampanias(List.of(campania));

        CoordinadorDTO dto = mapper.toDTO(coordinador);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Málaga", dto.getArea());
        assertEquals("Juan Pérez", dto.getNombre());
        assertEquals(10L, dto.getContactoId());
        assertEquals(20L, dto.getUsuarioId());
        assertEquals("juan@email.com", dto.getEmail());
        assertEquals("600000000", dto.getTelefono());
        assertTrue(dto.getPermisoModificar());

        assertEquals(List.of(30L), dto.getIdsCampanias());
        assertEquals(List.of("Campaña 2026"), dto.getNombresCampanias());

        assertNotNull(dto.getContacto());
        assertEquals("Juan Pérez", dto.getContacto().getNombre());

        assertEquals(1, dto.getCampanias().size());
        assertEquals("Campaña 2026", dto.getCampanias().get(0).getNombre());
    }

    @Test
    void deberiaConvertirDTOAEntidadSimple() {
        CoordinadorDTO dto = new CoordinadorDTO();
        dto.setId(1L);
        dto.setArea("Málaga");
        dto.setTiendas((short) 5);
        dto.setPermisoModificar(true);

        Coordinador coordinador = mapper.toEntity(dto);

        assertNotNull(coordinador);
        assertEquals(1L, coordinador.getId());
        assertEquals("Málaga", coordinador.getArea());
        assertEquals((short) 5, coordinador.getTiendas());
        assertTrue(coordinador.getPermisoModificar());
    }

    @Test
    void deberiaDevolverNullSiCoordinadorEsNull() {
        assertNull(mapper.toDTO(null));
    }

    @Test
    void deberiaDevolverNullSiDTOEsNull() {
        assertNull(mapper.toEntity(null));
    }
}