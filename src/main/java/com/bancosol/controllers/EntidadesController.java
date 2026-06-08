// Sofía Si Villalba Jiménez (IA generativa 0%)
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

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.dto.TiendaDTO;
import com.bancosol.dto.registroEntidad.RegistroEntidadDTO;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.CodigoPostalService;
import com.bancosol.services.CoordinadorService;
import com.bancosol.services.EntidadColaboradoraService;
import com.bancosol.services.LocalidadService;
import com.bancosol.services.TiendaService;
import com.bancosol.services.ZonaGeograficaService;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@Controller
@AllArgsConstructor
@RequestMapping("/entidades")
public class EntidadesController {

    private final DistritoService distritoService;
    private final CampaniaService campaniaService;
    private final EntidadColaboradoraService entidadService;
    private final TiendaService tiendaService;
    //private final ResponsableEntidadService responsableEntidadService;
    private final CoordinadorService coordinadorService;
    private final LocalidadService localidadService;
    private final CodigoPostalService codigoPostalService;
    private final ZonaGeograficaService zonaGeograficaService;

    // Relacionadas con mostrar datos --------------------------------------------------------------

    // Mostrar todas las entidades de una campaña (parámetro)
    // Si no se pasa una específicamente por parámetro, se muestran las de la activa
    @GetMapping({"", "/"})
    public String mostrarTabla( 
        @RequestParam( value = "campaniaId", required = false ) Long campaniaId,
        @RequestParam( value = "entidadId", required = false ) Long entidadId,
        Model model
    ) 
    {
        // -- Devolver tabla --
        // Si es null, devuelve la campaña activa
        CampaniaDTO campaniaTabla = (campaniaId == null) 
            ? this.campaniaService.devolverCampaniaActiva() 
            : this.campaniaService.findById(campaniaId);

        // Obtenemos las entidades colaboradoras a mostrar
        List<EntidadColaboradoraDTO> entidadesCampania = 
            this.entidadService.findAllByCampaniaId(campaniaTabla.getId());

        model.addAttribute("entidadesSelec", entidadesCampania);
        model.addAttribute("campaniaSelec", campaniaTabla);
        model.addAttribute("pagina", "inicio-entidades");

        // -- Devolver entidad en el lateral (solo info) --
        // Si se seleccionó una entidad
        if (entidadId != null) {
            
            // Pasamos la entidad colaboradora además
            EntidadColaboradoraDTO e = (entidadId == null)
                ? null
                : this.entidadService.findByCampaniaId(campaniaId, entidadId);

            // Pasamos todas sus tiendas
            List <TiendaDTO> tiendasColab = this.entidadService.devolverTodasLasTiendas(entidadId);
            // Pasamos todas las tiendas
            List <TiendaDTO> tiendas = this.tiendaService.listarTodas();

            // Pasamos todas las campañas
            List <CampaniaDTO> campanias = this.campaniaService.listarTodas();
            // Obtenemos las tiendas pertenecientes a cada campaña de la entidad
            Map <Long, List <TiendaDTO>> tiendasCampania = this.entidadService.devolverCampaniasConTodasTiendas(entidadId);
            // Obtenemos las tiendas y campañas únicamente pertenecientes a la entidad
            Map <Long, List <TiendaDTO>> tiendasCampaniaEntidad = this.entidadService.devolverCampaniasConTiendas(entidadId);

            // Pasamos el distrito si es capital (se pasa así porque pueden haber direcciones corruptas, que aunque sean capital, no tienen distrito)
            if (e.getDireccion().getEsCapital() && e.getDireccion().getDistritoId() != null) {
                model.addAttribute("distrito", this.distritoService.findById(e.getDireccion().getDistritoId()));
            }

            // Pasamos la campaña actual (id) y la última campaña
            model.addAttribute("idCampaniaActual", this.campaniaService.devolverCampaniaActiva().getId());
            model.addAttribute("ultimaCampania", this.entidadService.obtenerUltimaCampania(entidadId));

            // Pasamos todas las campañas
            model.addAttribute("campanias", campanias);
            model.addAttribute("tiendasCampania", tiendasCampania);
            model.addAttribute("tiendasCampaniaEntidad", tiendasCampaniaEntidad);

            // Pasamos todas las tiendas
            model.addAttribute("tiendas", tiendas);
            model.addAttribute("tiendasColab", tiendasColab);

            // Pasamos datos de la entidad y dónde se tiene que ubicar
            model.addAttribute("entidadSelec", e);
            model.addAttribute("panelIzquierdo", "entidades_colaboradoras/info-entidad.jsp");

            // También permitimos el modo edición
            model.addAttribute("modoEdicion", true);
        } else {
            model.addAttribute("modoEdicion", false);
        }

        return "inicio";
    }

    // Devolver las campañas (cuando se abra selector de campañas)
    // Con @ResponseBody devolvemos los datos en forma de JSON
    @GetMapping("/mostrar-campanias-json")
    @ResponseBody
    public List <CampaniaDTO> getCampanias () {
        return campaniaService.listarTodas();
    }

    // Relacionados con añadir colaborador -----------------------------------------------------

    @GetMapping("/crear")
    public String AbrirRegistroColab (
        Model model,
        @RequestParam("campaniaId") Long campaniaId
    ) {
        model.addAttribute("distritos", this.distritoService.listarTodos());
        model.addAttribute("cps", this.codigoPostalService.listarTodas());
        model.addAttribute("coordinadores", this.coordinadorService.listarTodos());
        model.addAttribute("campaniaId", campaniaId);
        model.addAttribute("pagina", "aniadir-entidad");

        return "inicio";
    }

    // AYUDA DE LA IA PARA QUE FUNCIONE MI IDEA 
    public record CampaniaTiendasResponse(CampaniaDTO campania, List<TiendaDTO> tiendas) {}

    @GetMapping("/obtener-campanias-json-crear")
    @ResponseBody
    public List<CampaniaTiendasResponse> obtenerCampaniasConTiendasDeCoordinador (
        @RequestParam ("idCoordinador") Long idCoordinador
    ) {

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
    public ResponseEntity<Void> registrarEntidad (@RequestBody RegistroEntidadDTO entidadCompleta) {
        
        this.entidadService.crearEntidad(entidadCompleta);
        
        return ResponseEntity.ok().build();
    }
    

}