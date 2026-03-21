const DEFAULT_RULES = [
  { divisor: 3, label: 'Fizz' },
  { divisor: 5, label: 'Buzz' }
];

/**
 * Computes the string representation of a number based on divisibility rules.
 *
 * - Appends the corresponding label for each rule where number % divisor === 0
 * - Returns the concatenated labels if any rule matches
 * - Otherwise returns the number as a string
 *
 * @param {number} number - The number to evaluate
 * @param {Array<{divisor: number, label: string}>} [rules=DEFAULT_RULES] - Optional set of rules
 * @returns {string} The computed value
 */
const getFizzBuzzValue = (number, rules = DEFAULT_RULES) => {
  const parts = [];

  for (const { divisor, label } of rules) {
    if (number % divisor === 0) {
      parts.push(label);
    }
  }

  return parts.length ? parts.join('') : String(number);
};

// Execute only if run directly (not during tests)
if (require.main === module) {
  const input = parseInt(process.argv[2], 10);

  if (Number.isNaN(input) || input <= 0) {
    console.log('Invalid input !');
    process.exit(1);
  }

  const results = [];
  for (let i = 1; i <= input; i++) {
    results.push(getFizzBuzzValue(i));
  }

  console.log(results.join('\n'));
}

module.exports = { getFizzBuzzValue };
