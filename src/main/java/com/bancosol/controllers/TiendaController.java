//francisco javier garcia sierra 0% ia

package com.bancosol.controllers;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.services.*;
import com.bancosol.dto.TiendaDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

    @Controller
    @AllArgsConstructor
    @RequestMapping("/tiendas")
    public class TiendaController {

        //tabla
        private final TiendaService tiendaService;
        private final CampaniaService campaniaService;

        //añadir
        private final CadenaService cadenaService;
        private final LocalidadService localidadService;
        private final CodigoPostalService codigoPostalService;
        private final ResponsableTiendaService responsableTiendaService;
        private final DistritoService distritoService;

        @GetMapping({"", "/"})
        public String listarTiendas(@RequestParam(value = "campaniaId", required = false) Long campaniaId,
                                    @RequestParam(value = "tiendaId", required = false) Long tiendaId,
                                     Model model) {

            //idea de sofia para mostrar la campaña activa como defautl {
            CampaniaDTO campaniaTabla = (campaniaId == null)
                    ? this.campaniaService.devolverCampaniaActiva()
                    : this.campaniaService.findById(campaniaId);
            // }

            List<TiendaDTO> tiendas = tiendaService.listarTiendasPorCampania(campaniaTabla.getId());

            model.addAttribute("tiendasSelec", tiendas);
            model.addAttribute("campaniaSelec", campaniaTabla);
            model.addAttribute("campaniaId", campaniaTabla.getId());

            //!!!le decimos al modelo q en pagina estamos
            model.addAttribute("pagina", "inicio-tiendas");

            //si seleccionamos una tienda
            if (tiendaId != null) {
                TiendaDTO tiendaSelec = tiendaService.findById(tiendaId);
                model.addAttribute("tiendaSelec", tiendaSelec);
                model.addAttribute("panelIzquierdo", "tiendas/tiendaDetalles.jsp");
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
                @RequestParam(value = "campaniaId", required = false) Long campaniaId,
                @RequestParam("participadoAnterior") String participadoAnterior,
                @RequestParam(value = "tiendaExistenteId", required = false) Long tiendaExistenteId,
                @RequestParam(value = "campaniaIdTarget", required = false) Long campaniaIdTarget,
                @RequestParam(value = "nombre", required = false) String nombre,
                @RequestParam(value = "cadenaId", required = false) Long cadenaId,
                @RequestParam(value = "esFranquicia", required = false) Boolean esFranquicia,
                @RequestParam(value = "localidadId", required = false) Long localidadId,
                @RequestParam(value = "cpId", required = false) Long cpId,
                @RequestParam(value = "calle", required = false) String calle,
                @RequestParam(value = "numero", required = false) Short numero,
                @RequestParam(value = "puntosRecogida", required = false) Short puntosRecogida,
                @RequestParam(value = "responsableId", required = false) Long responsableId
        ) {
            Long destinoId = (campaniaIdTarget != null) ? campaniaIdTarget : campaniaId;

            if ("si".equals(participadoAnterior)) {
                // Lógica: Si ha participado, solo vinculamos la tienda que ha seleccionado a la campaña elegida
                if (tiendaExistenteId != null) {
                    tiendaService.vincularTiendaACampania(tiendaExistenteId, destinoId);
                }
            } else {
                // Lógica original: Crear tienda nueva
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

        //ayuda ia
        // Este métoddo devuelve los datos en JSON sin recargar el JSP
        @GetMapping("/api/por-campania")
        @ResponseBody
        public List<TiendaDTO> obtenerTiendasPorCampaniaJSON(@RequestParam("campaniaId") Long campaniaId) {
            return tiendaService.listarTiendasPorCampania(campaniaId);
        }


        @ResponseBody //pasa los datos a json
        @GetMapping("/mostrar-campanias-json")
        public List<CampaniaDTO> getCampanias() {
            return campaniaService.listarTodas();
        }


        @GetMapping("/modificar")
        public String modificarTienda(@RequestParam("campaniaId") Long campaniaId,
                                      @RequestParam("tiendaId") Long tiendaId,
                                      Model model) {

            //buscamos la tienda a editar y la campaña
            TiendaDTO tiendaSelec = tiendaService.findById(tiendaId);
            CampaniaDTO campaniaTabla = campaniaService.findById(campaniaId);

            //cargamos listas para desplegables del form
            model.addAttribute("cadenas", cadenaService.listarTodas());
            model.addAttribute("localidades", localidadService.listarTodas());
            model.addAttribute("distritos", distritoService.listarTodos());
            model.addAttribute("cps", codigoPostalService.listarTodas());

            // LÓGICA DE RESPONSABLES: Libres + El actual AYUDA IA
            var responsablesLibres = responsableTiendaService.listarLibres();
            if (tiendaSelec.getResponsableTiendaId() != null) {
                var responsableActual = responsableTiendaService.buscarPorId(tiendaSelec.getResponsableTiendaId());
                if (responsableActual != null) {
                    // Verificamos por ID para no añadirlo doble si por algún motivo ya venía en "libres"
                    boolean yaEsta = responsablesLibres.stream().anyMatch(r -> r.getId().equals(responsableActual.getId()));
                    if (!yaEsta) {
                        responsablesLibres.add(responsableActual);
                    }
                }
            }
            model.addAttribute("responsables", responsablesLibres);

            //2 lineas siguentes ayuda ia, ya que por alguna razon desaparecia la tabla al modficar, y era claro pq no se la estaba pasando, ya que solo se la paso en /, y no en /modificar
            List<TiendaDTO> tiendas = tiendaService.listarTiendasPorCampania(campaniaId);
            model.addAttribute("tiendasSelec", tiendas);

            //param al JSP
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
                @RequestParam(value = "cadenaId", required = false) Long cadenaId
        ) {
            // El checkbox si se desmarca no viaja en el HTML (llega null), lo tratamos como false
            boolean franquicia = (esFranquicia != null && esFranquicia);

            // Creamos un DTO limpio para trasladar los parámetros modificados
            TiendaDTO dto = new TiendaDTO();
            dto.setId(tiendaId);
            dto.setNombre(nombre);
            dto.setPuntosRecogida(puntosRecogida != null ? puntosRecogida : (short) 0);
            dto.setEsFranquicia(franquicia);
            dto.setCalle(calle);
            dto.setNumero(numero);
            dto.setCadenaId(cadenaId);

            // Llamamos al servicio para guardar todo en la base de datos
            tiendaService.actualizarTiendaExistente(dto, localidadId, distritoId, cpId, responsableId);

            // Redirigimos de vuelta al listado, dejando el panel lateral abierto en modo LECTURA
            return "redirect:/tiendas?campaniaId=" + campaniaId + "&tiendaId=" + tiendaId;
        }









    }
