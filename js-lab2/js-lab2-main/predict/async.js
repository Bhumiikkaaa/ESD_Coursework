// PREDICT, THEN RUN.   node predict/async.js
// Write what you expect under each block BEFORE running. Then explain every surprise.
const wait = (ms, label) => new Promise((resolve) => setTimeout(() => resolve(label), ms));

async function main() {
  // ---- 1. What does an async function return? -----------------------------
  async function getCount() { return 3; }
  console.log("1:", getCount());
  // Prediction: 1: Promise { 3 } — an async function ALWAYS returns a promise,
  //   even when it returns a plain value. You need await (or .then) to get the 3.

  // ---- 2. The order things happen in ----------------------------------------
  console.log("2: a");
  setTimeout(() => console.log("2: b (timer)"), 0);
  Promise.resolve().then(() => console.log("2: c (promise)"));
  console.log("2: d");
  await wait(10);
  // Prediction (order of a, b, c, d): a, d, c, b.
  //   a and d are plain synchronous code, so they run first. Then the microtask
  //   queue (promise callbacks) is emptied BEFORE any timer runs — so c, then b,
  //   even though the timer was 0 ms and was scheduled first.

  // ---- 3. await pauses THIS function, not the program ------------------------
  const order = [];
  const job = async () => { order.push("job starts"); await wait(20); order.push("job ends"); };
  const running = job();
  order.push("main carries on");
  await running;
  console.log("3:", order);
  // Prediction: 3: [ 'job starts', 'main carries on', 'job ends' ]
  //   job() runs synchronously up to its first await, then hands control back,
  //   so main carries on. await only pauses the async function it's in.

  // ---- 4. One after another, or all at once? ---------------------------------
  let t = Date.now();
  await wait(100); await wait(100); await wait(100);
  console.log("4: in order took about", Math.round((Date.now() - t) / 50) * 50, "ms");
  t = Date.now();
  await Promise.all([wait(100), wait(100), wait(100)]);
  console.log("4: all at once took about", Math.round((Date.now() - t) / 50) * 50, "ms");
  // Prediction (both numbers): about 300 ms, then about 100 ms.
  //   Each await waits for the previous wait to finish (100 + 100 + 100);
  //   Promise.all starts all three timers together, so they overlap.

  // ---- 5. Who finishes first? -----------------------------------------------
  const winners = [];
  await Promise.all([
    wait(80).then(() => winners.push("Electronics (asked first, slow network)")),
    wait(20).then(() => winners.push("Mathematics (asked second, fast network)")),
  ]);
  console.log("5: arrived in this order:", winners);
  // Prediction — and if each one REPLACED the list on screen when it arrived,
  // which department would the student see at the end?
  // Prediction: Mathematics arrives first (20 ms), then Electronics (80 ms).
  //   The order of arrival depends on the network, not on the order asked.
  //   If each answer replaced the list, the student would end up seeing
  //   ELECTRONICS — the old request — while Mathematics is selected. That's the
  //   bug createLatestOnly() fixes in section 09.

  // ---- 6. A closure, captured at call time ------------------------------------
  let department = "Electronics";
  const showLater = async () => { const d = department; await wait(30); return `showing ${d}`; };
  const pending = showLater();
  department = "Mathematics";
  console.log("6:", await pending, "| department is now", department);
  // Prediction: 6: showing Electronics | department is now Mathematics
  //   `const d = department` runs synchronously when showLater() is called,
  //   before the reassignment, so d keeps "Electronics". The variable itself
  //   has changed by the time we print it.

  // ---- 7. An error inside async ----------------------------------------------
  async function load() { throw new Error("HTTP 500"); }
  try {
    await load();
    console.log("7: loaded");
  } catch (error) {
    console.log("7: caught", error.message);
  }
  // Prediction: 7: caught HTTP 500
  //   A throw inside an async function becomes a REJECTED promise; await turns
  //   that rejection back into a thrown error, so an ordinary try/catch catches it
  //   and "7: loaded" is never printed.
}

main();
