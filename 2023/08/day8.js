#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
require("../utils");

const input = String(
  fs.readFileSync(path.join(__dirname, "input.txt"))
).trimEnd();

const instructions = input.split("\n")[0].trim().split("");

// Part 1
function part1(input) {
  let nodes = input.split("\n").filter((n) => n !== "");
  nodes.shift();

  // It's crazy how much more efficient a Map is than an Array.
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

// Part 2
function part2(input) {}

// Solve
part1(input);
// part2(input);
