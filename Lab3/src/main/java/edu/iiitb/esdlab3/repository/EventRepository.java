package edu.iiitb.esdlab3.repository;

import edu.iiitb.esdlab3.entity.Event;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}