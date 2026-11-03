package edu.iiitb.esdlab3.controller;

import edu.iiitb.esdlab3.dto.*;
import edu.iiitb.esdlab3.entity.Event;
import edu.iiitb.esdlab3.service.EventService;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> create(
            @Valid @RequestBody CreateEventRequest request) {

        Event event = eventService.create(request);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(event.getId())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(EventResponse.from(event));
    }

    @GetMapping
    public List<EventResponse> list() {
        return eventService.list()
                .stream()
                .map(EventResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public EventResponse get(@PathVariable Long id) {
        return EventResponse.from(eventService.get(id));
    }
}