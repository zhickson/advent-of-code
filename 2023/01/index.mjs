#!/usr/bin/env node
import * as fs from 'node:fs';
import * as readline from 'node:readline';

/**
 * @var {array} calibrationValues Array of calculated calibration values.
 */
let calibrationValues = [];

// Init our lineReader instance to read each line of file.
const lineReader = readline.createInterface({
	input: fs.createReadStream('input.txt')
});

// For each line emitted, calculate the calibration value.
lineReader.on('line', function (line) {
	let singleCalibrationValue = parseInt( calcSingleCalibrationValue(line) );
	calibrationValues.push(singleCalibrationValue);
	console.log(`Input: ${line} | Result: ${singleCalibrationValue}`)
});

// Once reading is complete, calculate the final sum of values.
lineReader.on('close', function () {
	// Refactored to test out the reduce method for calculating final sum.
	// Seen a few solutions online use this and was curious.
	let finalSum = calibrationValues.reduce(
		(accumulator, currentValue) => accumulator + currentValue
	,0);
	console.log( finalSum );
});


/**
 * Calculate the calibration value.
 *
 * On each line, the calibration value can be found by combining
 * the first digit and the last digit (in that order) to form a
 * single two-digit number.
 *
 * @param {string} line
 * @returns {string}
 */
function calcSingleCalibrationValue(line) {
	// Match each individual digit within the string.
	let digits = [];

	// Eesh, there's gotta be a more elegant way to do this -_-
	// We need to use lookahead regex, and then the map to allow us to handle
	// overlapping matches.
	let allPossibleNumbers = Array.from(
		// Had to google this regex :/
		line.matchAll(/(?=(one|two|three|four|five|six|seven|eight|nine))|[1-9]/g)
	).map((match) => '' === match[0] ? match[1] : match[0]);

	// Convert string numbers to digits.
	let convertedNumbers = allPossibleNumbers.map(function(value) {
		switch (value) {
			case 'one':
				return '1';
			case 'two':
				return '2';
			case 'three':
				return '3';
			case 'four':
				return '4';
			case 'five':
				return '5';
			case 'six':
				return '6';
			case 'seven':
				return '7';
			case 'eight':
				return '8';
			case 'nine':
				return '9';
			default:
				return value;
		}
	});

	convertedNumbers.forEach((value) => {
		digits.push(value);
	});

	// Get the first digit from the array.
	let firstDigit = digits[0];

	// Get the last digit from the array.
	let lastDigit = digits[digits.length - 1];

	// Return the two digits concatenated.
	return firstDigit + lastDigit;
}
