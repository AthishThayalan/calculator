import "./style.scss";

console.log("The application is running ...");

//Variables to use
const display = document.querySelector<HTMLInputElement>(
  ".calculator__display"
);
const buttons = document.querySelectorAll<HTMLButtonElement>("button");
let operation: string = "";

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
//Add to operation / Display Output
const addToOperation = (value: string): void => {
  if (
    (Number(value) >= 0 && Number(value) <= 9) ||
    (value === "." && !operation.includes(".")) // Makes sure that you can only add one decimal point.
  ) {
    operation += value;
    console.log(operation);
  } else if (value === "AC") {
    clearOperation();
  } else if (value === "DEL") {
    removeLastDigit();
  }

  updateDisplay();
};

//iterate through each button and add the CLICK capabilities.

buttons.forEach((button) => {
  button.addEventListener("click", () => addToOperation(button.innerText));
});
