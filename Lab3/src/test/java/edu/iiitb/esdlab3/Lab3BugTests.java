
package edu.iiitb.esdlab3;

import edu.iiitb.esdlab3.exception.ApiExceptionHandler;
import edu.iiitb.esdlab3.exception.EventFullException;
import edu.iiitb.esdlab3.entity.Event;
import edu.iiitb.esdlab3.entity.Registration;
import edu.iiitb.esdlab3.entity.RegistrationStatus;
import edu.iiitb.esdlab3.repository.EventRepository;
import edu.iiitb.esdlab3.repository.RegistrationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class Lab3BugTests {

    @Autowired
    MockMvc mvc;

    @Autowired
    EventRepository events;

    @Autowired
    RegistrationRepository registrations;

    @BeforeEach
    void clean() {
        registrations.deleteAll();
        events.deleteAll();
    }

    @Test
    void B1_rejectsZeroCapacity() throws Exception {
        mvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Bad Event\",\"capacity\":0}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void B2_rejectsBlankEmail() throws Exception {
        Event e = events.save(new Event("Event", 3));

        mvc.perform(post("/api/events/" + e.getId() + "/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"studentEmail\":\"   \"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void B3_rejectsRegistrationAtCapacity() throws Exception {
        Event e = events.save(new Event("Full", 1));
        registrations.save(
                new Registration(e, "first@example.com", RegistrationStatus.ACTIVE)
        );

        mvc.perform(post("/api/events/" + e.getId() + "/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"studentEmail\":\"second@example.com\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void B4_rejectsDuplicateRegistrationCaseInsensitively() throws Exception {
        Event e = events.save(new Event("Event", 3));
        registrations.save(
                new Registration(e, "student@example.com", RegistrationStatus.ACTIVE)
        );

        mvc.perform(post("/api/events/" + e.getId() + "/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"studentEmail\":\"STUDENT@example.com\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void B5_cancellationChangesState() throws Exception {
        Event e = events.save(new Event("Event", 3));
        Registration r = registrations.save(
                new Registration(e, "student@example.com", RegistrationStatus.ACTIVE)
        );

        mvc.perform(delete("/api/registrations/" + r.getId()))
                .andExpect(status().isNoContent());

        assertEquals(
                RegistrationStatus.CANCELLED,
                registrations.findById(r.getId()).orElseThrow().getStatus()
        );
    }

    @Test
    void B6_activeListExcludesCancelled() throws Exception {
        Event e = events.save(new Event("Event", 3));

        registrations.save(
                new Registration(e, "active@example.com", RegistrationStatus.ACTIVE)
        );
        registrations.save(
                new Registration(e, "cancelled@example.com", RegistrationStatus.CANCELLED)
        );

        mvc.perform(get("/api/events/" + e.getId() + "/registrations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(1)))
                .andExpect(jsonPath("$[0].studentEmail").value("active@example.com"));
    }

    @Test
    void B7_capacityExceptionMapsToConflictStatus() {
        ApiExceptionHandler handler = new ApiExceptionHandler();
        MockHttpServletRequest request =
                new MockHttpServletRequest("POST", "/api/events/1/registrations");

        var response = handler.eventFull(new EventFullException(), request);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }

    @Test
    void B8_missingEventReturnsNotFoundEvenWhenOtherEventsExist() throws Exception {
        events.save(new Event("Existing", 3));

        mvc.perform(get("/api/events/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void smoke_eventListWorks() throws Exception {
        mvc.perform(get("/api/events"))
                .andExpect(status().isOk());
    }
}
