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

const precedence = (arg: string): number => {
  if (["*", "/"].includes(arg)) return 2;
  if (["+", "-"].includes(arg)) return 1;
  return 0;
};
const shuntingYardAlgorithm = (operation: string): string => {
  const stack = [];
  const queue = [];
  console.log(`The operation string is : ${operation}`);

  // Regular expression to split by numbers and operators.
  const regex = /(\d+|[+\-*\/%])/g;
  const tokens = operation.match(regex);
  //
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
      } else if (stack.length === 0) {
        stack.push(token);
      } else if (precedence(token) < precedence(stack[stack.length - 1])) {
        let itemToMove = stack.pop();
        queue.push(itemToMove);
        stack.push(token);
      }
    }
  }

  for (let i = stack.length - 1; i >= 0; i--) {
    queue.push(stack[i]);
  }

  console.log("the final expression is: " + queue);

  return queue.join("");
};

const postFixStackEvaluator = (operation: string): string => {
  const stack: string[] = [];
  for (let i: number = 0; i < operation.length; i++) {
    // at this point precedence doesn't matter . op[i] is either number or operator.

    if (!operators.includes(operation[i])) {
      stack.push(operation[i]);
    } else {
      if (stack.length < 2) {
        throw new Error("error");
      }
      let secondNum: string | undefined = stack.pop();
      let firstNum: string | undefined = stack.pop();
      const num1: number = Number(firstNum);
      const num2: number = Number(secondNum);
      if (operation[i] === "+") {
        stack.push((num1 + num2).toString());
      } else if (operation[i] === "-") {
        stack.push((num1 - num2).toString());
      } else if (operation[i] === "*") {
        stack.push((num1 * num2).toString());
      } else if (operation[i] === "/") {
        stack.push((num1 / num2).toString());
      }
    }
  }

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

  return Number(result);
};

const evaluateOperation = (): void => {
  if (
    operation &&
    !operators.includes(operation.charAt(operation.length - 1)) // only lets you press "=" if last element is a number
  ) {
    const result: number = calculateOperation(operation);
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
