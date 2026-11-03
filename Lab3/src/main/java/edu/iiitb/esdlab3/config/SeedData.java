package edu.iiitb.esdlab3.config;
import edu.iiitb.esdlab3.entity.*;
import edu.iiitb.esdlab3.repository.EventRepository;
import edu.iiitb.esdlab3.repository.RegistrationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class SeedData {
  @Bean CommandLineRunner seed(EventRepository events, RegistrationRepository registrations){return args -> {
    if(events.count()>0) return;
    Event workshop=events.save(new Event("ESD Debugging Workshop",2));
    Event seminar=events.save(new Event("AI Seminar",5));
    Event cloud=events.save(new Event("Cloud Systems Workshop",3));
    registrations.save(new Registration(workshop,"student1@example.com",RegistrationStatus.ACTIVE));
    registrations.save(new Registration(workshop,"student2@example.com",RegistrationStatus.ACTIVE));
    registrations.save(new Registration(seminar,"student3@example.com",RegistrationStatus.ACTIVE));
    registrations.save(new Registration(seminar,"student4@example.com",RegistrationStatus.CANCELLED));
  };}
}
