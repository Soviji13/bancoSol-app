// Sofía Si Villalba Jiménez (IA generativa 30% SOBRETODO PARA AGILIZAR)
// Ayuda de IA para saber cómo unificar JS con JSP sin necesidad de RestController
// IA para saber como aplanar correctamente un Map a JSON

package com.bancosol.controllers;

import com.bancosol.services.DistritoService;
import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.dto.TiendaDTO;
import com.bancosol.dto.UsuarioDTO;
import com.bancosol.dto.actualizacionEntidad.ActualizacionEntidadDTO;
import com.bancosol.dto.registroEntidad.RegistroEntidadDTO;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.CodigoPostalService;
import com.bancosol.services.CoordinadorService;
import com.bancosol.services.EntidadColaboradoraService;
import com.bancosol.services.TiendaService;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@AllArgsConstructor
@RequestMapping("/entidades")
public class EntidadesController {

    private final DistritoService distritoService;
    private final CampaniaService campaniaService;
    private final EntidadColaboradoraService entidadService;
    private final TiendaService tiendaService;
    // private final ResponsableEntidadService responsableEntidadService;
    private final CoordinadorService coordinadorService;
    private final CodigoPostalService codigoPostalService;

    // Relacionadas con mostrar datos
    // --------------------------------------------------------------

    // Mostrar todas las entidades de una campaña (parámetro)
    // Si no se pasa una específicamente por parámetro, se muestran las de la activa
    // También sirve para lateral y para abrir menú de filtros
    @GetMapping({ "", "/" })
    public String mostrarTabla(
            @RequestParam(value = "campaniaId", required = false) Long campaniaId,
            @RequestParam(value = "entidadId", required = false) Long entidadId,
            @RequestParam(value = "filtros", required = false) Boolean panelFiltro,
            Model model,
            HttpServletRequest request,
            RedirectAttributes redirectAttributes) {

        // 1. Resolver campaña activa o seleccionada (Evitamos propagar nulos)
        CampaniaDTO campaniaTabla = (campaniaId == null)
                ? this.campaniaService.devolverCampaniaActiva()
                : this.campaniaService.findByIdSofia(campaniaId);

        // 2. Obtener las entidades iniciales de la campaña
        Map<CampaniaDTO, List<EntidadColaboradoraDTO>> entidadesCampania = this.entidadService
                .filtrarEntidades(null, null, false, null, null, campaniaTabla.getId());

        // 3. LOGICA GLOBAL: Filtrar por el Rol del usuario logueado
        HttpSession session = request.getSession();
        UsuarioDTO usuarioSesion = (UsuarioDTO) session.getAttribute("usuarioLogueado");

        Map<CampaniaDTO, List<EntidadColaboradoraDTO>> mapaFinal = this.entidadService
                .filtrarPorRolYJerarquia(entidadesCampania, usuarioSesion);

        // 4. Aseguramos los atributos troncales que necesita 'tabla.jsp' para pintar la
        // vista base
        model.addAttribute("mapaEntidadesFiltradas", mapaFinal);
        model.addAttribute("campaniaSelec", campaniaTabla);
        model.addAttribute("pagina", "inicio-entidades");

        // 5. Carga aislada y condicional del panel lateral (Detalles)
        if (entidadId != null) {
            // Usamos el ID de campaña resuelto de forma segura
            EntidadColaboradoraDTO e = this.entidadService.findByCampaniaId(campaniaTabla.getId(), entidadId);
            Long idCoordinador = e.getCoordinadorId();

            List<TiendaDTO> tiendasColab = this.entidadService.devolverTodasLasTiendas(entidadId);
            List<TiendaDTO> tiendas = this.tiendaService.listarTodas();
            List<CampaniaDTO> campanias = this.campaniaService.listarTodas();

            Map<CampaniaDTO, List<TiendaDTO>> campaniasCoordinador = this.coordinadorService
                    .obtenerCampaniasConTiendas(idCoordinador);
            model.addAttribute("campaniasCoordinador", campaniasCoordinador);

            Map<Long, List<TiendaDTO>> tiendasCampaniaEntidad = this.entidadService
                    .devolverCampaniasConTiendas(entidadId);
            model.addAttribute("tiendasCampaniaEntidad", tiendasCampaniaEntidad);

            if (e.getDireccion().getEsCapital() && e.getDireccion().getDistritoId() != null) {
                model.addAttribute("distrito", this.distritoService.findById(e.getDireccion().getDistritoId()));
                model.addAttribute("distritos", this.distritoService.listarTodos());
            }

            model.addAttribute("coordinadorNombre", this.coordinadorService.buscarPorId(idCoordinador).getNombre());
            model.addAttribute("idCampaniaActual", this.campaniaService.devolverCampaniaActiva().getId());
            model.addAttribute("ultimaCampania", this.entidadService.obtenerUltimaCampania(entidadId));

            model.addAttribute("campanias", campanias);
            model.addAttribute("tiendas", tiendas);
            model.addAttribute("tiendasColab", tiendasColab);

            model.addAttribute("entidadSelec", e);
            model.addAttribute("panelIzquierdo", "entidades_colaboradoras/info-entidad.jsp");
            model.addAttribute("modoEdicion", true);
        } else {
            model.addAttribute("modoEdicion", false);
        }

        if (panelFiltro != null && panelFiltro) {
            model.addAttribute("panelIzquierdo", "entidades_colaboradoras/filtros.jsp");
        }

        return "inicio";
    }

