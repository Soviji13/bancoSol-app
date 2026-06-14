//francisco javier garcia sierra
//USO DE IA: consultas señaladas

package com.bancosol.controllers;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.services.*;
import com.bancosol.dto.TiendaDTO;
import com.bancosol.dto.UsuarioDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/tiendas")
public class TiendaController {

    private final TiendaService tiendaService;
    private final CampaniaService campaniaService;

    private final CadenaService cadenaService;
    private final LocalidadService localidadService;
    private final CodigoPostalService codigoPostalService;
    private final ResponsableTiendaService responsableTiendaService;
    private final DistritoService distritoService;

    private final ZonaGeograficaService zonaGeograficaService;
    private final EntidadColaboradoraService entidadColaboradoraService;

    @GetMapping({ "", "/" })
    public String listarTiendas(@RequestParam(value = "campaniaId", required = false) Long campaniaId,
            @RequestParam(value = "tiendaId", required = false) Long tiendaId,
            @RequestParam(value = "verFiltros", required = false) Boolean verFiltros,
            @RequestParam(value = "nombreFiltro", required = false) String nombreFiltro,
            @RequestParam(value = "cadenaIdFiltro", required = false) Long cadenaIdFiltro,
            @RequestParam(value = "localidadIdFiltro", required = false) Long localidadIdFiltro,
            @RequestParam(value = "distritoIdFiltro", required = false) Long distritoIdFiltro,
            @RequestParam(value = "zonaGeoIdFiltro", required = false) Long zonaGeoIdFiltro,
            @RequestParam(value = "colaboradorIdFiltro", required = false) Long colaboradorIdFiltro,
            @RequestParam(value = "esFranquiciaFiltro", required = false) String esFranquiciaFiltro,
            HttpServletRequest request,
            RedirectAttributes redirectAttributes,
            Model model) {

        // idea de sofia para mostrar la campaña activa como defautl
        CampaniaDTO campaniaTabla = (campaniaId == null)
                ? this.campaniaService.devolverCampaniaActiva()
                : this.campaniaService.findById(campaniaId);

        // evaluamos si hay filtros activos para mandar a servicio filtrado o normal
        List<TiendaDTO> tiendas;
        if (nombreFiltro != null || cadenaIdFiltro != null || localidadIdFiltro != null ||
                distritoIdFiltro != null || zonaGeoIdFiltro != null || colaboradorIdFiltro != null
                || esFranquiciaFiltro != null) {

            tiendas = tiendaService.listarTiendasFiltradas(
                    campaniaTabla.getId(), nombreFiltro, cadenaIdFiltro, localidadIdFiltro,
                    distritoIdFiltro, zonaGeoIdFiltro, colaboradorIdFiltro, esFranquiciaFiltro);
        } else {
            tiendas = tiendaService.listarTiendasPorCampania(campaniaTabla.getId());
        }

        // SOFÍA ROLES (IA PARA AGILIZAR)

        HttpSession session = request.getSession();

        List<TiendaDTO> tiendasCompletas = tiendaService.listarTiendasPorCampania(campaniaTabla.getId());
        UsuarioDTO usuarioSesion = (UsuarioDTO) session.getAttribute("usuarioLogueado");

        List<TiendaDTO> tiendasFinales = this.tiendaService
                .filtrarTiendasPorRolYJerarquia(tiendasCompletas, usuarioSesion, campaniaTabla.getId());

        model.addAttribute("tiendasSelec", tiendasFinales);

        // FIN SOFíA

        // SUGERENCIA DE LA IA PARA EXPORTAR, no sabia bien como plantearlo sin q fuera
        // una locura, igualmente me ha venido bien saberlo, lo aplicaré a voluntarios
        // pasamos lista a json y la metemos en jsp para q boton exportar no tenga q
        // hacer fetch extra al backend!!!!
        try {
            ObjectMapper mapper = new ObjectMapper();
            String tiendasJson = mapper.writeValueAsString(tiendas);
            model.addAttribute("tiendasJson", tiendasJson);
        } catch (Exception e) {
            model.addAttribute("tiendasJson", "[]");
        }

        model.addAttribute("campaniaSelec", campaniaTabla);
        model.addAttribute("campaniaId", campaniaTabla.getId());
        model.addAttribute("pagina", "inicio-tiendas");

        // si seleccionamos tienda abrimos menu lateral
        if (tiendaId != null) {
            TiendaDTO tiendaSelec = tiendaService.findById(tiendaId);
            model.addAttribute("tiendaSelec", tiendaSelec);
            model.addAttribute("panelIzquierdo", "tiendas/tiendaDetalles.jsp");
        }

        // al darle a filtros metemos las listas para selects del menu lateral de los
        // filtros
        if (verFiltros != null && verFiltros) {
            model.addAttribute("cadenas", cadenaService.listarTodas());
            model.addAttribute("localidades", localidadService.listarTodas());
            model.addAttribute("distritos", distritoService.listarTodos());
            model.addAttribute("zonas", zonaGeograficaService.listarTodas());
            model.addAttribute("colaboradores", entidadColaboradoraService.listarTodas());

            // conservamos parametros en url para q selects se queden marcados al
            // recargar!!!!!
            // asi no tenemos q hacer un /tienda/filtrada o por el estilo y podemos
            // reutilizar la pintada og de la tabla
            model.addAttribute("nombreFiltro", nombreFiltro);
            model.addAttribute("cadenaIdFiltro", cadenaIdFiltro);
            model.addAttribute("localidadIdFiltro", localidadIdFiltro);
            model.addAttribute("distritoIdFiltro", distritoIdFiltro);
            model.addAttribute("zonaGeoIdFiltro", zonaGeoIdFiltro);
            model.addAttribute("colaboradorIdFiltro", colaboradorIdFiltro);
            model.addAttribute("esFranquiciaFiltro", esFranquiciaFiltro);

            model.addAttribute("panelIzquierdo", "tiendas/tiendaFiltros.jsp");
        }

        return "inicio";
    }

