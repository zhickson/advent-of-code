#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const input = String(fs.readFileSync(path.join(__dirname, "input.txt")));

const dirs = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const map = input.split("\n").map((line) => line.split(""));
let sum = 0;

for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
  for (let colIndex = 0; colIndex < map[rowIndex].length; colIndex++) {
    if (/[^\d^.]/.test(map[rowIndex][colIndex])) {
      console.log(map[rowIndex][colIndex]);

      for (let [adjacentRowIndex, adjacentColIndex] of dirs) {
        if (
          /\d/.test(
            map[rowIndex + adjacentRowIndex][colIndex + adjacentColIndex]
          )
        ) {
          const digits = [
            map[rowIndex + adjacentRowIndex][colIndex + adjacentColIndex],
          ];
          for (
            let adjacentColIndex2 = colIndex + adjacentColIndex - 1;
            adjacentColIndex2 >= 0;
            adjacentColIndex2--
          ) {
            if (
              /\d/.test(map[rowIndex + adjacentRowIndex][adjacentColIndex2])
            ) {
              digits.unshift(
                map[rowIndex + adjacentRowIndex][adjacentColIndex2]
              );
              map[rowIndex + adjacentRowIndex][adjacentColIndex2] = ".";
            } else {
              break;
            }
          }
          for (
            let adjacentColIndex2 = colIndex + adjacentColIndex + 1;
            adjacentColIndex2 < map[rowIndex + adjacentRowIndex].length;
            adjacentColIndex2++
          ) {
            if (
              /\d/.test(map[rowIndex + adjacentRowIndex][adjacentColIndex2])
            ) {
              digits.push(map[rowIndex + adjacentRowIndex][adjacentColIndex2]);
              map[rowIndex + adjacentRowIndex][adjacentColIndex2] = ".";
            } else {
              break;
            }
          }
          console.log(digits);
          sum += +digits.join("");
        }
      }
    }
  }
}
console.log(sum);
