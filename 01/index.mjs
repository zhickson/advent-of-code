#!/usr/bin/env node
import * as events from 'node:events';
import * as fs from 'node:fs';
import * as readline from 'node:readline';

/**
 * @var {array} calibrationValues Array of calculated calibration values.
 */
let calibrationValues = [];

// Init our lineReader instance to read each line of file.
const lineReader = readline.createInterface({
	input: fs.createReadStream('/Users/zhickson/dev/aoc-2023/01/input.txt')
});

// For each line emitted, calculate the calibration value.
lineReader.on('line', function (line) {
	let singleCalibrationValue = parseInt( calcSingleCalibrationValue(line) );
	calibrationValues.push(singleCalibrationValue);
	console.log(`Input: ${line} | Result: ${singleCalibrationValue}`)
});

// Once reading is complete, calculate the final sum of values.
lineReader.on('close', function () {
	let finalSum = 0;
	calibrationValues.forEach((val) => {
		finalSum += val;
	});
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
 */
function calcSingleCalibrationValue(line) {
	// Match each individual digit within the string.
	let digits = line.match(/\d/g);

	// Get the first digit from the array.
	let firstDigit = digits[0];

	// Get the last digit from the array.
	let lastDigit = digits[digits.length - 1];

	// Return the sum.
	return firstDigit + lastDigit;
}