    @GetMapping("/aniadir")
    public String aniadirTienda(@RequestParam("campaniaId") Long campaniaId,
            Model model) {
        CampaniaDTO campaniaTabla = this.campaniaService.findById(campaniaId);

        model.addAttribute("campanias", campaniaService.listarTodas());
        model.addAttribute("cadenas", cadenaService.listarTodas());
        model.addAttribute("localidades", localidadService.listarTodas());
        model.addAttribute("cps", codigoPostalService.listarTodas());
        model.addAttribute("responsables", responsableTiendaService.listarTodos());
        model.addAttribute("campaniaSelec", campaniaTabla);
        model.addAttribute("campaniaId", campaniaId);

        model.addAttribute("pagina", "aniadir-tienda");
        return "inicio";
    }

    @PostMapping("/guardar")
    public String guardarTienda(
            @RequestParam(value = "campaniaId", required = false) Long campaniaId, // desde la q le damos a añadir
            @RequestParam("participadoAnterior") String participadoAnterior,
            @RequestParam(value = "tiendaExistenteId", required = false) Long tiendaExistenteId,
            @RequestParam(value = "campaniaIdTarget", required = false) Long campaniaIdTarget, // donde la vamos a
                                                                                               // guardar
            @RequestParam(value = "nombre", required = false) String nombre,
            @RequestParam(value = "cadenaId", required = false) Long cadenaId,
            @RequestParam(value = "esFranquicia", required = false) Boolean esFranquicia,
            @RequestParam(value = "localidadId", required = false) Long localidadId,
            @RequestParam(value = "cpId", required = false) Long cpId,
            @RequestParam(value = "calle", required = false) String calle,
            @RequestParam(value = "numero", required = false) Short numero,
            @RequestParam(value = "puntosRecogida", required = false) Short puntosRecogida,
            @RequestParam(value = "responsableId", required = false) Long responsableId) {
        Long destinoId = (campaniaIdTarget != null) ? campaniaIdTarget : campaniaId;

        // si ha participado SOLO vinculamos tienda a campaña destino
        if ("si".equals(participadoAnterior)) {
            if (tiendaExistenteId != null) {
                tiendaService.vincularTiendaACampania(tiendaExistenteId, destinoId);
            }
        } else {
            TiendaDTO nuevoDto = new TiendaDTO();
            nuevoDto.setNombre(nombre);
            nuevoDto.setCadenaId(cadenaId);
            nuevoDto.setEsFranquicia(esFranquicia);
            nuevoDto.setCalle(calle);
            nuevoDto.setNumero(numero);
            nuevoDto.setPuntosRecogida(puntosRecogida);

            tiendaService.aniadirNuevaTienda(nuevoDto, destinoId, localidadId, cpId, responsableId);
        }

        return "redirect:/tiendas?campaniaId=" + destinoId;
    }

    // AYUDA IA PARA LOS MODALES: {
    // devuelve json directo para modal de vincular tienda en aniadir
    @GetMapping("/api/por-campania")
    @ResponseBody
    public List<TiendaDTO> obtenerTiendasPorCampaniaJSON(@RequestParam("campaniaId") Long campaniaId) {
        return tiendaService.listarTiendasPorCampania(campaniaId);
    }

