#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

/**
 * Brute-force solution.
 *
 * This takes a looong time.
 *
 * Also tried worker threads, that's an alternate solution
 * to speed up brute force.
 */

const input = String(fs.readFileSync(path.join(__dirname, "input.txt")))
  .trim()
  .split("\n");

const seeds = input[0].split(": ")[1].trim().split(" ").map(Number);

// Build Maps.
console.log("Building maps...");
const seedToSoilMap = getMap(input, "seed-to-soil");
const soilToFertilizerMap = getMap(input, "soil-to-fertilizer");
const fertilizerToWaterMap = getMap(input, "fertilizer-to-water");
const waterToLightMap = getMap(input, "water-to-light");
const lightToTempMap = getMap(input, "light-to-temperature");
const tempToHumidityMap = getMap(input, "temperature-to-humidity");
const humidityToLocationMap = getMap(input, "humidity-to-location");

// Group Seeds for processing.
console.log("Pairing seeds...");
const finalSeedLocations = [];
const seedPairs = [];
for (var i = 0; i < seeds.length; i += 2) {
  seedPairs.push(seeds.slice(i, i + 2));
}

console.log("Extracting seed pairs...");
for (const [seedRangeStart, seedRangeLength] of seedPairs) {
  const seedRangeEnd = seedRangeStart + seedRangeLength - 1;

  // Set up a generator to incrementally generate the next seed.
  const seedGen = rangeIterator(seedRangeStart, seedRangeEnd);

  let processSeed = seedGen.next();
  while (!processSeed.done) {
    // process seed value here.
    finalSeedLocations.push(getSeedLocation(processSeed.value));
    processSeed = seedGen.next();
  }
}

const lowestLocation = Math.min(...finalSeedLocations);
console.log(lowestLocation);

function getSeedLocation(value) {
  console.log(`Processing Seed: ${value}`);
  const soil = convertFromMap(value, seedToSoilMap);
  const fertilizer = convertFromMap(soil, soilToFertilizerMap);
  const water = convertFromMap(fertilizer, fertilizerToWaterMap);
  const light = convertFromMap(water, waterToLightMap);
  const temp = convertFromMap(light, lightToTempMap);
  const humidity = convertFromMap(temp, tempToHumidityMap);
  const location = convertFromMap(humidity, humidityToLocationMap);
  console.log(`Completed Seed: ${value}`);
  console.log("============================");
  return location;
}

/**
 *
 * @param {number} rangeStart
 * @param {number} rangeEnd
 *
 * @yields {number}
 */
function* rangeIterator(rangeStart, rangeEnd) {
  let index = rangeStart;

  while (index <= rangeEnd) {
    yield index++;
  }
}

/**
 * Convert an input number into it's corresponding value from a map.
 *
 * @param {number} input Input number
 * @param {array} map Category map
 * @returns {number}
 */
function convertFromMap(input, map) {
  // Map contains key value pairs [ min, max ];
  // By default if we can't find a value in the ranges, then return the original input.
  let output = input;
  for (let x = 0; x < map.length; x++) {
    const [sourceRange, destinationRange] = map[x];
    // Check if the input number would sit between a source range.
    // const index = findIndexInRange(sourceRange[0], sourceRange[1], input);
    const index = guessIndex(sourceRange[0], sourceRange[1], input);
    if (index >= 0) {
      output = destinationRange[0] + index;
    }
  }
  return output;
}

/**
 * Returns a Map of values to search against.
 *
 * @param {array} input
 * @param {string} mapType
 * @returns {array}
 */
function getMap(input, mapType) {
  let matchableRanges = [];

  const lookup = mapType + " map:";

  // Find the title row index for this map.
  let titleRowIndex = 0;
  const mapTitle = input.filter((line, index) => {
    if (line === lookup) {
      titleRowIndex = index;
      return true;
    }
    return false;
  });

  // Get all ranges for this map based on the above index.
  let ranges = [];
  for (let i = titleRowIndex + 1; i < input.length; i++) {
    const line = input[i];
    if ("" === line) {
      break;
    }
    const [drs, srs, len] = line.trim().split(" ").map(Number);
    ranges.push([drs, srs, len]);
  }

  // We just need to build upper limit and lower limit.
  // Loop through the provided ranges.
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const sourceRange = [range[1], range[1] + range[2] - 1];
    const destinationRange = [range[0], range[0] + range[2] - 1];
    matchableRanges.push([sourceRange, destinationRange]);
  }

  return matchableRanges;
}

function guessIndex(start, end, target) {
  if (target > end || target < start) {
    return -1;
  }
  const index = target - start;

  return index;
}
