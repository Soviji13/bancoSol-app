//francisco javier garcia sierra
//USO IA: correccion para usar @RestController

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

@RestController // Usamos RestController porque responde a llamadas AJAX/Fetch directamente con JSON
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
        // 1. Guardar el Contacto
        Contacto nuevoContacto = new Contacto();
        nuevoContacto.setNombre(nombre);
        nuevoContacto.setEmail(email);
        nuevoContacto.setTelefono(telefono);
        Contacto contactoGuardado = contactoRepo.save(nuevoContacto);

        // 2. Guardar el Usuario (Exigencia de la BD)
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail(email);
        nuevoUsuario.setContrasenia(password); // (O setPassword)
        nuevoUsuario.setRol(TipoRol.RESPONSABLE_TIENDA);
        Usuario usuarioGuardado = usuarioRepo.save(nuevoUsuario);

        // 3. Guardar Responsable con todo vinculado
        ResponsableTienda nuevoResp = new ResponsableTienda();
        nuevoResp.setNombre(nombre);
        nuevoResp.setContacto(contactoGuardado);
        nuevoResp.setUsuario(usuarioGuardado); // ESTO EVITA EL ERROR 500
        ResponsableTienda respGuardado = responsableTiendaRepo.save(nuevoResp);

        ResponsableTiendaDTO dtoRes = new ResponsableTiendaDTO();
        dtoRes.setId(respGuardado.getId());
        dtoRes.setNombre(respGuardado.getNombre());
        return dtoRes;
    }
}