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
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// OPTIONS

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(
  Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  })
);

// FUNCTIONS
const autoscroll = () => {
  const $newMessage = $messages.lastElementChild;

  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = $messages.offsetHeight;

  const containerHeight = $messages.scrollHeight;

  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

// LISTENERS

socket.on("message", ({ username, text, createdAt }) => {
  const html = Mustache.render(messageTemplate, {
    username,
    message: text,
    createdAt: moment(createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("location", ({ username, address, link, createdAt }) => {
  const html = Mustache.render(locationTemplate, {
    username,
    address,
    link,
    createdAt: moment(createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
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

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
