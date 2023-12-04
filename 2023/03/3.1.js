#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const input = String(fs.readFileSync(path.join(__dirname, "input.txt")))
  .trim()
  .split("\n");

const symbols = Array.from("~!@#$%^&*_-+=`|(){}[]:;<>,?/");

let storedNumbers = [];

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

  const regexp = /[0-9]{0,3}/g;
  const matches = currentLine.matchAll(regexp);

  for (const match of matches) {
    if ("" !== match[0]) {
      const number = match[0];
      const startPos = match.index;
      const endPos = match.index + match[0].length - 1;
      const midPos = match.index + match[0].length - 2;
      const positions = [startPos, midPos, endPos];

      // Does this number have adjacent symbols.
      const adjacentSymbol = matrixSearchForSymbol(
        positions,
        currentLineArray,
        previousLineArray,
        nextLineArray
      );

      if (adjacentSymbol) {
        storedNumbers.push(parseInt(number));
      }

      //   console.log(
      //     `Found ${match[0]} ${startPos}|${midPos}|${endPos} // Adjacent: ${adjacentSymbol}`
      //   );
    }
  }
});
const partOneFinalSum = storedNumbers.reduce(
  (acc, current) => acc + current,
  0
);
console.log(partOneFinalSum);

/**
 * Searches around a character for an adjacent symbol.
 *
 * @param {array} positions
 * @param {array} currentLineArray
 * @param {array} previousLineArray
 * @param {array} nextLineArray
 * @returns {boolean}
 */
function matrixSearchForSymbol(
  positions,
  currentLineArray,
  previousLineArray,
  nextLineArray
) {
  // Do a 360 degree search on each position for a symbol.
  let foundSymbol = false;
  for (let index = 0; index < positions.length; index++) {
    let position = positions[index];
    // up left, up, up right, right, bottom right, bottom, bottom left, right
    // previous line checks.
    if (previousLineArray.length > 0) {
      if (
        isSymbol(previousLineArray[position - 1]) ||
        isSymbol(previousLineArray[position]) ||
        isSymbol(previousLineArray[position + 1])
      ) {
        foundSymbol = true;
        break;
      }
    }
    // current line checks.
    if (currentLineArray.length > 0) {
      if (
        isSymbol(currentLineArray[position - 1]) ||
        isSymbol(currentLineArray[position]) ||
        isSymbol(currentLineArray[position + 1])
      ) {
        foundSymbol = true;
        break;
      }
    }
    // next line checks.
    if (nextLineArray.length > 0) {
      if (
        isSymbol(nextLineArray[position - 1]) ||
        isSymbol(nextLineArray[position]) ||
        isSymbol(nextLineArray[position + 1])
      ) {
        foundSymbol = true;
        break;
      }
    }
  }
  return foundSymbol;
}

/**
 * Extract symbols from a string, returning an object with both the
 * character itself as well as it's position in the string.
 *
 * @param {string} string String of characters
 * @returns {array}
 */
function getSymbolsFromString(string) {
  if (!string) {
    return [];
  }
  let symbolPositions = [];
  Array.from(string).forEach((char, index) => {
    if (isSymbol(char)) {
      let symbol = {
        char: char,
        pos: index,
      };
      symbolPositions.push(symbol);
    }
  });
  return symbolPositions;
}

/**
 * Is this character a symbol?
 *
 * @param {string} character
 * @returns {boolean}
 */
function isSymbol(character) {
  return symbols.includes(character);
}
