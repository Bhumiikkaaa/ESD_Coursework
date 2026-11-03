// A module-level variable. There is ONE of these for the whole program.
let clicks = 0;
export function click() {
  clicks += 1;
  return clicks;
}
