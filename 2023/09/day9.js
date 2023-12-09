#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const input = String(
  fs.readFileSync(path.join(__dirname, "input.txt"))
).trimEnd();

const lines = input.split("\n");

// Part 1
function part1(input) {
  const histories = input.map((line) => line.split(" ").map(Number));

  const sum = [];
  for (let history of histories) {
    // Loop through each and create new array with the difference.
    let allHistories = [];
    allHistories.push(history);
    while (true) {
      if (history.every((n) => n === 0)) {
        history.push(0);
        break;
      }
      history = diff(history);
      allHistories.push(history);
    }
    // Add placeholders
    allHistories.reverse();
    allHistories.map((array, index) => {
      const arrayBelow = allHistories[index - 1];
      let replace = 0;
      if (undefined !== arrayBelow) {
        const lastItem = array[array.length - 1];
        const valueBelow = arrayBelow[arrayBelow.length - 1];
        replace = lastItem + valueBelow;
        array.push(replace);
      }
    });
    allHistories.reverse();
    sum.push(allHistories[0][allHistories[0].length - 1]);
  }
  console.log(sum);
  const result = sum.reduce((a, c) => a + c, 0);
  console.log(result);
}

// Solve
part1(lines);
// part2(input);

// Calculate the difference between items in an array.
function diff(array) {
  return array.slice(1).map((n, i) => n - array[i]);
}
