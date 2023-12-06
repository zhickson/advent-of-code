#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const input = String(
  fs.readFileSync(path.join(__dirname, "input.txt"))
).trimEnd();

function part1(input) {
  // games = game{ timeInMs, recordDistanceInMm}
  const games = getGames(input);

  const waysToWin = [];
  for (let game of games) {
    const result = getNumWinMethods(game);
    waysToWin.push(result);
  }
  const result = waysToWin.reduce((acc, cur) => acc * cur, 1);
  return result;
}

function part2(input) {
  let [times, distances] = input.split("\n");
  let time = times.split(":")[1].trim().replace(/ /g, "");
  let distance = distances.split(":")[1].trim().replace(/ /g, "");

  const result = playOneBigEpicGame(time, distance);
  console.log(result);
}

part2(input);
// console.log("Part 1:", part1(input));
//console.log("Part 2:", part2(input));

function getGames(input) {
  let [times, distances] = input
    .split("\n")
    .map((row) => row.match(/\d+/g).map(Number));

  const games = [];
  for (let i = 0; i < times.length; i++) {
    let game = {};
    game.time = times[i];
    game.record = distances[i];
    games.push(game);
  }
  return games;
}

// Determine how many ways of beating the record there are
function getNumWinMethods(game) {
  const time = new Array(game.time).fill(1);

  // for each milliscond in the game, play the game to determine if possible
  const possibleWins = [];
  for (let i = 0; i < game.time; i++) {
    const result = playGame(game, i);
    if (result > game.record) {
      possibleWins.push(result);
    }
  }
  return possibleWins.length;

  //   // 0 mm / sec
  //   let boatSpeed = 0;
  //   if (holdFor === 0) {
  //     return 0;
  //   }

  //   const timeHolding = Array.from({ length: holdFor }); // ms
  //   for (const ms of timeHolding) {
  //     // for each ms holding at beginning of race, speed increases by one mm/sec.
  //     boatSpeed++;
  //   }

  //   let distanceTravelled = 0;
  //   let availableTime = game.time - holdFor;
  //   distanceTravelled = availableTime * boatSpeed;

  //   return distanceTravelled;
}

function playGame(game, holdFor) {
  let boatSpeed = 0;
  if (holdFor === 0) {
    return 0;
  }

  const timeHolding = Array.from({ length: holdFor }); // ms
  for (const ms of timeHolding) {
    // for each ms holding at beginning of race, speed increases by one mm/sec.
    boatSpeed++;
  }

  let distanceTravelled = 0;
  let availableTime = game.time - holdFor;
  distanceTravelled = availableTime * boatSpeed;

  return distanceTravelled;
}

function playOneBigEpicGame(time, distance) {
  // we need to do the above "playGame" function on each option here, but without actually running it on each one.
  // range of possible hold values = 0 -> time (71530)
  // check each if they are larger than `distance`
  const rangeStart = 0;
  const rangeEnd = parseInt(time);

  let minWin = 0;
  let maxWin = 0;

  // Calculate minimum time for a win.
  for (let i = 0; i < rangeEnd; i++) {
    const distanceTravelled = calculateDistance(time, i);
    if (distanceTravelled > distance) {
      minWin = i;
      break;
    }
  }

  // Calculate maximum time for a win.
  for (let i = rangeEnd + 1; i >= rangeStart; i--) {
    const distanceTravelled = calculateDistance(time, i);
    if (distanceTravelled > distance) {
      maxWin = i;
      break;
    }
  }

  return Math.abs(minWin - maxWin) + 1;
}

function estimateStepsToLimit(startNumber, endNumber, limit) {
  // Assuming a linear relationship: nextNumber = currentNumber + step
  const step = endNumber - startNumber;

  // Calculate the number of steps needed to reach the limit
  const stepsToLimit = Math.ceil((limit - startNumber) / step);

  return stepsToLimit;
}

function calculateDistance(time, heldFor) {
  let availableTime = time - heldFor;
  let distanceTravelled = availableTime * heldFor;
  return distanceTravelled;
}
