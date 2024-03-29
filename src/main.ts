import "./style.scss";
import confetti from "canvas-confetti";

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
  const stack = [];
  const queue = [];

  const regex = /(\d+(\.\d+)?|[+\-*^\/%])/g;
  const tokens = operation.match(regex);

  if (!tokens) {
    throw new Error("Invalid operation string");
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
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
  return queue as string[];
};

const postFixStackEvaluator = (operation: string[]): string => {
  const stack: string[] = [];
  for (let i: number = 0; i < operation.length; i++) {
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
  return stack[0];
};

const calculateOperation = (operation: string): number => {
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
      ".dark-mode-switch__toggle-handle"
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
