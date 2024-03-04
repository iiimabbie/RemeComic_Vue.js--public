<script setup>
import httpClient from "@/main";
import {onMounted, ref} from "vue";
import FrontstageHeader from "@/components/frontstage/basic/FrontstageHeader.vue";

let socket = null;
const userList = ref([]);
const userId = ref(null);


// Fetch Data

onMounted(() => {
  test();
  loadAllUsername();
})

async function test() {
  const url = "/money/websocket/setFlag";

  try {
    const response = await httpClient.get(url);

    if (response.data.flag) {
      initializeWebSocket();
      console.log(localStorage.getItem("userName"))
    }

    console.log(response.data.flag);
  } catch (error) {
    console.log(error);
  }
}

function initializeWebSocket() {
  socket = new WebSocket("ws://localhost:8080/remecomic/money/chat");

  const messagesDiv = document.getElementById("messages");

  socket.onmessage = function (event) {

    if (messagesDiv) {
      const message = JSON.parse(event.data);

      console.log(message);
      if (!message.system) {
        messagesDiv.innerHTML += `<p><strong>${message["fromName"]}:</strong> ${message.message}</p>`;
      }

      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } else {
      console.error("Element with id 'messages' not found");
    }
  };

}

function sendMessage() {
  const recipient = document.getElementById("recipient").value;
  const message = document.getElementById("message").value;

  const data = {
    toName: recipient,
    message: message,
  };

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.error("WebSocket connected fail");
  }
}

async function loadAllUsername() {
  const url = "/user/simpleusers";

  try {
    const response = await httpClient.get(url);

    userList.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

</script>

<template>
  <!--  <Button @click="test">-->
  <!--    Test-->
  <!--  </Button>-->
  <FrontstageHeader/>

  <div class="color">
    <div class="form_dialogue">
      <div class="form_container">
        <form id="messageForm">

          <label for="recipient">Recipient:</label>
<!--          <input type="text" id="recipient" name="recipient" required class="form-control">-->
          <select v-model="userId" id="recipient" name="recipient" class="form-select">
            <option v-for="user in userList"
                    :key="user.userId"
                    :value="user.name">
              {{ user.name }}
            </option>
          </select>
          <br/>

          <label for="message">Message:</label>
          <input type="text" id="message" name="message" required class="form-control">

          <br/>

          <button type="button" @click="sendMessage"><span>Send Message</span></button>

        </form>
      </div>

      <br/>

      <div class="container">
        <div id="messages"></div>
      </div>

    </div>
  </div>


</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}

.color {
  width: 100%;
  height: 100vh;
  background-image: linear-gradient(-225deg, #2095ff 0%,
  #aa50ff 29%, #ff31aa 100%);
  z-index:0;
}

.form_dialogue {
}

label {
  font-size: 30px;
}

.form_container {
  height: auto;
  width: 300px;
  margin: auto;
}

.container {
  height: 450px;
  width: 300px;
  background-color: #edffdc;
}

button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background: #213310;
  font-family: "Montserrat", sans-serif;
  box-shadow: 0px 6px 24px 0px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: none;
}

button:after {
  content: " ";
  width: 0%;
  height: 100%;
  background: #50ffaa;
  position: absolute;
  transition: all 0.4s ease-in-out;
  right: 0;
}

button:hover::after {
  right: auto;
  left: 0;
  width: 100%;
}

button span {
  text-align: center;
  text-decoration: none;
  width: 100%;
  padding: 3px 5px;
  color: #fff;
  font-size: 1.125em;
  font-weight: 700;
  letter-spacing: 0.3em;
  z-index: 20;
  transition: all 0.3s ease-in-out;
}

button:hover span {
  color: #183153;
  animation: scaleUp 0.3s ease-in-out;
}

</style>