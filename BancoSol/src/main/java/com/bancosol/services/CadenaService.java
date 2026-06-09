package com.bancosol.services;

import com.bancosol.dao.CadenaRepository;
import com.bancosol.dto.CadenaDTO;
import com.bancosol.dto.CadenaFormDTO;
import com.bancosol.entities.Cadena;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CadenaService {

    private final CadenaRepository cadenaRepository;

    public CadenaService(CadenaRepository cadenaRepository) {
        this.cadenaRepository = cadenaRepository;
    }

    public List<CadenaDTO> listarTodas() {
        return cadenaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public CadenaDTO buscarPorId(Long id) {
        Cadena cadena = cadenaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe una cadena con id " + id
                ));

        return toDTO(cadena);
    }

    public CadenaDTO crear(CadenaFormDTO form) {
        validarFormulario(form);

        Cadena cadena = new Cadena();
        cadena.setNombre(form.getNombre().trim());
        cadena.setCodigo(form.getCodigo().trim().toUpperCase());

        Cadena cadenaGuardada = cadenaRepository.save(cadena);

        return toDTO(cadenaGuardada);
    }

    private void validarFormulario(CadenaFormDTO form) {
        if (form == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los datos de la cadena son obligatorios"
            );
        }

        if (form.getNombre() == null || form.getNombre().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nombre de la cadena es obligatorio"
            );
        }

        if (form.getCodigo() == null || form.getCodigo().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El acrónimo de la cadena es obligatorio"
            );
        }

        if (form.getCodigo().trim().length() > 4) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El acrónimo no puede tener más de 4 letras"
            );
        }
    }

    private CadenaDTO toDTO(Cadena cadena) {
        return new CadenaDTO(
                cadena.getId(),
                cadena.getNombre(),
                cadena.getCodigo(),
                cadena.getCampanias() == null
                        ? List.of()
                        : cadena.getCampanias()
                        .stream()
                        .map(campania -> campania.getId())
                        .toList()
        );
    }
}