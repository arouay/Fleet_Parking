const input = parseInt(process.argv[2], 10);
const n = Number.isNaN(input) ? 100 : input;

for (let i = 1; i <= n; i++) {
  let output = '';

  if (i % 3 === 0) output += 'Fizz';
  if (i % 5 === 0) output += 'Buzz';

  console.log(output || i);
}
