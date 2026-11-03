package edu.iiitb.esdlab3.exception;

public class RegistrationConflictException extends RuntimeException {

    public RegistrationConflictException() {
        super("Registration is already cancelled");
    }
}