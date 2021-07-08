const socket = io();

const span = document.querySelector("#count");
const btn = document
  .querySelector("#increment")
  .addEventListener("click", () => {
    console.log("Clicked");
    socket.emit("increment");
  });

socket.on("countUpdate", (count) => {
  console.log("Count Updated: ", count);
  span.innerText = `${count}`;
});
