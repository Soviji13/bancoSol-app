//frasncisco javier garcia sierra 0% ia
//he creado un nuevo dto para traer exclusivamente solo los pocos datos que necesitamos en TIENDAS,
//y para no molestar a sofia en su ResponsableEnitdadDTO.
//ademas como me traigo menos datos será mas eficiente al no traerme datos q no quiero para nada.

package com.bancosol.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
    public class ResponsableEntidadResumenDTO {
        private String nombreResponsable;
        private String nombreEntidad;
    }

