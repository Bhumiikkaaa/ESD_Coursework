package edu.iiitb.esdlab3.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequest {

    @NotBlank(message = "Title is required")
    private String title;
    @NotNull (message = "Capacity should not be null" )
    @Min (value = 1, message = "Capacity should be positive value")
    private Integer capacity;
}