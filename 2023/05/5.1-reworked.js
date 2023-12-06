#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

// Reworked a much simpler solution based on other solutions online.

const input = String(fs.readFileSync(path.join(__dirname, "input.txt")));

let chunks = input.split("\n\n");

const seeds = chunks[0].split(": ")[1].trim().split(" ").map(Number);
chunks.shift();

const locations = [];
for (let seed of seeds) {
  // Process category map
  for (const map of chunks) {
    let lines = map.split("\n");
    lines.shift();

    // Process each range/line in the category
    for (const line of lines) {
      const [dest, source, len] = line.trim().split(" ").map(Number);
      if (seed >= source && seed < source + len) {
        // This maths is the key.
        seed = seed - source + dest;
        break;
      }
    }
  }
  locations.push(seed);
}

console.log(Math.min(...locations));
