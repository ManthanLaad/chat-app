const socket = io();

const $form = document.querySelector("#message-form");
const $sendLocation = document.querySelector("#send-location");
const $display = document.querySelector("#display");
const $sendMessage = document.querySelector("#send-message");

socket.on("message", (msg, link) => Display(msg, true, link));

socket.on("newMessage", (msg) => Display(msg));

$form.addEventListener("submit", (event) => {
  event.preventDefault();

  $sendMessage.setAttribute("disabled", "disabled");

  input = event.target.elements.message;
  socket.emit("sendMessage", input.value, (error) => {
    $sendMessage.removeAttribute("disabled");
    if (error) {
      return console.log(error);
    }
    console.log("Message Delivered");
  });
  input.value = "";
  input.focus();
});

$sendLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  $sendLocation.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }) => {
      socket.emit("sendLocation", { latitude, longitude }, () => {
        $sendLocation.removeAttribute("disabled");
        console.log("Location Shared Successfully");
      });
    }
  );
});

function Display(msg, bold = false, link = "") {
  const h4 = document.createElement("div");
  if (link) {
    const a = document.createElement("a");
    a.setAttribute("href", link);
    a.setAttribute("target", "_blank");
    a.innerText = msg;
    h4.appendChild(a);
  } else {
    if (bold) {
      h4.style.fontStyle = "italic";
    }
    h4.innerText = msg;
  }
  $display.appendChild(h4);
}
