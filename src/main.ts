import "./style.scss";

console.log("The application is running ...");

// target the display
const display = document.querySelector<HTMLInputElement>("display");
const buttons = document.querySelectorAll<HTMLButtonElement>("button");
let operation = "";
