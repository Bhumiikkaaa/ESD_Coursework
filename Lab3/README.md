# ESD Lab 3 — Campus Event Registration API Debugging

## Overview

This lab provides a Spring Boot REST API for campus event registration with **8 intentional bugs**. Your task is to identify the bugs, correct the implementation, and verify your changes using the provided tests.

**Important:** Debug and fix the application manually. Do not use AI tools to generate fixes.

## Technology Stack

- Java 17 or later
- Spring Boot 3.3.5
- Spring Data JPA
- H2 in-memory database
- Maven
- JUnit 5 and MockMvc
- Swagger UI

## Prerequisites

Install or configure:

- JDK 17 or 21
- IntelliJ IDEA or another Java IDE
- Maven, if you intend to run Maven commands directly from the terminal
- Git, if you need to clone the repository

Verify your Java and Maven installations:

```bash
java -version
mvn -version
```

## 1. Clone the Repository

```bash
git clone https://github.com/sivasomanath2502/ESD_BugLab.git
cd ESD_BugLab
```

Open the project in IntelliJ IDEA and wait for Maven dependencies to load.

## 2. Run the Tests First

**Before modifying any code, run the tests to observe the initial failures.**

### Using IntelliJ IDEA

1. Open `Lab3BugTests.java` under the test source directory.
2. Right-click the test class.
3. Select **Run 'Lab3BugTests'**.
4. Review the test results and note the expected and actual behaviour.

### Using Maven

From the project root, run:

```bash
mvn test
```

The eight bug-specific tests are expected to fail initially. The smoke test should pass.

Do not modify or remove the tests to make them pass.

## 3. Bugs to Fix

Refer to [`ESD-Lab3-Bugs-to-Fix.md`](ESD-Lab3-Bugs-to-Fix.md) for the list of eight bugs and their expected behaviour.

## 4. Run the Application

### Using IntelliJ IDEA

Run the main Spring Boot application class, `EsdLab3Application`.

### Using Maven

```bash
mvn spring-boot:run
```

Wait until the application starts successfully.

The application uses an in-memory H2 database. Data may be reset when the application restarts.

## 5. Test the API

Open Swagger UI in your browser:

http://localhost:8080/swagger-ui/index.html

Use the available endpoints to test the API and inspect the HTTP status codes and response bodies.

## 6. Fix the Bugs and Rerun the Tests

Work on one bug at a time:

1. Identify a failing test.
2. Reproduce the incorrect behaviour.
3. Investigate the relevant application code.
4. Fix the underlying issue.
5. Rerun the relevant test.
6. Rerun the complete test suite to check for regressions.

Continue until all eight bug-specific tests and the smoke test pass.

## 7. Completion Criteria

- All eight bugs have been corrected.
- All provided tests pass.
- The application starts successfully.
- The API behaves as expected when tested locally using Swagger UI.

**Do not change or weaken the tests to achieve a passing result.** Fix the application code instead.
