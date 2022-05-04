import consumer from "./consumer";

document.addEventListener("turbolinks:load", function () {
  let userClient = consumer.subscriptions.create("UserChannel", {
    connected() {
      // Called when the subscription is ready for use on the server
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      // Called when there's incoming data on the websocket for this channel'
      console.log(data);

      if (data.action == "new_message") addMessage(data);

      if (data.action == "login") addUser(data);

      if (data.action == "ping") addPing(data);

      if (data.action == "logout") removeUser(data);
    },
  });

  function addPing(data) {
    let html = `<p>El usuario ${data.user_id} te envió un ping</p>`;

    document.querySelector("#chats").innerHTML = html + document.querySelector("#chats").innerHTML;
  }

  function removeUser(data) {
    document.querySelector("#user-" + data.user_id).remove();
  }

  function addUser(data) {
    //Creo un li como contenedor del span y le button: <li><span></span> <button></button></li>
    let container = document.createElement("li");
    container.id = "user-" + data.user_id;
    
    //Creo un button para enviar ping a ese usuario
    let button = document.createElement("button");
    button.innerHTML = "Ping";

    button.addEventListener("click", function(ev) {
      console.log("Hola mundo....");
      userClient.send({
        type: "ping",
        user_id: data.user_id
      })
    })

    //Creo un span para mostrar el id del usuario que se conecto
    let span = document.createElement("span");
    span.innerHTML = data.user_id;

    container.appendChild(span).appendChild(button);

    document.querySelector("#pings").prepend(container);
  }

  function addMessage(data) {
    let html = `
        <p><strong>${data.email}:</strong> ${data.message}</p>
      `;

    document.querySelector("#chats").innerHTML = html + document.querySelector("#chats").innerHTML;
  }

  document
    .querySelector("#chat-form")
    .addEventListener("submit", function (ev) {
      ev.preventDefault();

      let message = this.querySelector("[type='text']").value;
      this.querySelector("[type='text']").value = '';

      console.log(message);

      userClient.send({
        message,
      });

      return false;
    });
});
