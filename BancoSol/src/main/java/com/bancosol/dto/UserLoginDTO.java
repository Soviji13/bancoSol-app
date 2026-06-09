package com.bancosol.dto;

import com.bancosol.entities.enums.TurnoDia;
import com.bancosol.entities.enums.TurnoFranja;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginDTO {
  private String pass;
  private String user;
}
