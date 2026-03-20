/**
 * Returns the FizzBuzz value for a given number.
 *
 * @param {number} number - The number to evaluate
 * @returns {string} - Fizz, Buzz, FizzBuzz, or the number as a string
 */
const getFizzBuzzValue = (number) => {
  let output = '';

  if (number % 3 === 0) output += 'Fizz';
  if (number % 5 === 0) output += 'Buzz';

  return output || String(number);
}

// Execute only if run directly (not during tests)
if (require.main === module) {
  const input = parseInt(process.argv[2], 10);

  if (Number.isNaN(input) || input <= 0) {
    console.log('Invalid input !');
    process.exit(1);
  }

  const maxNumber = input;

  for (let i = 1; i <= maxNumber; i++) {
    console.log(getFizzBuzzValue(i));
  }
}

module.exports = { getFizzBuzzValue };
