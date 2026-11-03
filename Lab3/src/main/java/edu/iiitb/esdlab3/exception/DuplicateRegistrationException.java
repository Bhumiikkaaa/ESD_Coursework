package edu.iiitb.esdlab3.exception;

public class DuplicateRegistrationException extends RuntimeException {

    public DuplicateRegistrationException() {
        super("Student already has an active registration for this event");
    }
}