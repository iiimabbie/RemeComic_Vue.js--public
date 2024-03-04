<template>
    <div class="userViewBody">
        <!-- google字體 -->
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap" rel="stylesheet" />
        <!-- google字體 -->
        <FrontstageHeader class="FrontstageHeader" />
        <UserFrontstageBar class="UserFrontstageBar" />
        <div class="containerUser">
            <div class="info " v-if="userDBData.value">
                <div style="border: rgb(121, 119, 119) dotted;border-radius: 20px; padding: 20px;">
                    <!-- 正常顯示用戶資訊 -->
                    <div v-if="!isEditing">
                        <div style="display: flex;">
                            <div class="userinput">
                                <p>Name : {{ userDBData.value.name }}</p>
                                <p>Email : {{ userDBData.value.email }}</p>
                                <p>Gender : {{ userDBData.value.gender }}</p>
                                <p>Birthday : {{ userDBData.value.birthDate }}</p>
                                <p>Register Date : {{ userDBData.value.registerDate }}</p>
                            </div>
                            <div class="userPhotoUpl"><img :src="userPhoto" class="img-thumbnail" alt="">
                            </div>
                        </div>
                        <div class="btnArea">
                            <button type="button" class="btn btn-dark" @click="startEditing">Edit</button>
                        </div>
                    </div>
                    <!-- 用戶編輯模式 -->
                    <div v-if="isEditing">
                        <div style="display: flex;">
                            <div class="userinput">
                                <p>Name : <input type="text" v-model="userDBData.value.name"></p>
                                <p>Email : <input type="text" v-model="userDBData.value.email"></p>
                                <p>Gender :
                                    <select v-model="userDBData.value.gender">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </p>
                                <p>Birthday : <input type="date" v-model="userDBData.value.birthDate"></p>
                                <p>Register Date : {{ userDBData.value.registerDate }}</p>
                            </div>
                            <div class="userPhotoUpl">
                                <div>
                                    <img :src="userDBData.value.userPhoto" class="img-thumbnail" alt=""
                                        @click="openFilePicker">
                                    <br>
                                    <input id="fileinput" type="file" ref="fileInput" @change="uploadUserPhoto($event)"
                                        style="display: none;">
                                    <button @click="$refs.fileInput.click()">Upload</button>
                                </div>
                            </div>


                        </div>
                        <div class="btnArea">
                            <button type="button" class="btn btn-dark" @click="submitEditedInfo">Submit</button>
                            <button type="button" class="btn btn-dark" @click="cancelEditing">Back</button>
                        </div>
                    </div>
                </div>

                <div class="badge-container"
                    style="border: rgb(121, 119, 119) dotted;border-radius: 20px; padding: 20px; margin-top: 20px;">
                    <p>Badges :</p>
                    <div v-for=" data  in  userBadgeDBData " :key="data" class="badge">
                        <div class="badge-circle">
                            <img :src="data.badge.badgePhoto" :alt="data.badge.badgeName" :title="data.badge.badgeDetail" />
                        </div>
                        <p>Get Time:<br />{{ data.getTime }}</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script setup>
import FrontstageHeader from "@/components/frontstage/basic/FrontstageHeader.vue";
import UserFrontstageBar from "@/components/frontstage/userA/UserFrontstageBar.vue";
import { reactive, onMounted, ref } from "vue";
import httpClient from "@/main.js";
import { VXETable } from "vxe-table";
import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';



const userId = ref(null);
const userDBData = reactive({});
const isEditing = ref(false);
const userPhoto = ref('');
// 暫存原始用戶資訊的變數
let originalUserData = null;

const openMessage = (message) => {
    VXETable.modal.message({ content: message });
};

const uploadUserPhoto = async (even) => {
    const file = event.target.files[0];
    try {
        const firebaseConfig = {
            apiKey: import.meta.env.VITE_FIREBASE_USERA_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_USERA_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_USERA_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_USERA_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_USERA_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_USERA_APP_ID,
            databaseURL: import.meta.env.VITE_FIREBASE_USERA_DATABASE_URL
        };
        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        console.log(file.name);
        const imgRef = storageRef(storage, 'userPhoto/' + file.name)
        // const storageRef = 'userPhoto/' + file.name;
        const snapshot = await uploadBytes(imgRef, file);
        const downloadURL = await getDownloadURL(imgRef);
        userDBData.value.userPhoto = downloadURL;
        userPhoto.value = downloadURL;
        console.log("圖片上傳成功，圖片 URL：", downloadURL);

    } catch (err) {
        console.log("圖片上傳失敗：", err);
    }
}


