package edu.iiitb.esdlab3.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRegistrationRequest {
    @NotNull (message = "Email id cannot be null")
    @NotBlank (message = "Email cannot be blank")
    private String studentEmail;
}