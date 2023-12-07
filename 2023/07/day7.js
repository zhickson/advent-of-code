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

// Part 1
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

// Part 2
function part2(input) {
  const hands = input.split("\n").map((hand) => hand.split(" "));

  let orderedHands = [];
  for (let [hand, bid] of hands) {
    let newHand = hand;
    if (hand.includes("J")) {
      // If hand contains a "J", then find the best possible hand.
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

// Solve
part1(input);
part2(input);

/**
 * Calculate the hand type based on the characters.
 *
 * Uses a bunch of if statements and a Set to help determine frequency of characters in a hand.
 *
 * @param {string} hand
 * @returns
 */
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

// Group hands by their strength.
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
 * Part 1 only.
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
 * easier to just create a new function for handling this for part 2
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
/**
 * Calculate the best hand when replacing J with some other character.
 *
 * Brute force approach -_-
 *
 * @param {string} hand
 * @param {array} availableCharacters
 * @returns
 */
function maximizeHandStrength(hand, availableCharacters) {
  function getHandStrength(hand) {
    // Return a numeric value representing the strength
    return getHandType(hand);
  }

  const originalStrength = getHandStrength(hand);

  // If hand is already max strength, no need to process.
  if (originalStrength === 7) {
    return hand;
  }

  // Loop through all combinations of J replacement and record strengths.
  let hands = [];
  for (let char of availableCharacters) {
    let newHand = hand.replaceAll("J", char);
    let newStrength = getHandStrength(newHand);
    if (newStrength > originalStrength) {
      hands.push([newStrength, newHand]);
    }
  }

  hands.sort((a, b) => b[0] - a[0]);

  // Would there be a case where there are multiple combos that return the same strength?
  const bestReplacement = hands.shift()[1];

  return bestReplacement;
}
