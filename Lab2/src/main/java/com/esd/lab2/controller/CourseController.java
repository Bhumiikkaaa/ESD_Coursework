package com.esd.lab2.controller;

import com.esd.lab2.dto.CourseRequest;
import com.esd.lab2.dto.CourseResponse;
import com.esd.lab2.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing courses.
 * GET /api/courses and GET /api/courses/{id} are public.
 * POST /api/courses is restricted to ADMIN users.
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    /** P1 – public list of courses */
    @GetMapping
    public ResponseEntity<List<CourseResponse>> listCourses() {
        return ResponseEntity.ok(courseService.findAll());
    }

    /** Public course detail endpoint */
    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.findById(id));
    }

    /** P3 – ADMIN-only course creation */
    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.create(request));
    }
}
