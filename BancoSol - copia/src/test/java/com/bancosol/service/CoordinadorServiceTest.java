package com.bancosol.service;

import com.bancosol.dao.CampaniaRepository;
import com.bancosol.dao.ContactoRepository;
import com.bancosol.dao.CoordinadorRepository;
import com.bancosol.dao.UsuarioRepository;
import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.dto.CoordinadorFormDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.Usuario;
import com.bancosol.mapper.CoordinadorMapper;
import com.bancosol.services.CoordinadorService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CoordinadorServiceTest {

    @Mock
    private CoordinadorRepository repo;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ContactoRepository contactoRepository;

    @Mock
    private CampaniaRepository campaniaRepository;

    @Spy
    private CoordinadorMapper coordinadorMapper;

    @InjectMocks
    private CoordinadorService coordinadorService;

    @Test
    void deberiaListarTodosLosCoordinadores() {
        Coordinador coordinador = new Coordinador();
        coordinador.setId(1L);
        coordinador.setArea("Málaga");
        coordinador.setTiendas((short) 3);
        coordinador.setPermisoModificar(true);
        coordinador.setCampanias(List.of());

        when(repo.findAll()).thenReturn(List.of(coordinador));

        List<CoordinadorDTO> resultado = coordinadorService.listarTodos();

        assertEquals(1, resultado.size());
        assertEquals(1L, resultado.get(0).getId());
        assertEquals("Málaga", resultado.get(0).getArea());
        assertTrue(resultado.get(0).getPermisoModificar());

        verify(repo).findAll();
    }

    @Test
    void deberiaBuscarCoordinadorPorId() {
        Coordinador coordinador = new Coordinador();
        coordinador.setId(1L);
        coordinador.setArea("Málaga");
        coordinador.setTiendas((short) 3);
        coordinador.setPermisoModificar(true);
        coordinador.setCampanias(List.of());

        when(repo.findById(1L)).thenReturn(Optional.of(coordinador));

        CoordinadorDTO resultado = coordinadorService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Málaga", resultado.getArea());

        verify(repo).findById(1L);
    }

    @Test
    void deberiaLanzarExcepcionSiNoExisteCoordinador() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> coordinadorService.buscarPorId(99L)
        );

        assertTrue(exception.getMessage().contains("No existe el coordinador"));

        verify(repo).findById(99L);
    }

    @Test
    void deberiaCrearCoordinadorDesdeFormulario() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("juan@email.com");

        Contacto contacto = new Contacto();
        contacto.setId(2L);
        contacto.setNombre("Juan Pérez");
        contacto.setEmail("juan@email.com");
        contacto.setTelefono("600000000");

        Campania campania = new Campania();
        campania.setId(3L);
        campania.setNombre("Campaña 2026");

        CoordinadorFormDTO formDTO = new CoordinadorFormDTO();
        formDTO.setNombre("Juan Pérez");
        formDTO.setEmail("juan@email.com");
        formDTO.setTelefono("600000000");
        formDTO.setArea("Málaga");
        formDTO.setTiendas((short) 4);
        formDTO.setPermisoModificar(true);
        formDTO.setUsuarioId(1L);
        formDTO.setContactoId(2L);
        formDTO.setIdsCampanias(List.of(3L));

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        when(contactoRepository.findById(2L)).thenReturn(Optional.of(contacto));
        when(contactoRepository.save(any(Contacto.class))).thenAnswer(invocation -> invocation.getArgument(0));

        when(campaniaRepository.findAllById(List.of(3L))).thenReturn(List.of(campania));

        when(repo.save(any(Coordinador.class))).thenAnswer(invocation -> {
            Coordinador coordinador = invocation.getArgument(0);
            coordinador.setId(10L);
            return coordinador;
        });

        CoordinadorDTO resultado = coordinadorService.crear(formDTO);

        assertNotNull(resultado);
        assertEquals(10L, resultado.getId());
        assertEquals("Málaga", resultado.getArea());
        assertEquals(1L, resultado.getUsuarioId());
        assertEquals(2L, resultado.getContactoId());
        assertEquals("Juan Pérez", resultado.getNombre());
        assertEquals("juan@email.com", resultado.getEmail());
        assertEquals("600000000", resultado.getTelefono());
        assertEquals(List.of(3L), resultado.getIdsCampanias());

        verify(usuarioRepository).findById(1L);
        verify(usuarioRepository).save(any(Usuario.class));

        verify(contactoRepository).findById(2L);
        verify(contactoRepository).save(any(Contacto.class));

        verify(campaniaRepository).findAllById(List.of(3L));
        verify(repo).save(any(Coordinador.class));
    }
}