#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");

const input = String(fs.readFileSync(path.join(__dirname, "input.txt")))
  .trim()
  .split("\n");

const pStart = performance.now();

// Part Two.
let partTwoGamePowers = [];

const partTwo = input.map((gameLine) => {
  const gameRegex = Array.from(gameLine.matchAll(/(Game )(\d{1,100})/g));
  const gameId = parseInt(gameRegex[0][2]);
  const trimmedLine = gameLine.replace(gameRegex[0][0] + ": ", "");
  const games = trimmedLine.split("; ");

  let cubeMinimums = {
    red: 0,
    green: 0,
    blue: 0,
  };

  games.forEach((game) => {
    const cubeParts = game.split(", ");
    cubeParts.forEach((cubeShow) => {
      // red.
      if (cubeShow.endsWith("red")) {
        const compareValue = parseInt(cubeShow.replace(" red"));
        if (compareValue >= cubeMinimums.red) {
          cubeMinimums.red = compareValue;
        }
      }
      // green.
      if (cubeShow.endsWith("green")) {
        const compareValue = parseInt(cubeShow.replace(" green"));
        if (compareValue >= cubeMinimums.green) {
          cubeMinimums.green = compareValue;
        }
      }
      // blue.
      if (cubeShow.endsWith("blue")) {
        const compareValue = parseInt(cubeShow.replace(" blue"));
        if (compareValue >= cubeMinimums.blue) {
          cubeMinimums.blue = compareValue;
        }
      }
    });
  });

  const gamePower = cubeMinimums.red * cubeMinimums.green * cubeMinimums.blue;
  partTwoGamePowers.push(gamePower);
});

const partTwoFinalSum = partTwoGamePowers.reduce(
  (acc, current) => acc + current,
  0
);
const pEnd = performance.now();

console.log(partTwoFinalSum);
console.log(pEnd - pStart);
