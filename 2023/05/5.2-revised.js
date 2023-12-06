#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

// Really liked this solution, so tested it out here. NOT MY OWN CODE.
// See: https://github.com/leyanlo/advent-of-code/blob/main/2023/day-05.js

const input = String(
  fs.readFileSync(path.join(__dirname, "input.txt"))
).trimEnd();

const ps = performance.now();

// Split the input into seeds and maps.
let [seeds, ...maps] = input.split("\n\n");

// Process the seeds.
seeds = seeds.match(/\d+/g).map(Number);

// Build the seed ranges.
const seedRanges = [];
for (let i = 0; i < seeds.length; i += 2) {
  seedRanges.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
}
seeds = seedRanges;
console.log("Seed Range Start / End:", seeds);

// Loop through each map.
for (let map of maps) {
  map = map
    .split("\n")
    .slice(1)
    .map((line) => line.match(/\d+/g).map(Number));

  console.log("Map:", map);

  // Moved seeds are seeds that have passed through a map row as valid.
  const movedSeeds = [];

  // Loop through each map range.
  for (const [destination, source, length] of map) {
    const unmovedSeeds = [];
    console.log("Destination:", destination);
    console.log("Source:", source);
    console.log("Length:", length);

    for (const [start, end] of seeds) {
      console.log("-- Seed Range Start:", start);
      console.log("-- Seed Range End:", end);

      // Seed starting and end point is within the map source range.
      if (start < source + length && end >= source) {
        const newStart = Math.max(start, source) - source + destination;
        const newEnd =
          Math.min(end, source + length - 1) - source + destination;
        movedSeeds.push([newStart, newEnd]);
      }

      // Seed starting point is outside the map source range.
      if (start < source) {
        const newEnd = Math.min(end, source - 1);
        unmovedSeeds.push([start, newEnd]);
      }
      // Seed ending point is outside the map source range.
      if (end >= source + length) {
        const newStart = Math.max(start, source + length);
        unmovedSeeds.push([newStart, end]);
      }
    }
    // Replace the seeds with the unmoved seeds so we can process them on the next map row.
    console.log("Unmoved Seeds:", unmovedSeeds);
    seeds = unmovedSeeds;
  }
  seeds.push(...movedSeeds);
  console.log("Moved Seeds:", movedSeeds); // These seed values will move to the next map row.
}
console.log(seeds);
const result = Math.min(...seeds.flat());
console.log(result);
const pe = performance.now();

// console.log(pe - ps);
