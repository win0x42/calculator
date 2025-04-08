'use strict';

document.addEventListener('contextmenu', e => e.preventDefault());

const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = calculator.querySelector('.calculator__display');

let firstValue = '';
let operator = '';
let secondValue = '';

keys.addEventListener('click', e => {
  const target = e.target;
  if (!target.matches('button')) return;

  const action = target.dataset.action;
  const keyContent = target.textContent;
  const displayedNum = display.textContent;
  const previousKeyType = calculator.dataset.previousKeyType;

  if (!action) handleNumber(keyContent, displayedNum, previousKeyType);
  else if (action === 'decimal') handleDecimal(displayedNum, previousKeyType);
  else if (action === 'clear') handleClear();
  else if (['add', 'subtract', 'multiply', 'divide'].includes(action))
    handleOperator(action, displayedNum, previousKeyType);
  else if (action === 'calculate')
    handleCalculate(displayedNum, previousKeyType);

  display.textContent =
    display.textContent.length > 10
      ? display.textContent.slice(0, 16)
      : display.textContent;
  display.classList.toggle('small-text', display.textContent.length > 10);
});

function handleNumber(keyContent, displayedNum, previousKeyType) {
  display.textContent =
    displayedNum === '0' || ['operator', 'calculate'].includes(previousKeyType)
      ? keyContent
      : displayedNum + keyContent;
  calculator.dataset.previousKeyType = 'number';
}

function handleDecimal(displayedNum, previousKeyType) {
  if (!displayedNum.includes('.')) {
    display.textContent = displayedNum + '.';
  } else if (['operator', 'calculate'].includes(previousKeyType)) {
    display.textContent = '0.';
  }
  calculator.dataset.previousKeyType = 'decimal';
}

function handleClear() {
  firstValue = '';
  operator = '';
  secondValue = '';
  display.textContent = '0';
  calculator.dataset.previousKeyType = 'clear';
}

function handleOperator(action, displayedNum, previousKeyType) {
  if (
    firstValue &&
    operator &&
    !['operator', 'calculate'].includes(previousKeyType)
  ) {
    secondValue = displayedNum;
    display.textContent = calculate(firstValue, operator, secondValue);
    firstValue = display.textContent;
  } else {
    firstValue = displayedNum;
  }
  operator = action;
  calculator.dataset.previousKeyType = 'operator';
}

function handleCalculate(displayedNum, previousKeyType) {
  if (firstValue) {
    if (previousKeyType === 'calculate') firstValue = display.textContent;
    secondValue = displayedNum;
    display.textContent = calculate(firstValue, operator, secondValue);
    firstValue = display.textContent;
  } else {
    display.textContent = '0';
  }
  calculator.dataset.previousKeyType = 'calculate';
}

function calculate(n1, operator, n2) {
  const a = parseFloat(n1),
    b = parseFloat(n2);
  return operator === 'add'
    ? a + b
    : operator === 'subtract'
    ? a - b
    : operator === 'multiply'
    ? a * b
    : operator === 'divide'
    ? a / b
    : '';
}
