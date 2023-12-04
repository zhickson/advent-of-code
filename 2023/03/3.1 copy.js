#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");

const input = String(fs.readFileSync(path.join(__dirname, "example.txt")))
  .trim()
  .split("\n");

const pStart = performance.now();

// Get all number matches via regex.
// OR parse 3 lines at a time.

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const symbols = Array.from("~!@#$%^&*_-+=`|(){}[]:;<>,?/");

const getDigitPositionsFromString = (string) => {
  if (!string) {
    return [];
  }
  let digitPositions = [];
  Array.from(string).forEach((char, index) => {
    if (digits.includes(char)) {
      digitPositions.push(index);
    }
  });
  return digitPositions;
};

/**
 *
 * @param {array} array
 * @param {string} currentLine
 * @returns
 */
const getDigitPositionsFromRegex = (array, currentLine) => {
  if (!array) {
    return [];
  }

  let digitPositions = [];
  array[0].forEach((result) => {
    console.log(result);
    if ("" !== result || undefined !== result) {
      //digitPositions.push(currentLine.indexOf(result[0]));
      console.log(result);
      console.log(currentLine.indexOf(result));
    }
  });
};

/**
 *
 * @param {string} character
 * @returns
 */
const isSymbol = (character) => {
  return symbols.includes(character);
};

input.forEach((currentLine, index) => {
  // Get the position of of the digits.
  const digitMatches = Array.from(currentLine.matchAll(/[0-9]{0,3}/g));
  //console.log(digitMatches);
  console.log(getDigitPositionsFromRegex(digitMatches, currentLine));
  //   const currentLineArray = Array.from(currentLine);
  //   const digitPositions = getDigitPositionsFromString(currentLine);
  //   const previousLinePositions = getDigitPositionsFromString(input[index - 1]);
  //   const nextLinePositions = getDigitPositionsFromString(input[index + 1]);
  //   console.log(nextLinePositions);
  //   // Then for each "position", check if it is adjacent to a symbol
  //   digitPositions.forEach((position) => {
  //     // A symbol can be at position + 1 or -1.
  //     console.log(currentLineArray[position]);
  //     const symbolDirectlyAdjacent =
  //       isSymbol(currentLineArray[position - 1]) ||
  //       isSymbol(currentLineArray[position + 1]);
  //     console.log(`Symbol Directly Adjacent: ${symbolDirectlyAdjacent}`);

  //     // A symbol can be at previous line same, + 1 or - 1
  //   });
});
