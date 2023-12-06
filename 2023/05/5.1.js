#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

// Original solution.

const input = String(fs.readFileSync(path.join(__dirname, "input.txt")))
  .trim()
  .split("\n");

const seeds = input[0].split(": ")[1].trim().split(" ").map(Number);

// Build Maps.
const seedToSoilMap = getMap(input, "seed-to-soil");
const soilToFertilizerMap = getMap(input, "soil-to-fertilizer");
const fertilizerToWaterMap = getMap(input, "fertilizer-to-water");
const waterToLightMap = getMap(input, "water-to-light");
const lightToTempMap = getMap(input, "light-to-temperature");
const tempToHumidityMap = getMap(input, "temperature-to-humidity");
const humidityToLocationMap = getMap(input, "humidity-to-location");

let seedTypes = [];
for (let i = 0; i < seeds.length; i++) {
  const seed = seeds[i];
  console.log(`Processing Seed: ${seed}`);
  const soil = convertFromMap(seed, seedToSoilMap);
  const fertilizer = convertFromMap(soil, soilToFertilizerMap);
  const water = convertFromMap(fertilizer, fertilizerToWaterMap);
  const light = convertFromMap(water, waterToLightMap);
  const temp = convertFromMap(light, lightToTempMap);
  const humidity = convertFromMap(temp, tempToHumidityMap);
  const location = convertFromMap(humidity, humidityToLocationMap);

  let types = {
    seed: seed,
    soil: soil,
    fertilizer: fertilizer,
    water: water,
    light: light,
    temp: temp,
    humidity: humidity,
    location: location,
  };
  seedTypes.push(types);
  console.log(`Saving Seed: ${seed}`);
}

const lowestLocation = Math.min(...seedTypes.map((type) => type.location));
// console.log(seedTypes);
console.log(lowestLocation);

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
    const index = findIndexInRange(sourceRange[0], sourceRange[1], input);
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

/**
 * Generate an array of N size starting at X
 *
 * @param {number} size Size of array to create
 * @param {number} startAt Number to start at
 * @returns {array}
 */
function rangeSize(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

/**
 * Create array from an existing set of numbers.
 *
 * Retains position of numbers.
 *
 * @param {number[]} existingSet Existing array of numbers
 * @param {number}   n           Upper limit of numbers to build array to
 * @returns {number[]}
 */
function createArrayWithExistingSet(existingSet, n) {
  const uniqueNumbers = new Set(existingSet);

  for (let i = 0; i < n; i++) {
    uniqueNumbers.add(i);
  }

  return Array.from(uniqueNumbers);
}

function between(x, min, max) {
  return x >= min && x <= max;
}

function fill(min, max) {
  let list = [];
  for (let i = min; i <= max; i++) {
    list.push(i);
  }
  return list;
}

function findIndexInRange(minValue, maxValue, targetValue) {
  for (let i = minValue; i <= maxValue; i++) {
    if (i === targetValue) {
      return i - minValue; // Return the index relative to the minimum value
    }
  }
  return -1; // Return -1 if the value is not found in the specified range
}
