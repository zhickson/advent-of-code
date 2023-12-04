#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const input = String(fs.readFileSync(path.join(__dirname, "example.txt")))
  .trim()
  .split("\n");

// A more elegant solution.
// https://github.com/leyanlo/advent-of-code/blob/main/2023/day-04.js
// Create array of numbers (1) for each line/card.
const nCards = input.map(() => 1);

// Loop through each line/card.
for (let i = 0; i < input.length; i++) {
  // Current line.
  const line = input[i];

  // Extract wins and nums from each card.
  let [wins, nums] = line.split(":")[1].split("|");

  // Convert strings to numbers.
  wins = wins.match(/\d+/g).map(Number);
  nums = nums.match(/\d+/g).map(Number);

  // Find wins.
  const nWins = nums.filter((n) => wins.includes(n)).length;

  // Loop through each win.
  for (let j = 0; j < nWins; j++) {
    // For each win, add to the value of the cards.
    nCards[i + 1 + j] += nCards[i];
  }
}
const solution = nCards.reduce((acc, n) => acc + n);
console.log(solution);
