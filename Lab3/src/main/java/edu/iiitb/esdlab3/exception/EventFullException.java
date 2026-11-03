package edu.iiitb.esdlab3.exception;

public class EventFullException extends RuntimeException {

    public EventFullException() {
        super("Event has reached capacity");
    }
}