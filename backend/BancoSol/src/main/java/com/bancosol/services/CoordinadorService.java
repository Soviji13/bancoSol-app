package com.bancosol.services;

import com.bancosol.dao.ContactoRepository;
import com.bancosol.dao.CoordinadorRepository;
import com.bancosol.dao.EntidadColaboradoraRepository;
import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.mapper.CoordinadorMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class CoordinadorService {

    private final CoordinadorRepository repo;
    private final ContactoRepository contactoRepo;
    private final EntidadColaboradoraRepository entidadRepo;


    private final CoordinadorMapper coordinadorMapper;

    @Transactional(readOnly = true)
    public List<CoordinadorDTO> listarTodos() {
        return coordinadorMapper.toDTOList(repo.findAll());
    }

    @Transactional(readOnly = true)
    public CoordinadorDTO findById(Long id) {
        return repo.findById(id)
                .map(coordinadorMapper::toDTO)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<CoordinadorDTO> findAllById(List<Long> ids) {
        return coordinadorMapper.toDTOList(repo.findAllById(ids));
    }



    @Transactional
    public Long guardar(CoordinadorDTO dto) {
        Coordinador coordinador;

        if (dto.getId() != null) {
            coordinador = repo.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Coordinador no encontrado"));
        } else {
            coordinador = new Coordinador();
        }

        coordinador.setArea(dto.getArea());

        Contacto contacto = coordinador.getContacto();
        if (contacto == null) {
            contacto = new Contacto();
        }
        contacto.setNombre(dto.getNombreContacto());
        contacto.setEmail(dto.getEmailContacto());
        contacto.setTelefono(dto.getTelefonoContacto());

        contacto = contactoRepo.save(contacto);
        coordinador.setContacto(contacto);

        Coordinador coordinadorGuardado = repo.save(coordinador);

        if (dto.getEntidadId() != null) {
            EntidadColaboradora entidad = entidadRepo.findById(dto.getEntidadId())
                    .orElseThrow(() -> new RuntimeException("Entidad no encontrada"));

            entidad.setCoordinador(coordinadorGuardado);
            entidadRepo.save(entidad);
        }
        repo.save(coordinadorGuardado);

        return coordinadorGuardado.getId();
    }

    @Transactional
    public void eliminar(Long id) {
        Coordinador coordinador = repo.findById(id).orElse(null);

        if (coordinador != null) {
            Contacto contacto = coordinador.getContacto();

            repo.delete(coordinador);
            if (contacto != null) {
                contactoRepo.delete(contacto);
            }
        }
    }


}