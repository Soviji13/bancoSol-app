//francisco javier garcia sierra
//uso ia: uso del @restcontroller y peticiones fetch ajax para NO recargar pagina al guardar responsable,
//me lo sugirio la ia para no perder progreso de datos en form padre!!!!, ya que cuando lo hice al guardar el resp
//se borraba todo el formulario anterior, setteo y demas si es mio

package com.bancosol.controllers;

import com.bancosol.dao.ContactoRepository;
import com.bancosol.dao.ResponsableTiendaRepository;
import com.bancosol.dao.UsuarioRepository;
import com.bancosol.dto.ResponsableTiendaDTO;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.ResponsableTienda;
import com.bancosol.entities.Usuario;
import com.bancosol.entities.enums.TipoRol;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/responsables")
@AllArgsConstructor
public class RespTiendaController {

    private final ContactoRepository contactoRepo;
    private final ResponsableTiendaRepository responsableTiendaRepo;
    private final UsuarioRepository usuarioRepo;

    @PostMapping("/guardar-ajax")
    public ResponsableTiendaDTO guardarResponsableAjax(
            @RequestParam("nombre") String nombre,
            @RequestParam("email") String email,
            @RequestParam("telefono") String telefono,
            @RequestParam(value = "password", defaultValue = "1234") String password
    ) {
        //guardamos primero el contacto para enlazarlo
        Contacto nuevoContacto = new Contacto();
        nuevoContacto.setNombre(nombre);
        nuevoContacto.setEmail(email);
        nuevoContacto.setTelefono(telefono);
        Contacto contactoGuardado = contactoRepo.save(nuevoContacto);

        //guardamos el usuario pq lo exige base de datos
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail(email);
        nuevoUsuario.setContrasenia(password);
        nuevoUsuario.setRol(TipoRol.RESPONSABLE_TIENDA);
        Usuario usuarioGuardado = usuarioRepo.save(nuevoUsuario);

        //guardamos responsable vinculando lo anterior
        ResponsableTienda nuevoResp = new ResponsableTienda();
        nuevoResp.setNombre(nombre);
        nuevoResp.setContacto(contactoGuardado);
        nuevoResp.setUsuario(usuarioGuardado);
        ResponsableTienda respGuardado = responsableTiendaRepo.save(nuevoResp);

        ResponsableTiendaDTO dtoRes = new ResponsableTiendaDTO();
        dtoRes.setId(respGuardado.getId());
        dtoRes.setNombre(respGuardado.getNombre());
        return dtoRes;
    }
}