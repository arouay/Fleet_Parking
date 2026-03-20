const { getFizzBuzzValue } = require('./fizzbuzz');

describe('FizzBuzz', () => {
  test('should return number if not divisible by 3 or 5', () => {
    expect(getFizzBuzzValue(1)).toBe(1);
    expect(getFizzBuzzValue(2)).toBe(2);
  });

  test('should return Fizz if divisible by 3', () => {
    expect(getFizzBuzzValue(3)).toBe('Fizz');
    expect(getFizzBuzzValue(6)).toBe('Fizz');
  });

  test('should return Buzz if divisible by 5', () => {
    expect(getFizzBuzzValue(5)).toBe('Buzz');
    expect(getFizzBuzzValue(10)).toBe('Buzz');
  });

  test('should return FizzBuzz if divisible by 3 and 5', () => {
    expect(getFizzBuzzValue(15)).toBe('FizzBuzz');
    expect(getFizzBuzzValue(30)).toBe('FizzBuzz');
  });
});
