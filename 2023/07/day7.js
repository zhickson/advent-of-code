#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
require("../utils");

const input = String(
  fs.readFileSync(path.join(__dirname, "input.txt"))
).trimEnd();

const labels = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];
// const labels2 = [
//   "A",
//   "K",
//   "Q",
//   "T",
//   "9",
//   "8",
//   "7",
//   "6",
//   "5",
//   "4",
//   "3",
//   "2",
//   "J",
// ];
const labels2 = [
  "J",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
];

// Success.
function part1(input) {
  const hands = input.split("\n").map((hand) => hand.split(" "));

  let orderedHands = [];
  for (let [hand, bid] of hands) {
    const handType = getHandType(hand, 1);
    orderedHands.push([hand, bid, handType]);
  }

  // This initially orders by type, weakest to strongest.
  orderedHands = orderedHands.sort((a, b) => a[2] - b[2]);

  // Group hands into groups of the same kind.
  orderedHands = groupBy(orderedHands, 2)
    .map((group) => group.sort(compareTwoHands))
    .flat();

  // Calculate the winnings.
  const result = orderedHands
    .map((hand, rank) => parseInt(hand[1]) * (rank + 1))
    .reduce((a, c) => a + c);
  console.log("Part 1: " + result);
}

// Fail.
function part2(input) {
  const hands = input.split("\n").map((hand) => hand.split(" "));

  let orderedHands = [];
  for (let [hand, bid] of hands) {
    let newHand = hand;
    if (hand.includes("J")) {
      // For part 2, need to treat Js differently.
      // If there is a J anywhere in the string, mark the hand as needing to be recalculated.
      newHand = maximizeHandStrength(hand, labels2);
    }
    const handType = getHandType(newHand, 2);
    orderedHands.push([hand, bid, handType]);
  }

  // This initially orders by type, weakest to strongest.
  orderedHands = orderedHands.sort((a, b) => a[2] - b[2]);

  // Group hands into groups of the same kind.
  orderedHands = groupBy(orderedHands, 2)
    .map((group) => group.sort(compareTwoHandsPart2))
    .flat();

  // Calculate the winnings.
  const result = orderedHands
    .map((hand, rank) => parseInt(hand[1]) * (rank + 1))
    .reduce((a, c) => a + c);
  console.log("Part 2: " + result);
}

part1(input);
part2(input);

function getHandType(hand) {
  const chars = hand.split("");
  const charSet = new Set(chars);

  // All characters are the same, so Set size is 1.
  if (1 === charSet.size) {
    // Five of kind.
    return 7;
  }

  // All characters are unique, so Set size is 5.
  if (5 === charSet.size) {
    // High card.
    return 1;
  }

  if (isFourOfKind(chars, charSet)) {
    return 6;
  }

  if (isFullHouse(chars, charSet)) {
    return 5;
  }

  if (isThreeOfKind(chars, charSet)) {
    return 4;
  }

  if (isTwoPair(chars, charSet)) {
    return 3;
  }

  if (isOnePair(chars, charSet)) {
    return 2;
  }

  return -1;
}

// Four of a kind, where four cards have the same label and one card has a different label: AA8AA
function isFourOfKind(chars, charSet) {
  // Checks that charset size is = 2 (indicating two unique characters)
  // then checks that there are 4 identical characters that are the same in the array.
  return (
    charSet.size === 2 &&
    [...charSet].some((char) => chars.filter((c) => c === char).length === 4)
  );
}

function isFullHouse(chars, charSet) {
  // Checks that the charset size = 2 (indicating two unique characters
  // then checks that there are 3 characters the same.
  // since the set size is 2 we can assume the remaining two characters are identical.
  return (
    charSet.size === 2 &&
    [...charSet].some((char) => chars.filter((c) => c === char).length === 3)
  );
}

function isThreeOfKind(chars, charSet) {
  // Checks that the charset size = 3 (indicating three unique characters)
  // then checks that there are 3 characters the same.
  return (
    charSet.size === 3 &&
    [...charSet].some((char) => chars.filter((c) => c === char).length === 3)
  );
}

