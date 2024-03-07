import "./style.scss";

// target the display
const display = document.getElementById("display");

//Add numbers to display
const append = (value: string): void => {
  console.log("append");
  display.value += value;
  console.log(`Added ${value}`);
};