// 啟動編輯模式
const startEditing = () => {
    // 暫存給取消編輯用的
    originalUserData = { ...userDBData.value };
    isEditing.value = true;
};

// 取消編輯並返回原始資訊的方法
const cancelEditing = () => {
    if (originalUserData) {
        Object.assign(userDBData.value, originalUserData);
    }
    isEditing.value = false;
};

// 提交編輯後的資訊的方法
const submitEditedInfo = async () => {
    try {
        const formattedBirthDate = convertDateFormat(userDBData.value.birthDate);
        const editedUserData = {
            userId: userId.value,
            name: userDBData.value.name,
            gender: userDBData.value.gender,
            birthDate: formattedBirthDate,
            userPhoto: userDBData.value.userPhoto,
            email: userDBData.value.email

        };
        console.log('送出的用戶資料:', editedUserData);
        await httpClient.put("/user/update", editedUserData);
        isEditing.value = false;
        openMessage("編輯成功 👌👌👌");
    } catch (err) {
        console.log(err);
        openMessage("編輯失敗 😅😅😅");
    }
};

// 時間Format
const convertDateFormat = (dateString) => {
    const parts = dateString.split('-');
    if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${year}/${month}/${day}`;
    }
    return dateString;
};

const userBadgeDBData = ref({});

const getBadges = async () => {
    try {
        await httpClient.get("/userA/checkCookie");
        const userResponse = await httpClient.get("/user/findUserBadge", {
            params: {
                userId: userId.value,
            },
        });
        userBadgeDBData.value = userResponse.data;
        // console.log(userDBData.value);
    } catch (err) {
        console.log(err);
    }
};

// 取userId
const getSessionUser = async () => {
    try {
        await httpClient.get("/userA/checkCookie");
        const response = await httpClient.get("/user/getSession");
        userId.value = response.data.userId;

        if (userId.value) {
            const userResponse = await httpClient.get(`/user/simpleuser/${userId.value}`);
            userDBData.value = userResponse.data;
            userPhoto.value = userResponse.data.userPhoto
            await getBadges();
        }
    } catch (err) {
        console.log(err);
        console.log("未登入");
    }
};

const fetchDataOnMount = () => {
    getSessionUser();
};

onMounted(fetchDataOnMount);
</script>
<style scoped>
.userPhotoUpl {
    display: flex;
    width: 300px;
    justify-content: center;
}

.userPhotoUpl button {
    margin: 10px 0 0 60px;
    border-radius: 5px;
    background-color: beige;
}

.img-thumbnail {
    height: 200px;
    max-width: 200px;
    max-height: 200px;
    object-fit: cover;
}

.userinput {
    width: 500px;
    height: 310px;
}

.userinput input {
    height: 35px;
}

.userViewBody {
    background-color: black;
    min-height: 100vh;
    padding-bottom: 20px;
}

.UserFrontstageBar {
    margin: 50px 200px 0 200px;
    position: absolute;
}

.containerUser {
    border-radius: 0 20px 20px 0;
    /* border-style: solid; */
    border-color: black;
    background-color: pink;
    min-width: 500px;
    min-height: 900px;
    height: 85vh;
    margin: 50px 200px 0px 450px;
    color: black;
    font-family: "Roboto Mono", monospace;
    font-size: large;
}

.info {
    padding: 50px;
    height: 900px;
    display: flex;
    flex-direction: column;
    /* border: solid black 5px; */
}

.btnArea {
    margin: 5px;
    display: flex;
    justify-content: center;
    /* 水平置中 */
    align-items: center;
    /* 垂直置中 */
}

.btnArea button {
    margin: 5px;
}

p {
    line-height: 2.5;
}

.badge {
    margin: 0 10px 0 0;
}

.badge img {
    width: 45px;
}

.badge-circle {
    height: 50px;
    width: 50px;
    widows: 50px;
    border-radius: 50%;
    margin: 5px;
    background-size: cover;
    background-color: rgb(255, 220, 226);
    display: flex;
    align-items: center;
    justify-content: center;
}

.badge-container p {
    line-height: 2;
    color: black;
}

.btn {
    margin: 0 0 15px 0;
}
</style>