    @ResponseBody
    @GetMapping("/mostrar-campanias-json")
    public List<CampaniaDTO> getCampanias() {
        return campaniaService.listarTodas();
    }
    // }

    @GetMapping("/modificar")
    public String modificarTienda(@RequestParam("campaniaId") Long campaniaId,
            @RequestParam("tiendaId") Long tiendaId,
            Model model) {

        TiendaDTO tiendaSelec = tiendaService.findById(tiendaId);
        CampaniaDTO campaniaTabla = campaniaService.findById(campaniaId);

        model.addAttribute("cadenas", cadenaService.listarTodas());
        model.addAttribute("localidades", localidadService.listarTodas());
        model.addAttribute("distritos", distritoService.listarTodos());
        model.addAttribute("cps", codigoPostalService.listarTodas());

        // recuperamos responsables y nos aseguramos de meter el de la tienda por si ya
        // tuviera uno asignado!!!!
        // la logica detras de esto sria q al ser una relacion 1:1, los responsables q
        // ya esten asignados no deben porder
        // asignarse a otra, por lo q si vamos a modificar solo traemos los libres y el
        // nuestro, ya q si lo cambiamos el nuestro
        // pasaria a ser libre.
        var responsablesLibres = responsableTiendaService.listarLibres();
        if (tiendaSelec.getResponsableTiendaId() != null) {
            var responsableActual = responsableTiendaService.buscarPorId(tiendaSelec.getResponsableTiendaId());
            if (responsableActual != null) {
                boolean yaEsta = responsablesLibres.stream().anyMatch(r -> r.getId().equals(responsableActual.getId()));
                if (!yaEsta) {
                    responsablesLibres.add(responsableActual);
                }
            }
        }
        model.addAttribute("responsables", responsablesLibres);

        // pasamos array de tiendas otra vez o nos quedamos con tabla en blanco al
        // modificar (me pasó) (IDEA DE SOLUCION DE LA IA, IMPLEMENTACION MIA)
        List<TiendaDTO> tiendas = tiendaService.listarTiendasPorCampania(campaniaId);
        model.addAttribute("tiendasSelec", tiendas);

        model.addAttribute("tiendaSelec", tiendaSelec);
        model.addAttribute("campaniaSelec", campaniaTabla);
        model.addAttribute("campaniaId", campaniaId);

        model.addAttribute("pagina", "inicio-tiendas");
        model.addAttribute("panelIzquierdo", "tiendas/tiendaModificar.jsp");

        return "inicio";
    }

    @PostMapping("/actualizar")
    public String actualizarTienda(
            @RequestParam("tiendaId") Long tiendaId,
            @RequestParam("campaniaId") Long campaniaId,
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "puntosRecogida", required = false) Short puntosRecogida,
            @RequestParam(value = "cpId", required = false) Long cpId,
            @RequestParam(value = "localidadId", required = false) Long localidadId,
            @RequestParam(value = "distritoId", required = false) Long distritoId,
            @RequestParam(value = "calle", required = false) String calle,
            @RequestParam(value = "numero", required = false) Short numero,
            @RequestParam(value = "esFranquicia", required = false) Boolean esFranquicia,
            @RequestParam(value = "responsableId", required = false) Long responsableId,
            @RequestParam(value = "cadenaId", required = false) Long cadenaId) {
        // si checkbox no se marca llega nulo, asi q forzamos q sea false!!!!
        boolean franquicia = (esFranquicia != null && esFranquicia);

        TiendaDTO dto = new TiendaDTO();
        dto.setId(tiendaId);
        dto.setNombre(nombre);
        dto.setPuntosRecogida(puntosRecogida != null ? puntosRecogida : (short) 0);
        dto.setEsFranquicia(franquicia);
        dto.setCalle(calle);
        dto.setNumero(numero);
        dto.setCadenaId(cadenaId);

        tiendaService.actualizarTiendaExistente(dto, localidadId, distritoId, cpId, responsableId);

        // redirect para evitar recarga y por tanto guardar mas veces la misma tienda,
        // evitamos errores
        return "redirect:/tiendas?campaniaId=" + campaniaId + "&tiendaId=" + tiendaId;
    }

    @PostMapping("/eliminar")
    public String eliminarTienda(@RequestParam("tiendaId") Long tiendaId,
            @RequestParam("campaniaId") Long campaniaId) {

        tiendaService.eliminarTienda(tiendaId);
        // redirect importantisimo para evitar q al recargar intente eliminar una tienda
        // eliminada ya
        return "redirect:/tiendas?campaniaId=" + campaniaId;
    }
}