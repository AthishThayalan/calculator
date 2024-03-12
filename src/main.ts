import "./style.scss";
import confetti from "canvas-confetti";

console.log("The application is running ...");

const display = document.querySelector<HTMLInputElement>(
  ".calculator__display"
);
const calculator = document.querySelector<HTMLDivElement>(".calculator");
const buttons = document.querySelectorAll<HTMLButtonElement>("button");
const darkModeSwitch =
  document.querySelector<HTMLDivElement>(".dark-mode-switch");
let operation: string = "";

const operators: string[] = ["+", "-", "*", "/", "^", "%"];

if (!calculator || !display) {
  throw new Error("Error.");
}

const updateDisplay = (): void => {
  if (!display) {
    throw new Error("Display error");
  }
  display.value = operation;
};

const clearOperation = (): void => {
  operation = "";
  updateDisplay();
};

const removeLastDigit = (): void => {
  operation = operation.slice(0, -1);
  updateDisplay();
};

const addValue = (value: string): void => {
  operation += value;
};

const precedence = (arg: string): number => {
  if (arg === "^") return 3;
  if (["*", "/"].includes(arg)) return 2;
  if (["+", "-"].includes(arg)) return 1;
  return 0;
};
const shuntingYardAlgorithm = (operation: string): string[] => {
  console.log("STARTING OPERATION : " + operation);
  const stack = [];
  const queue = [];

  const regex = /(\d+(\.\d+)?|[+\-*^\/%])/g;
  const tokens = operation.match(regex);

  console.log("Reg expression thats been split : " + tokens);
  if (!tokens) {
    throw new Error("Invalid operation string");
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    console.log(`Shunting Yard Algorithm Iteration ${i} : ${queue}`);
    if (!operators.includes(token)) {
      queue.push(token);
    } else {
      if (
        precedence(token) > precedence(stack[stack.length - 1]) &&
        stack.length !== 0
      ) {
        stack.push(token);
      } else if (
        stack.length === 0 ||
        precedence(token) === precedence(stack[stack.length - 1])
      ) {
        stack.push(token);
      } else if (precedence(token) < precedence(stack[stack.length - 1])) {
        while (stack.length > 0) {
          let itemToMove = stack.pop();
          queue.push(itemToMove);
        }
        stack.push(token);
      }
    }
  }

  for (let i = stack.length - 1; i >= 0; i--) {
    queue.push(stack[i]);
  }

  if (!queue) {
    throw new Error("Error occured");
  }
  console.log("FINAL SHUNTING EXPRESSION: " + queue);
  return queue as string[];
};

const postFixStackEvaluator = (operation: string[]): string => {
  const stack: string[] = [];
  console.log("Starting post fix: " + operation);
  for (let i: number = 0; i < operation.length; i++) {
    console.log("post fix stack iteration " + i + ": " + stack);
    const token = operation[i];
    if (!operators.includes(token)) {
      stack.push(token);
    } else {
      if (stack.length < 2) {
        throw new Error("error");
      }
      let secondNum: string | undefined = stack.pop();
      let firstNum: string | undefined = stack.pop();
      const num1: number = Number(firstNum);
      const num2: number = Number(secondNum);
      if (token === "+") {
        stack.push((num1 + num2).toString());
      } else if (token === "-") {
        stack.push((num1 - num2).toString());
      } else if (token === "*") {
        stack.push((num1 * num2).toString());
      } else if (token === "/") {
        stack.push((num1 / num2).toString());
      } else if (token === "^") {
        stack.push((num1 ** num2).toString());
      }
    }
  }
  console.log("FINAL POST FIX STACK: " + stack);

  return stack[0];
};

const calculateOperation = (operation: string): number => {
  // const splitOp: string[] = operation.split(/([-+*/])/);
  // let result = Number(splitOp[0]);

  // // Issue is these
  // for (let i: number = 1; i < splitOp.length; i += 2) {
  //   // we want to loop through all operators to know what to do with previous result and the next digit.
  //   const operator = splitOp[i]; // so this is the current operator
  //   const nextNum = Number(splitOp[i + 1]); // so this is the number after the operator
  //   console.log(nextNum);

  // if (operator === "+") {
  //   result += nextNum;
  // } else if (operator === "-") {
  //   result -= nextNum;
  // } else if (operator === "*") {
  //   result *= nextNum;
  // } else if (operator === "/") {
  //   result /= nextNum;
  // }
  // }
  const result = postFixStackEvaluator(shuntingYardAlgorithm(operation));
  confetti({
    particleCount: 500,
    spread: 10000,
  });

  return Number(result);
};

const evaluateOperation = (): void => {
  if (
    operation &&
    !operators.includes(operation.charAt(operation.length - 1))
  ) {
    const result: number = calculateOperation(operation);
    operation = result.toString();
    updateDisplay();
  }
};

const addToOperation = (value: string): void => {
  if ((Number(value) >= 0 && Number(value) <= 9) || value === ".") {
    addValue(value);
  } else if (value === "AC") {
    clearOperation();
  } else if (value === "DEL") {
    removeLastDigit();
  } else if (
    operators.includes(value) &&
    !operators.includes(operation.slice(-1))
  ) {
    addValue(value);
  } else {
    evaluateOperation();
  }
  updateDisplay();
};

buttons.forEach((button) => {
  button.addEventListener("click", () => addToOperation(button.innerText));
});

if (darkModeSwitch) {
  darkModeSwitch.addEventListener("click", function () {
    this.classList.toggle("active");
    const toggleHandle = document.querySelector(
      ".toggle-handle"
    ) as HTMLElement;
    if (toggleHandle) {
      toggleHandle.style.transform = this.classList.contains("active")
        ? "translateX(20px)"
        : "translateX(0)";
    }
    const isDarkModeActive = darkModeSwitch.classList.contains("active");
    document.body.style.backgroundColor = isDarkModeActive ? "beige" : "";
    calculator.style.backgroundColor = isDarkModeActive
      ? `rgb(45, 42, 42)`
      : "";
    buttons.forEach((button) => {
      button.style.backgroundColor = isDarkModeActive ? "rgb(55, 52, 52)" : "";
      button.style.color = isDarkModeActive ? "beige" : "";
    });
    display.style.backgroundColor = isDarkModeActive ? `rgb(45, 42, 42)` : "";
    display.style.color = isDarkModeActive ? "beige" : "";
  });
}