    // Devolver las campañas (cuando se abra selector de campañas)
    // Con @ResponseBody devolvemos los datos en forma de JSON
    @GetMapping("/mostrar-campanias-json")
    @ResponseBody
    public List<CampaniaDTO> getCampanias() {
        return campaniaService.listarTodas();
    }

    // Relacionados con añadir colaborador
    // -----------------------------------------------------

    @GetMapping("/crear")
    public String AbrirRegistroColab(
            Model model,
            @RequestParam("campaniaId") Long campaniaId) {
        model.addAttribute("distritos", this.distritoService.listarTodos());
        model.addAttribute("cps", this.codigoPostalService.listarTodas());
        model.addAttribute("coordinadores", this.coordinadorService.listarTodos());
        model.addAttribute("campaniaId", campaniaId);
        model.addAttribute("pagina", "aniadir-entidad");

        return "inicio";
    }

    // AYUDA DE LA IA PARA QUE FUNCIONE MI IDEA
    public record CampaniaTiendasResponse(CampaniaDTO campania, List<TiendaDTO> tiendas) {
    }

    @GetMapping("/obtener-campanias-json-crear")
    @ResponseBody
    public List<CampaniaTiendasResponse> obtenerCampaniasConTiendasDeCoordinador(
            @RequestParam("idCoordinador") Long idCoordinador) {

        // Antes yo solo devolvía esto
        Map<CampaniaDTO, List<TiendaDTO>> mapa = this.coordinadorService.obtenerCampaniasConTiendas(idCoordinador);

        // Se transforma a mapa (lógica totalmente de IA)
        return mapa.entrySet().stream()
                .map(entry -> new CampaniaTiendasResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    // Ayuda de la IA para saber cómo manejar una petición POST
    @PostMapping("/registrar")
    @ResponseBody
    public ResponseEntity<Void> registrarEntidad(@RequestBody RegistroEntidadDTO entidadCompleta) {

        this.entidadService.crearEntidad(entidadCompleta);

        return ResponseEntity.ok().build();
    }

    // Actualizar entidad modificada
    @PostMapping("/actualizar")
    @ResponseBody
    public ResponseEntity<Void> actualizarEntidad(@RequestBody ActualizacionEntidadDTO entidadCompleta) {

        this.entidadService.sobreescribirEntidad(entidadCompleta);

        return ResponseEntity.ok().build();
    }

    // Eliminar entidad modificada
    @GetMapping("/eliminar")
    public String eliminarEntidad(
            @RequestParam("entidadId") Long entidadId,
            @RequestParam("campaniaId") Long campaniaId) {

        this.entidadService.eliminarEntidad(entidadId);
        return ("redirect:/entidades?campaniaId=" + campaniaId);
    }

    // Para filtrar
    // -----------------------------------------------------
    // Para filtrar (Sofía Si Villalba Jiménez) (IA recoge y devuelve atributos para
    // ahorrar tiempo)
    @GetMapping("/filtrar")
    public String filtrarEntidades(
            @RequestParam(value = "nombreTienda", required = false) String nombreTienda,
            @RequestParam(value = "localidadId", required = false) Long localidadId,
            @RequestParam(value = "todasCampanias", required = false) Boolean todasCampanias,
            @RequestParam(value = "esCapital", required = false) Boolean esCapital,
            @RequestParam(value = "activo", required = false) Boolean activo,
            @RequestParam(value = "campaniaId", required = true) Long campaniaId,
            Model model,
            HttpServletRequest request,
            RedirectAttributes redirectAttributes) {

        CampaniaDTO campaniaTabla = this.campaniaService.findById(campaniaId);

        Map<CampaniaDTO, List<EntidadColaboradoraDTO>> entidadesFiltradas = this.entidadService
                .filtrarEntidades(nombreTienda, localidadId, todasCampanias, esCapital, activo, campaniaId);

        HttpSession session = request.getSession();
        UsuarioDTO usuarioSesion = (UsuarioDTO) session.getAttribute("usuarioLogueado");

        Map<CampaniaDTO, List<EntidadColaboradoraDTO>> mapaFinal = this.entidadService
                .filtrarPorRolYJerarquia(entidadesFiltradas, usuarioSesion);

        model.addAttribute("mapaEntidadesFiltradas", mapaFinal);
        model.addAttribute("campaniaSelec", campaniaTabla);
        model.addAttribute("modoTodasCampanias", todasCampanias != null && todasCampanias);

        model.addAttribute("fTienda", nombreTienda);
        model.addAttribute("fLocalidadId", localidadId);
        model.addAttribute("fTodasCampanias", todasCampanias);
        model.addAttribute("fCapital", esCapital);
        model.addAttribute("fActivo", activo);

        model.addAttribute("pagina", "inicio-entidades");
        model.addAttribute("panelIzquierdo", "entidades_colaboradoras/filtros.jsp");
        model.addAttribute("modoEdicion", false);

        return "inicio";
    }

}