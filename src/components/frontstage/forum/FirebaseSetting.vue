<template>
    <div class="uploadImgSection">
        <form action="#" method="post" name="form" id="form">
            <p>
                <label for="upploadImg">upload images</label>
                <input ref="uploader" type="file" name="fileField" accept="image/gif,image/png,image/jpg,image/jpeg"
                    onChange="up()" minlength="true">
            </p>
            <p><img src="#" alt="" id="img1" /></p>
        </form>
        <p>have uplaod img:</p>
        <div :id="read">there is your file</div>
    </div>
</template>
<script setup>
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_FORUM_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_FORUM_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_FORUM_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_FORUM_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_FORUM_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_FORUM_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_FORUM_MEASUREMENTID
};
const storage_d = firebase.storage();
const uploader = ref({})
const read = ref({})
function up() {
    const files_name = uploader.value.files[0].name;
    storage_d.ref().child(files_name).put(uploader.files[0]).then(function () {
        alert("已上傳成功");
        sdata();
    })
}
function sdata() {
    const data_all = "";
    storage_d.ref().child("/").listAll().then(function () {
        res.items.forEach(function (itemRef) {
            data_all = data_all + itemRef.name + "<br\>";
        })
        read.value = data_all;
    }).catch(function (err) {
        read.value = "需要debug" + err;
    })

}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
</script>
<style scoped></style>