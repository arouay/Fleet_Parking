const { spawnSync } = require('child_process');
const path = require('path');

const fizzbuzzPath = path.resolve(__dirname, './fizzbuzz.js');

describe('FizzBuzz CLI Integration Tests', () => {
  test('should output correct sequence up to 15', () => {
    const result = spawnSync('node', [fizzbuzzPath, '15'], { encoding: 'utf-8' });

    const expectedOutput = [
      '1', '2', 'Fizz', '4', 'Buzz',
      'Fizz', '7', '8', 'Fizz', 'Buzz',
      '11', 'Fizz', '13', '14', 'FizzBuzz'
    ].join('\n');

    expect(result.stdout.trim()).toBe(expectedOutput);
    expect(result.status).toBe(0);
  });

  test('should output correct sequence up to 5', () => {
    const result = spawnSync('node', [fizzbuzzPath, '5'], { encoding: 'utf-8' });

    expect(result.stdout.trim()).toBe('1\n2\nFizz\n4\nBuzz');
    expect(result.status).toBe(0);
  });

  test('should fail for zero input', () => {
    const result = spawnSync('node', [fizzbuzzPath, '0'], { encoding: 'utf-8' });

    expect(result.stdout.trim()).toBe('Invalid input !');
    expect(result.status).toBe(1);
  });

  test('should fail for negative input', () => {
    const result = spawnSync('node', [fizzbuzzPath, '-10'], { encoding: 'utf-8' });

    expect(result.stdout.trim()).toBe('Invalid input !');
    expect(result.status).toBe(1);
  });

  test('should fail for non-numeric input', () => {
    const result = spawnSync('node', [fizzbuzzPath, 'abc'], { encoding: 'utf-8' });

    expect(result.stdout.trim()).toBe('Invalid input !');
    expect(result.status).toBe(1);
  });
});
