// Section 07 — `this`

// A class that keeps its own list. It works when you call list.add(4).
// It breaks when add() is passed around as a callback:
//     [4, 10, 18].forEach(list.add)
// because the method loses `this`. Fix it so add works even when detached.
// Two accepted fixes: bind in the constructor, or make add an arrow-function
// class field. Pick one and be able to explain why it works.
export class PlannerList {
  constructor(owner) {
    this.owner = owner;
    this.ids = [];
  }

  add(id) {
    this.ids.push(id);
  }

  describe() {
    return `${this.owner} has ${this.ids.length} course(s) planned`;
  }
}