function isTwoPair(chars, charSet) {
  return (
    charSet.size === 3 &&
    [...charSet].some((char) => chars.filter((c) => c === char).length === 2)
  );
}

function isOnePair(chars, charSet) {
  return (
    charSet.size === 4 &&
    [...charSet].some((char) => chars.filter((c) => c === char).length === 2)
  );
}

// Group by the same type.
function groupBy(arr, key) {
  return arr
    .reduce(function (acc, cur) {
      (acc[cur[key]] = acc[cur[key]] || []).push(cur);
      return acc;
    }, [])
    .filter((n) => n); // cleans out empty items.
}

/**
 * Compare two hands that have the same type against each other to find
 * the stronger hand by card values;
 *
 * @param {array} handA
 * @param {array} handB
 * @returns
 */
function compareTwoHands(handA, handB) {
  const cardsA = handA[0].split("");

  const cardsB = handB[0].split("");

  let ret = 0; // by default they are the same.
  for (let i = 0; i < cardsA.length; i++) {
    // Compare each card in handA and handB
    const handACardStrength = labels.indexOf(cardsA[i]);
    const handBCardStrength = labels.indexOf(cardsB[i]);
    if (handACardStrength < handBCardStrength) {
      // Hand A card stronger.
      ret = 1;
      break;
    }
    if (handACardStrength > handBCardStrength) {
      // Hand B card stronger.
      ret = -1;
      break;
    }
  }
  return ret;
}

/**
 * Compare two hands that have the same type against each other to find
 * the stronger hand by card values;
 *
 * @param {array} handA
 * @param {array} handB
 * @returns
 */
function compareTwoHandsPart2(handA, handB) {
  const cardsA = handA[0].split("");

  const cardsB = handB[0].split("");

  let ret = 0; // by default they are the same.
  for (let i = 0; i < cardsA.length; i++) {
    // Compare each card in handA and handB
    const handACardStrength = labels2.indexOf(cardsA[i]);
    const handBCardStrength = labels2.indexOf(cardsB[i]);
    if (handACardStrength > handBCardStrength) {
      // Hand A card stronger.
      ret = 1;
      break;
    }
    if (handACardStrength < handBCardStrength) {
      // Hand B card stronger.
      ret = -1;
      break;
    }
  }
  return ret;
}

// Maximize hand strength logic.
function maximizeHandStrength(hand, availableCharacters) {
  function getHandStrength(hand) {
    // Return a numeric value representing the strength
    return getHandType(hand);
  }

  // However, we only want to apply this if there are more than two unique characters
  let checkChars = hand.split("");
  let checkCharSet = new Set(checkChars);

  // If there are exactly two unique characters, and one of them is J,
  // Always replace all instances of J with the other character,
  // as this would equal a five of a kind.
  if (checkCharSet.size == 2) {
    let [otherValue] = [...checkCharSet].filter((value) => value !== "J");
    return hand.replaceAll("J", otherValue);
  }

  // Identify the indices of 'J' characters
  const jIndices = [];
  for (let i = 0; i < hand.length; i++) {
    if (hand[i] === "J") {
      jIndices.push(i);
    }
  }

  // Initialize variables to keep track of the best replacement
  let bestReplacement = "A";
  let maxStrengthIncrease = 0;

  // Iterate over each available character to replace 'J'
  for (const replacement of availableCharacters) {
    // Calculate the impact on hand strength for each replacement
    const strengthIncrease = jIndices.reduce((totalIncrease, index) => {
      const originalHand = hand.split("");
      originalHand[index] = replacement;

      const originalStrength = getHandStrength(hand);
      const newStrength = getHandStrength(originalHand.join(""));

      return totalIncrease + (newStrength - originalStrength);
    }, 0);

    // Update the best replacement if it increases the overall strength
    if (strengthIncrease > maxStrengthIncrease) {
      bestReplacement = replacement;
      maxStrengthIncrease = strengthIncrease;
    }
  }

  // Apply the best replacement to maximize hand strength
  const modifiedHand = hand.split("");
  for (const index of jIndices) {
    modifiedHand[index] = bestReplacement;
  }

  return modifiedHand.join("");
}
