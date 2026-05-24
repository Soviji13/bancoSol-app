package com.bancosol.controllers;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.CoordinadorService;
import com.bancosol.services.ZonaGeograficaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CoordinadorControllerTest {

    private MockMvc mockMvc;

    private CoordinadorService coordinadorService;
    private CampaniaService campaniaService;
    private ZonaGeograficaService zonaGeograficaService;

    @BeforeEach
    void setUp() {
        coordinadorService = mock(CoordinadorService.class);
        campaniaService = mock(CampaniaService.class);
        zonaGeograficaService = mock(ZonaGeograficaService.class);

        CoordinadorController coordinadorController = new CoordinadorController(
                coordinadorService,
                campaniaService,
                zonaGeograficaService
        );

        mockMvc = MockMvcBuilders
                .standaloneSetup(coordinadorController)
                .build();
    }

    @Test
    void deberiaMostrarListadoDeCoordinadores() throws Exception {
        CoordinadorDTO coordinador = CoordinadorDTO.builder()
                .id(1L)
                .nombre("ANA MARTIN COORDINACION")
                .area("MALAGA CAPITAL")
                .tiendas((short) 4)
                .permisoModificar(true)
                .email("ana.coordinacion@bancosol.test")
                .telefono("600100001")
                .nombresCampanias(List.of("GRAN RECOGIDA 2026"))
                .build();

        CampaniaDTO campania = CampaniaDTO.builder()
                .id(1L)
                .nombre("GRAN RECOGIDA 2026")
                .build();

        when(coordinadorService.listarTodos()).thenReturn(List.of(coordinador));
        when(campaniaService.listarTodas()).thenReturn(List.of(campania));

        mockMvc.perform(get("/coordinadores"))
                .andExpect(status().isOk())
                .andExpect(view().name("coordinadores/listado"))
                .andExpect(model().attributeExists("coordinadores"))
                .andExpect(model().attributeExists("campanias"))
                .andExpect(model().attribute("coordinadores", hasSize(1)))
                .andExpect(model().attribute("campanias", hasSize(1)));

        verify(coordinadorService).listarTodos();
        verify(campaniaService).listarTodas();
    }

    @Test
    void deberiaMostrarFormularioNuevoCoordinador() throws Exception {
        when(campaniaService.listarTodas()).thenReturn(List.of());
        when(zonaGeograficaService.listarTodas()).thenReturn(List.of());

        mockMvc.perform(get("/coordinadores/nuevo"))
                .andExpect(status().isOk())
                .andExpect(view().name("coordinadores/formulario"))
                .andExpect(model().attributeExists("coordinador"))
                .andExpect(model().attributeExists("campanias"))
                .andExpect(model().attributeExists("zonas"))
                .andExpect(model().attribute("modoEdicion", false));

        verify(campaniaService).listarTodas();
        verify(zonaGeograficaService).listarTodas();
    }

    @Test
    void deberiaMostrarFormularioEditarCoordinador() throws Exception {
        CoordinadorDTO coordinador = CoordinadorDTO.builder()
                .id(1L)
                .nombre("ANA MARTIN COORDINACION")
                .email("ana.coordinacion@bancosol.test")
                .telefono("600100001")
                .area("MALAGA CAPITAL")
                .tiendas((short) 4)
                .permisoModificar(true)
                .usuarioId(10L)
                .contactoId(20L)
                .idsCampanias(List.of(1L, 2L))
                .build();

        when(coordinadorService.buscarPorId(1L)).thenReturn(coordinador);
        when(campaniaService.listarTodas()).thenReturn(List.of());
        when(zonaGeograficaService.listarTodas()).thenReturn(List.of());

        mockMvc.perform(get("/coordinadores/editar/1"))
                .andExpect(status().isOk())
                .andExpect(view().name("coordinadores/formulario"))
                .andExpect(model().attributeExists("id"))
                .andExpect(model().attributeExists("coordinador"))
                .andExpect(model().attributeExists("campanias"))
                .andExpect(model().attributeExists("zonas"))
                .andExpect(model().attribute("modoEdicion", true));

        verify(coordinadorService).buscarPorId(1L);
        verify(campaniaService).listarTodas();
        verify(zonaGeograficaService).listarTodas();
    }

    @Test
    void deberiaGuardarCoordinadorYRedirigirAlListado() throws Exception {
        mockMvc.perform(post("/coordinadores/guardar")
                        .param("nombre", "ANA MARTIN COORDINACION")
                        .param("email", "ana.coordinacion@bancosol.test")
                        .param("telefono", "600100001")
                        .param("area", "MALAGA CAPITAL")
                        .param("permisoModificar", "true")
                        .param("idsCampanias", "1"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/coordinadores"));

        verify(coordinadorService).crear(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void deberiaActualizarCoordinadorYRedirigirAlListado() throws Exception {
        mockMvc.perform(post("/coordinadores/actualizar/1")
                        .param("nombre", "ANA MARTIN COORDINACION")
                        .param("email", "ana.coordinacion@bancosol.test")
                        .param("telefono", "600100001")
                        .param("area", "MALAGA CAPITAL")
                        .param("permisoModificar", "true")
                        .param("idsCampanias", "1"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/coordinadores"));

        verify(coordinadorService).actualizar(
                org.mockito.ArgumentMatchers.eq(1L),
                org.mockito.ArgumentMatchers.any()
        );
    }

    @Test
    void deberiaEliminarCoordinadorYRedirigirAlListado() throws Exception {
        mockMvc.perform(post("/coordinadores/eliminar/1"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/coordinadores"));

        verify(coordinadorService).eliminar(1L);
    }
}