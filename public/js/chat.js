const socket = io();

const form = document.querySelector("#messageForm");
const display = document.querySelector("#display");

socket.on("newClient", (msg) => console.log(msg));

socket.on("newMessage", (msg) => {
  const h4 = document.createElement("h4");
  h4.innerText = msg;
  display.appendChild(h4);
});

form.addEventListener("submit", (event) => {
  input = event.target.elements.message;
  event.preventDefault();
  socket.emit("sendMessage", input.value);
  input.value = "";
});
// COUNT APP CODE
// const span = document.querySelector("#count");
// const btn = document
//   .querySelector("#increment")
//   .addEventListener("click", () => {
//     console.log("Clicked");
//     socket.emit("increment");
//   });

// socket.on("countUpdate", (count) => {
//   console.log("Count Updated: ", count);
//   span.innerText = `${count}`;
// });
