package com.bancosol.services;

import org.springframework.beans.factory.ListableBeanFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DiagnosticoPersistenciaService {

    private final ListableBeanFactory beanFactory;

    public DiagnosticoPersistenciaService(ListableBeanFactory beanFactory) {
        this.beanFactory = beanFactory;
    }

    public List<EstadoRepositorio> revisarRepositorios() {
        Map<String, JpaRepository> repositorios = beanFactory.getBeansOfType(JpaRepository.class);
        List<EstadoRepositorio> estados = new ArrayList<>();

        repositorios.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> {
                    String nombreBean = entry.getKey();
                    JpaRepository repo = entry.getValue();
                    try {
                        long total = repo.count();
                        estados.add(new EstadoRepositorio(nombreBean, true, total, null));
                    } catch (Exception ex) {
                        estados.add(new EstadoRepositorio(nombreBean, false, null, mensajeCorto(ex)));
                    }
                });

        return estados;
    }

    public DetalleRepositorio detalleRepositorio(String nombreBean, int limiteMuestra) {
        Map<String, JpaRepository> repositorios = beanFactory.getBeansOfType(JpaRepository.class);
        JpaRepository repo = repositorios.get(nombreBean);
        if (repo == null) {
            throw new IllegalArgumentException("No existe el repositorio: " + nombreBean);
        }

        long total = repo.count();
        List<?> muestra = repo.findAll(PageRequest.of(0, Math.max(1, limiteMuestra))).getContent();
        List<Map<String, Object>> muestraSerializable = muestra.stream()
                .map(this::aMapaPlano)
                .toList();

        return new DetalleRepositorio(nombreBean, total, muestraSerializable);
    }

    private Map<String, Object> aMapaPlano(Object entidad) {
        Map<String, Object> resultado = new LinkedHashMap<>();
        if (entidad == null) {
            return resultado;
        }

        List<Field> campos = obtenerCampos(entidad.getClass());
        campos.sort(Comparator.comparing(Field::getName));

        for (Field campo : campos) {
            if (campo.isSynthetic()) {
                continue;
            }
            campo.setAccessible(true);
            try {
                Object valor = campo.get(entidad);
                if (esValorSimple(valor)) {
                    resultado.put(campo.getName(), valor);
                }
            } catch (IllegalAccessException ignored) {
                // Se ignora para no romper el diagnostico por campos inaccesibles.
            }
        }

        if (resultado.isEmpty()) {
            resultado.put("valor", entidad.toString());
        }

        return resultado;
    }

    private List<Field> obtenerCampos(Class<?> type) {
        List<Field> campos = new ArrayList<>();
        Class<?> actual = type;
        while (actual != null && actual != Object.class) {
            for (Field field : actual.getDeclaredFields()) {
                campos.add(field);
            }
            actual = actual.getSuperclass();
        }
        return campos;
    }

    private boolean esValorSimple(Object valor) {
        if (valor == null) {
            return true;
        }
        Class<?> type = valor.getClass();
        return type.isPrimitive()
                || Number.class.isAssignableFrom(type)
                || CharSequence.class.isAssignableFrom(type)
                || Boolean.class.isAssignableFrom(type)
                || Character.class.isAssignableFrom(type)
                || Enum.class.isAssignableFrom(type)
                || LocalDate.class.isAssignableFrom(type)
                || LocalDateTime.class.isAssignableFrom(type)
                || LocalTime.class.isAssignableFrom(type);
    }

    private String mensajeCorto(Exception ex) {
        if (ex.getMessage() == null || ex.getMessage().isBlank()) {
            return ex.getClass().getSimpleName();
        }
        return ex.getClass().getSimpleName() + ": " + ex.getMessage();
    }

    public static class EstadoRepositorio {
        private final String nombreBean;
        private final boolean ok;
        private final Long totalRegistros;
        private final String error;

        public EstadoRepositorio(String nombreBean, boolean ok, Long totalRegistros, String error) {
            this.nombreBean = nombreBean;
            this.ok = ok;
            this.totalRegistros = totalRegistros;
            this.error = error;
        }

        public String getNombreBean() {
            return nombreBean;
        }

        public boolean isOk() {
            return ok;
        }

        public Long getTotalRegistros() {
            return totalRegistros;
        }

        public String getError() {
            return error;
        }
    }

    public static class DetalleRepositorio {
        private final String nombreBean;
        private final long totalRegistros;
        private final List<Map<String, Object>> muestra;

        public DetalleRepositorio(String nombreBean, long totalRegistros, List<Map<String, Object>> muestra) {
            this.nombreBean = nombreBean;
            this.totalRegistros = totalRegistros;
            this.muestra = muestra;
        }

        public String getNombreBean() {
            return nombreBean;
        }

        public long getTotalRegistros() {
            return totalRegistros;
        }

        public List<Map<String, Object>> getMuestra() {
            return muestra;
        }
    }
}

