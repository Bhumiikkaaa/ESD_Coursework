// Section 05 — Callbacks and higher-order functions

// How many items make predicate(item) return true? Write the loop yourself.
export function countWhere(list, predicate) {
  let count = 0;
  for (const item of list) {
    if (predicate(item)) count++;
  }
  return count;
}

// Returns a comparator for Array.prototype.sort that orders by one field,
// ascending. Works for strings and numbers.
export function byField(field) {
  return (a, b) => {
    if (a[field] < b[field]) return -1;
    if (a[field] > b[field]) return 1;
    return 0;
  };
}

// A setter that accepts either a new value or a function that computes
// the new value from the current one.
export function applyUpdate(current, update) {
  return typeof update === "function" ? update(current) : update;
}

// Apply a list of updates in order, each one to the result of the last.
export function applyAll(start, updates) {
  return updates.reduce((acc, update) => applyUpdate(acc, update), start);
}
