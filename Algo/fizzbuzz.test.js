const { getFizzBuzzValue } = require('./fizzbuzz');

describe('FizzBuzz Logic', () => {
  test('returns number as string when not divisible by 3 or 5', () => {
    expect(getFizzBuzzValue(1)).toBe('1');
    expect(getFizzBuzzValue(2)).toBe('2');
    expect(getFizzBuzzValue(-2)).toBe('-2');
    expect(getFizzBuzzValue(2.2)).toBe('2.2');
    expect(getFizzBuzzValue(5.1)).toBe('5.1');
  });

  test('returns Fizz for multiples of 3', () => {
    expect(getFizzBuzzValue(3)).toBe('Fizz');
    expect(getFizzBuzzValue(6)).toBe('Fizz');
    expect(getFizzBuzzValue(-6)).toBe('Fizz');
  });

  test('returns Buzz for multiples of 5', () => {
    expect(getFizzBuzzValue(5)).toBe('Buzz');
    expect(getFizzBuzzValue(10)).toBe('Buzz');
    expect(getFizzBuzzValue(-10)).toBe('Buzz');
  });

  test('returns FizzBuzz for multiples of 3 and 5', () => {
    expect(getFizzBuzzValue(0)).toBe('FizzBuzz');
    expect(getFizzBuzzValue(15)).toBe('FizzBuzz');
    expect(getFizzBuzzValue(-15)).toBe('FizzBuzz');
    expect(getFizzBuzzValue(30)).toBe('FizzBuzz');
  });
});