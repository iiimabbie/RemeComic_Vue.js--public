<template>
    <div class="gSignInWrapper" v-if="isLogin" :key="isLogin">
        <span class="label">Signin or Register with:</span>
        <div class="customBtn customGPlusSignIn" @click="handleLoginLogout">
            <span class="buttonText">Google</span>
        </div>
    </div>
    <div class="gSignInWrapper" v-if="!isLogin" :key="isLogin">
        <div class="customBtn customGPlusSignIn" @click="handleLoginLogout">
            <span class="buttonText">LOG OUT</span>
        </div>
    </div>
</template>
<script setup>
import httpClient from "@/main.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Swal from "sweetalert2";
import { useCounterStore } from "@/stores/counter";
import { ref, onMounted } from "vue";

const userId = ref(parseInt(localStorage.getItem("userId")));
const counterStore = useCounterStore();
const isLogin = ref();

onMounted(() => {
    console.log("buttonText", userId.value);
    if (userId.value) {
        isLogin.value = false;
        console.log(isLogin.value);
    } else {
        isLogin.value = true;
    }
});

const handleLoginLogout = () => {
    let htmlForSwal = "";
    httpClient
        .get("/userA/checkCookie")
        .then((res) => {
            const titleForSwal = "Are you sure you want to Logout ?";
            const htmlForSwal = `<div><img src="https://firebasestorage.googleapis.com/v0/b/remecomic-3e86b.appspot.com/o/de4c3be16755768369816b3b9d25da0366.gif?alt=media&token=d810aee5-f1a5-4838-80fe-e1205e3f7825"/></div><button id="logOutButton" style="border-radius: 5px;background-color:beige">LogOut</button>`;
            fireSwal(titleForSwal, "logOutButton", htmlForSwal);
        })
        .catch((err) => {
            const titleForSwal = "Log In ❤️❤️❤️";
            const htmlForSwal = `<div><img src="https://firebasestorage.googleapis.com/v0/b/remecomic-3e86b.appspot.com/o/16448026743770444.gif?alt=media&token=f538cfd4-aad5-435e-9e0f-31dcb725d9af"/></div><button id="logInButton" style="border-radius: 5px;background-color:beige">LogIn</button>`;
            fireSwal(titleForSwal, "logInButton", htmlForSwal);
        });
};

const fireSwal = (titleForSwal, button, htmlForSwal) => {
    Swal.fire({
        title: titleForSwal,
        showConfirmButton: false,
        html: htmlForSwal,
        background: "pink",
        color: "black",
    });
    document.getElementById(button).addEventListener("click", (event) => {
        if (event.target.id == "logInButton") {
            counterStore.login();
            isLogin.value = true;
        } else if (event.target.id == "logOutButton") {
            counterStore.logout();
            isLogin.value = false;
        }
        Swal.close();
    });
};
</script>
<style scoped>
.gSignInWrapper {
    text-align: center;
}

.customBtn {
    display: inline-block;
    background: white;
    color: #444;
    width: 190px;
    border-radius: 5px;
    border: thin solid #888;
    box-shadow: 1px 1px 1px grey;
    white-space: nowrap;
}

.customBtn:hover {
    cursor: pointer;
}

span.label {
    font-weight: normal;
    font-size: x-small;
    font-family: "Roboto Mono", monospace;
}

span.icon {
    /* background: url('/identity/sign-in/g-normal.png') transparent 5px 50% no-repeat; */
    display: inline-block;
    vertical-align: middle;
    /* width: 42px; */
    height: 42px;
    color: rgb(255, 104, 129);
}

span.buttonText {
    color: rgb(255, 104, 129);
    display: inline-block;
    vertical-align: middle;
    padding-left: 42px;
    padding-right: 42px;
    height: 40px;
    font-weight: bold;
    font-family: "Roboto", sans-serif;
    align-items: center;
    display: flex;
    justify-content: center;
}
</style>
