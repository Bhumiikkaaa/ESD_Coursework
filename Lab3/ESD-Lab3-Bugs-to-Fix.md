# ESD Lab 3 --- Bugs to Fix

Fix the following eight bugs in the Campus Event Registration API:

1.  **Invalid event capacity:** Events with zero or negative capacity
    are accepted. They should be rejected with HTTP `400 Bad Request`.
2.  **Blank student email:** Registrations with a blank or
    whitespace-only email are accepted. They should be rejected with
    HTTP `400 Bad Request`.
3.  **Event capacity exceeded:** The API accepts registrations beyond
    the event's capacity. Excess registrations should be rejected with
    HTTP `409 Conflict`.
4.  **Duplicate active registration:** A student can register more than
    once for the same event while an active registration exists. Email
    comparisons should be case-insensitive. Duplicates should be
    rejected with HTTP `409 Conflict`.
5.  **Cancellation status:** Cancelling a registration does not change
    its status from `ACTIVE` to `CANCELLED`.
6.  **Active-registration listing:** Cancelled registrations appear in
    the list of active registrations. Only `ACTIVE` registrations should
    be returned.
7.  **Incorrect capacity-conflict status:** A capacity conflict returns
    HTTP `400 Bad Request` instead of HTTP `409 Conflict`.
8.  **Non-existent event lookup:** Requesting a non-existent event ID
    returns a different event instead of HTTP `404 Not Found`.
