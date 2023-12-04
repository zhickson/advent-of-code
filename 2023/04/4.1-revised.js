#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const input = String(fs.readFileSync(path.join(__dirname, "input.txt")))
  .trim()
  .split("\n");

// Revised to use JavaScript Sets.
// Courtesy: Low Level Learning.
let value = 0;
for (let i = 0; i < input.length; i++) {
  const line = input[i];

  let game = line.split(": ")[1];
  let winning = game.split(" | ")[0];
  let ours = game.split(" | ")[1];

  let winnum = winning
    .split(" ")
    .map((x) => Number(x))
    .filter((x) => 0 !== x);

  let ournum = ours
    .split(" ")
    .map((x) => Number(x))
    .filter((x) => 0 !== x);

  let winset = new Set(winnum);
  let ourset = new Set(ournum);

  winning = Array.from(new Set([...winset].filter((i) => ourset.has(i))));

  if (winning.length > 0) {
    value += Math.pow(2, winning.length - 1);
  }
}
console.log(value);
