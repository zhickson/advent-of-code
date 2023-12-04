#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const input = String(fs.readFileSync(path.join(__dirname, "input.txt")))
  .trim()
  .split("\n");

let totalPoints = [];
input.forEach((line) => {
  const [cardName, cardParts] = line.split(": ");
  const [winningNumbersPart, myNumbersPart] = cardParts.split(" | ");
  const winningNumbers = winningNumbersPart.split(" ");
  const myNumbers = myNumbersPart.split(" ").filter((item) => item !== ""); // trim out some empty items.

  // find how many matching numbers between the two sets.
  let matches = [];
  for (let i = 0; i < myNumbers.length; i++) {
    if (winningNumbers.includes(myNumbers[i])) {
      matches.push(1);
    }
  }
  if (matches.length) {
    const points = matches.reduce((acc, val) => acc * 2, 1) / 2;
    totalPoints.push(points);
  }
});

console.log(totalPoints);
const pointsSum = totalPoints.reduce((acc, val) => acc + val, 0);
console.log(pointsSum);
