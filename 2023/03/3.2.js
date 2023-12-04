#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const input = String(fs.readFileSync(path.join(__dirname, "input.txt")))
  .trim()
  .split("\n");

const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

let gearRatios = [];

// Run.
input.forEach((currentLine, index) => {
  const currentLineArray = Array.from(currentLine);

  let previousLineArray = [];
  let nextLineArray = [];
  if (input[index - 1]) {
    previousLineArray = Array.from(input[index - 1]);
  }
  if (input[index + 1]) {
    nextLineArray = Array.from(input[index + 1]);
  }

  const gears = currentLineArray.reduce((a, e, i) => {
    if (e === "*") a.push(i);
    return a;
  }, []);
  if (gears) {
    for (const gear of gears) {
      // Is gear adjacent to exactly two part numbers?
      const adjacentNumbers = matrixSearchForNumber(
        gear,
        currentLineArray,
        previousLineArray,
        nextLineArray
      );
      const uniqueNumbers = [...new Set(adjacentNumbers)];

      if (uniqueNumbers.length === 2) {
        // Do the maths.
        const gearRatio =
          parseInt(uniqueNumbers[0]) * parseInt(uniqueNumbers[1]);
        gearRatios.push(gearRatio);
        console.log(
          `Numbers: ${JSON.stringify(uniqueNumbers)}// Gear Ratio: ${gearRatio}`
        );
      }
    }
  }
});
const partTwoFinalSum = gearRatios.reduce((acc, current) => acc + current, 0);
console.log(partTwoFinalSum);

/**
 * Searches around a character for an adjacent number.
 *
 * @param {array} positions
 * @param {array} currentLineArray
 * @param {array} previousLineArray
 * @param {array} nextLineArray
 * @returns {Set}
 */
function matrixSearchForNumber(
  position,
  currentLineArray,
  previousLineArray,
  nextLineArray
) {
  // Do a 360 degree search on each position for a symbol.
  let numbers = [];

  // up left, up, up right, right, bottom right, bottom, bottom left, right
  // previous line checks.
  let positions = [position - 1, position, position + 1];
  if (previousLineArray.length > 0) {
    for (let i = 0; i < positions.length; i++) {
      let previousNumber = getNumberFromStringPosition(
        previousLineArray[positions[i]],
        positions[i],
        previousLineArray
      );
      if (previousNumber) {
        numbers.push(previousNumber);
        //break;
      }
    }
  }
  // current line checks.
  if (currentLineArray.length > 0) {
    for (let i = 0; i < positions.length; i++) {
      let currentNumber = getNumberFromStringPosition(
        currentLineArray[positions[i]],
        positions[i],
        currentLineArray
      );
      if (currentNumber) {
        numbers.push(currentNumber);
        //break;
      }
    }
  }
  // next line checks.
  if (nextLineArray.length > 0) {
    for (let i = 0; i < positions.length; i++) {
      let nextNumber = getNumberFromStringPosition(
        nextLineArray[positions[i]],
        positions[i],
        nextLineArray
      );
      if (nextNumber) {
        numbers.push(nextNumber);
        //break;
      }
    }
  }
  return numbers.filter(
    (number) => !number.includes("*") || !number.includes(".")
  );
}

/**
 * Calculate the number based on single character and position.
 *
 * Searches left and right to build the number.
 *
 * @param {string} digit       Current digit
 * @param {number} position    Current position in array
 * @param {array}  stringArray Array of characters
 * @returns {string}
 */
function getNumberFromStringPosition(digit, position, stringArray) {
  let number = digit;
  if (!digits.includes(number)) {
    return "";
  }

  // Get first character to LEFT of current digit.
  if (digits.includes(stringArray[position - 1])) {
    number = stringArray[position - 1] + number;

    // Get second character to LEFT of current digit.
    if (digits.includes(stringArray[position - 2])) {
      number = stringArray[position - 2] + number;
    }
  }

  // Get first character to RIGHT of current digit.
  if (digits.includes(stringArray[position + 1])) {
    number += stringArray[position + 1];
    // Get second character to RIGHT of current digit.
    if (digits.includes(stringArray[position + 2])) {
      number += stringArray[position + 2];
    }
  }
  return number;
}
