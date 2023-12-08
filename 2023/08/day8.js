#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const input = String(
  fs.readFileSync(path.join(__dirname, "input.txt"))
).trimEnd();

const instructions = input.split("\n")[0].trim().split("");

// Part 1 -- easy
function part1(input) {
  let nodes = input.split("\n").filter((n) => n !== "");
  nodes.shift();

  // It's crazy how much more efficient a Map is than an Array (for this method).
  const map = new Map();
  for (let node of nodes) {
    let [label, left, right] = node.match(/([A-Z])\w+/g);
    map.set(label, { i: label, l: left, r: right });
  }

  // Get first node.
  let currentNode = map.get("AAA");
  let moves = 0;
  let found = false;
  while (!found) {
    for (let dir of instructions) {
      moves++;
      if (dir === "R") {
        let goTo = currentNode.r;
        currentNode = map.get(goTo);
        if (currentNode.i === "ZZZ") {
          found = true;
          break;
        }
      }
      if (dir === "L") {
        let goTo = currentNode.l;
        currentNode = map.get(goTo);
        if (currentNode.i === "ZZZ") {
          found = true;
          break;
        }
      }
    }
  }

  console.log("Answer: " + moves);
}

// Part 2 -- harder cause we can't brute force it.
async function part2(input) {
  let nodes = input.split("\n").filter((n) => n !== "");
  nodes.shift();

  const map = {};
  const startingNodes = [];
  for (let node of nodes) {
    let [label, left, right] = node.match(/([A-Z0-9])\w+/g);
    map[label] = [left, right];
    if (label.endsWith("A")) {
      startingNodes.push(label);
    }
  }

  // Remap instructions to 0/1 for simpler conditionals.
  const dirs = instructions.map((i) => (i === "R" ? 1 : 0));

  // Maths.
  const gcd = (a, b) => (b == 0 ? a : gcd(b, a % b));
  const lcm = (a, b) => (a / gcd(a, b)) * b;

  // Solution by: https://github.com/fred-corp/
  // Uses LCM method for calculating the shortest path to all ending on **Z
  let finalSteps = [];

  // Proceses each starting point, and then calculates path length.
  startingNodes.forEach((node) => {
    let index = 0;
    let moves = 0;
    let currentNode = node;
    while (!currentNode.endsWith("Z")) {
      currentNode = map[currentNode][dirs[index]];
      index++;
      if (index >= dirs.length) {
        index = 0; // resets the index to restart directions
      }
      moves++;
    }
    finalSteps.push(moves);
  });

  console.log("Answer: " + finalSteps.reduce((a, b) => lcm(a, b), 1));
}

// Solve
part1(input);
part2(input);
