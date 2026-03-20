const getFizzBuzzValue = (number) => {
  let output = '';

  if (number % 3 === 0) output += 'Fizz';
  if (number % 5 === 0) output += 'Buzz';

  return output || number;
}

// Execute only if run directly (not during tests)
if (require.main === module) {
  const input = parseInt(process.argv[2], 10);

  if (Number.isNaN(input)) {
    console.log('Invalid input !');
    return;
  }

  const maxNumber = input;

  for (let i = 1; i <= maxNumber; i++) {
    console.log(getFizzBuzzValue(i));
  }
}

module.exports = { getFizzBuzzValue };
