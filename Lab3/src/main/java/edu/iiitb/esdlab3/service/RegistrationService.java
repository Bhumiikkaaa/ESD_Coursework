package edu.iiitb.esdlab3.service;

import edu.iiitb.esdlab3.dto.CheckInRequest;
import edu.iiitb.esdlab3.dto.CreateRegistrationRequest;
import edu.iiitb.esdlab3.dto.TransferRegistrationRequest;
import edu.iiitb.esdlab3.entity.*;
import edu.iiitb.esdlab3.exception.*;
import edu.iiitb.esdlab3.repository.EventRepository;
import edu.iiitb.esdlab3.repository.RegistrationRepository;

import java.util.List;
import java.util.Locale;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final EventService eventService;

    @Transactional
    public Registration register(
            Long eventId,
            CreateRegistrationRequest request) {

        Event event = eventService.get(eventId);

        long activeCount = registrationRepository
                .countByEvent_IdAndStatus(
                        eventId,
                        RegistrationStatus.ACTIVE
                );

        if (activeCount >= event.getCapacity()) {
            throw new EventFullException();
        }

        String email = request.getStudentEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        // Intentionally missing duplicate-registration check.
        if(registrationRepository.existsByEvent_IdAndStudentEmailIgnoreCaseAndStatus(eventId, email, RegistrationStatus.ACTIVE)){
                throw new DuplicateRegistrationException();
        }
        return registrationRepository.save(
                new Registration(
                        event,
                        email,
                        RegistrationStatus.ACTIVE
                )
        );
    }

    public List<Registration> activeForEvent(Long eventId) {
        eventService.get(eventId);
        return registrationRepository.findActiveByEventId(eventId, RegistrationStatus.ACTIVE);
    }

    @Transactional
    public void cancel(Long registrationId) {
        Registration registration = registrationRepository
                .findById(registrationId)
                .orElseThrow(
                        () -> new RegistrationNotFoundException(registrationId)
                );

        if (registration.getStatus() == RegistrationStatus.ACTIVE) {
            registration.setStatus(RegistrationStatus.CANCELLED);
        }
    }

    @Transactional
    public Registration transfer(Long registrationId, TransferRegistrationRequest request) {
        Registration registration = registrationRepository
                .findById(registrationId)
                .orElseThrow(
                        () -> new RegistrationNotFoundException(registrationId)
                );

        if (registration.getStatus() == RegistrationStatus.CANCELLED) {
            throw new RegistrationConflictException();
        }

        String studentEmail = request.getStudentEmail().trim();

        if (!registration.getStudentEmail().equalsIgnoreCase(studentEmail)) {
            throw new UnauthorizedOperationException();
        }

        Event targetEvent = eventService.get(request.getTargetEventId());

        long activeCount = registrationRepository.countByEvent_IdAndStatus(
                targetEvent.getId(),
                RegistrationStatus.ACTIVE
        );
        if (activeCount >= targetEvent.getCapacity()) {
            throw new EventFullException();
        }

        if (registrationRepository.existsByEvent_IdAndStudentEmailIgnoreCaseAndStatus(
                targetEvent.getId(),
                studentEmail,
                RegistrationStatus.ACTIVE)) {
            throw new DuplicateRegistrationException();
        }

        registration.setStatus(RegistrationStatus.CANCELLED);
        Registration newRegistration = new Registration(
                targetEvent,
                studentEmail.toLowerCase(Locale.ROOT),
                RegistrationStatus.ACTIVE
        );
        return registrationRepository.save(newRegistration);
    }

    @Transactional
    public Registration checkIn(Long eventId, CheckInRequest request) {
        // 1. Verify event exists (throws EventNotFoundException if not found)
        eventService.get(eventId);

        // 2. Find active registration for this student and event
        Registration registration = registrationRepository
                .findByEvent_IdAndStudentEmailIgnoreCaseAndStatus(
                        eventId,
                        request.getStudentEmail().trim(),
                        RegistrationStatus.ACTIVE
                )
                .orElseThrow(() -> new RegistrationNotFoundException("Registration not found"));

        // 3. Prevent duplicate check-in
        if (registration.isCheckedIn()) {
            throw new AlreadyCheckedInException();
        }

        // 4. Update check-in state
        registration.markCheckedIn();
        return registrationRepository.save(registration);
    }
}