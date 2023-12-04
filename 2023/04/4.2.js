#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const input = String(fs.readFileSync(path.join(__dirname, "input.txt")))
  .trim()
  .split("\n");

let totalPoints = [];
let cardInstances = [];
let allCards = [];
let cardCopies = [];
input.forEach((card, cardIndex) => {
  const savedCard = saveCard(card, cardIndex);
  cardInstances.push(savedCard);
  //processCard(card, cardIndex);
});

// Loop through each card.
cardInstances.forEach((card, cardIndex) => {
  allCards.push(card);
  if (0 !== card.wins) {
    // If card has wins, make copies.
    deepCloneCard(card, allCards, cardInstances);
  }
});

function saveCard(card, cardIndex) {
  const [cardName, cardParts] = card.split(": ");
  const [winningNumbersPart, myNumbersPart] = cardParts.split(" | ");
  const winningNumbers = winningNumbersPart.split(" ");
  const myNumbers = myNumbersPart.split(" ").filter((item) => item !== ""); // trim out some empty items.

  return {
    id: cardIndex,
    name: cardName,
    wins: getWinsForCard(winningNumbers, myNumbers),
  };
}

function getWinsForCard(winningNumbers, myNumbers) {
  let matches = 0;
  for (let i = 0; i < myNumbers.length; i++) {
    if (winningNumbers.includes(myNumbers[i])) {
      matches++;
    }
  }
  return matches;
}

function deepCloneCard(card, allCards, cardInstances) {
  for (let i = 1; i <= card.wins; i++) {
    let copyCardIndex = card.id + i;
    allCards.push(cardInstances[copyCardIndex]);
    deepCloneCard(cardInstances[copyCardIndex], allCards, cardInstances);
  }
}

// Tally up card instances.
console.log(allCards.length);
