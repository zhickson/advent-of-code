#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");

const input = String(fs.readFileSync(path.join(__dirname, "input.txt")))
  .trim()
  .split("\n");

const pStart = performance.now();

const cubeOptions = {
  red: 12,
  green: 13,
  blue: 14,
};

let possibleGameIds = [];

const partOne = input.map((gameLine) => {
  const gameRegex = Array.from(gameLine.matchAll(/(Game )(\d{1,100})/g));
  const gameId = parseInt(gameRegex[0][2]);
  const trimmedLine = gameLine.replace(gameRegex[0][0] + ": ", "");
  const games = trimmedLine.split("; ");
  let possible = true;

  games.forEach((game) => {
    const cubeParts = game.split(", ");
    cubeParts.forEach((cubeShow) => {
      // red.
      if (cubeShow.endsWith("red")) {
        const compareValue = parseInt(cubeShow.replace(" red"));
        if (compareValue > cubeOptions.red) {
          possible = false;
        }
      }
      // green.
      if (cubeShow.endsWith("green")) {
        const compareValue = parseInt(cubeShow.replace(" green"));
        if (compareValue > cubeOptions.green) {
          possible = false;
        }
      }
      // blue.
      if (cubeShow.endsWith("blue")) {
        const compareValue = parseInt(cubeShow.replace(" blue"));
        if (compareValue > cubeOptions.blue) {
          possible = false;
        }
      }
    });
  });

  if (possible) {
    possibleGameIds.push(gameId);
  }
});

const partOneFinalSum = possibleGameIds.reduce(
  (acc, current) => acc + current,
  0
);
const pEnd = performance.now();

console.log(partOneFinalSum);
console.log(pEnd - pStart);
