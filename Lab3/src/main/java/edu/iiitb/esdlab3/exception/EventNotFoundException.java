package edu.iiitb.esdlab3.exception;

public class EventNotFoundException extends RuntimeException {

    public EventNotFoundException(Long id) {
        super("Event not found: " + id);
    }
}