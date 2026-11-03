package edu.iiitb.esdlab3.dto;

import edu.iiitb.esdlab3.entity.Event;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private Long id;
    private String title;
    private Integer capacity;
    private LocalDateTime createdAt;

    public static EventResponse from(Event e) {
        return new EventResponse(
                e.getId(),
                e.getTitle(),
                e.getCapacity(),
                e.getCreatedAt()
        );
    }
}