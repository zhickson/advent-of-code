#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const input = String(fs.readFileSync(path.join(__dirname, "example.txt")))
  .trim()
  .split("\n");

// Shortest solution...
// https://github.com/hyper-neutrino/advent-of-code/blob/main/2023/day04p2.py

const map = {};

for (let i = 0; i < input.length; i++) {
  if (!(i in map)) {
    map[i] = 1;
  }

  const nums = input[i].split(":")[1].trim();
  const [wins, ours] = nums.split(" | ").map((k) => k.split(" ").map(Number));
  const matches = ours.filter((q) => wins.includes(q)).length;

  for (let n = i + 1; n <= i + matches; n++) {
    map[n] = (map[n] || 1) + map[i];
  }
}

const sum = Object.values(map).reduce((acc, curr) => acc + curr, 0);
console.log(sum);
