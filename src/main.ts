import "./style.scss";

console.log("The application is running ...");

//Variables to use
const display = document.querySelector<HTMLInputElement>(
  ".calculator__display"
);
const buttons = document.querySelectorAll<HTMLButtonElement>("button");
let operation: string = "";

const operators: string[] = ["+", "-", "*", "/", "%"];

//Update Display
const updateDisplay = (): void => {
  if (!display) {
    throw new Error("Display error");
  }
  display.value = operation;
};
//clear operation
const clearOperation = (): void => {
  operation = "";
  updateDisplay();
};
//DEL
const removeLastDigit = (): void => {
  operation = operation.slice(0, -1);
  updateDisplay();
};

const addValue = (value: string): void => {
  operation += value;
};

const calculateOperation = (operation: string): number => {
  const splitOp: string[] = operation.split(/([-+*/])/);
  let result = parseFloat(splitOp[0]);

  for (let i: number = 0; i < splitOp.length; i += 2) {}

  return 0;
};

const evaluateOperation = (): void => {
  if (
    operation &&
    !operators.includes(operation.charAt(operation.length - 1)) // only lets you press "=" if last element is a number
  ) {
    const result: number = eval(operation); // CANNOT USE NEED TO CHANGE
    operation = result.toString();
    updateDisplay();
  }
};
//Add to operation / Display Output
const addToOperation = (value: string): void => {
  if (
    (Number(value) >= 0 && Number(value) <= 9) ||
    (value === "." && !operation.includes(".")) // Makes sure that you can only add one decimal point.
  ) {
    addValue(value);
  } else if (value === "AC") {
    clearOperation();
  } else if (value === "DEL") {
    removeLastDigit();
  } else if (
    operators.includes(value) &&
    !operators.includes(operation.slice(-1)) // this checks that you can only enter an operator , if it is preceeded by a number
  ) {
    addValue(value);
  } else {
    evaluateOperation();
  }
  updateDisplay();
};

//iterate through each button and add the CLICK capabilities.

buttons.forEach((button) => {
  button.addEventListener("click", () => addToOperation(button.innerText));
});
