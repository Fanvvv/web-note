import "./assets/css/index.css";
// import "./assets/css/index.less";

// function component() {
const component = () => {
  const element = document.createElement("div");

  element.innerHTML = ["Hello", "webpack"].join(" ");

  element.classList.add("content");

  return element;
}

document.body.appendChild(component());

// test polyfill
var a = new Promise();

console.log(a);
