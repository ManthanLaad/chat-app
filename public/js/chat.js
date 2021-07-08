const socket = io();

// ELEMENTS

const $form = document.querySelector("#message-form");
const $sendLocation = document.querySelector("#send-location");
const $display = document.querySelector("#display");
const $sendMessage = document.querySelector("#send-message");
const $messages = document.querySelector("#messages");

// TEMPLATES
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

// LISTENERS

socket.on("message", ({ text, createdAt }) => {
  const html = Mustache.render(messageTemplate, {
    message: text,
    createdAt: moment(createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("location", ({ address, link, createdAt }) => {
  const html = Mustache.render(locationTemplate, {
    address,
    link,
    createdAt: moment(createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$form.addEventListener("submit", (event) => {
  event.preventDefault();

  $sendMessage.setAttribute("disabled", "disabled");

  input = event.target.elements.message;
  socket.emit("sendMessage", input.value, (error) => {
    $sendMessage.removeAttribute("disabled");
    input.value = "";
    input.focus();
    if (error) {
      return console.log(error);
    }
    console.log("Message Delivered");
  });
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
