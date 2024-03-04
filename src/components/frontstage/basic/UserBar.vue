<template>
    <!-- google字體 -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap" rel="stylesheet" />
    <!-- google字體 -->
    <button class="userButton" @click="handleSideBarShow">
        <font-awesome-icon class="userBar" :icon="['fas', 'bars']" />
    </button>
    <div v-if="isSideBarShow" class="userSideBarContainer">
        <div class="userSideBar">
            <div class="barContainer">
                <div class="userProfile">
                    <!-- 顯示使用者大頭貼或預設大頭貼 -->
                    <img v-if="isLogin && userPhoto" :src="userPhoto" alt="User Photo" />
                    <img v-else :src="defaultPhoto" alt="Default Photo" />
                    <p class="userName" v-if="userName">{{ userName }}</p>
                    <p class="userName" v-else="defaultName">
                        {{ defaultName }}
                    </p>
                </div>
            </div>
            <!-- 使用者登入組件 -->
            <div v-if="isLogin === true">
                <div class="barContainer">
                    <a href="http://localhost:5173/frontstage/money/RechargeSystem/">
                        <div class="coinIcon">$</div>
                        <div class="money">&emsp;{{ tatolCoin }}</div>
                    </a>
                </div>
                <div>
                    <ul class="navList">
                        <li @click="gotoMyInfo">
                            <p>
                                <font-awesome-icon :icon="['fas', 'user-gear']" />&emsp;My Info
                            </p>
                        </li>
                        <li @click="markAttendance(userId)">
                            <p>
                                <font-awesome-icon :icon="['fas', 'circle-check']" />&emsp;Attendance
                            </p>
                        </li>
                        <!-- <li @click="gotoMyBadges">
              <p>
                <font-awesome-icon :icon="['fas', 'otter']"/>&emsp;My Badges
              </p>
            </li> -->
                        <li @click="gotoMyCalendar">
                            <p>
                                <font-awesome-icon :icon="['fas', 'calendar-days']" />&emsp;Mini Calendar
                            </p>
                        </li>

                        <li @click="redeemYourCouponCode">
                            <p>
                                <font-awesome-icon :icon="['fas', 'ticket']" />&emsp;Redeem Code
                            </p>
                        </li>
                        <li @click="gotoBackstage">
                            <p v-if="userStatus === 1">
                                <font-awesome-icon :icon="['fas', 'lock']" />&emsp;Backstage
                            </p>
                        </li>

                        <!-- Mail (Yuuki用) -->
                        <!-- <li @click="redeemYourCouponCode">
                            <p>
                                <font-awesome-icon
                                    :icon="['fas', 'ticket']"
                                />&emsp;Mail
                            </p>
                        </li> -->

                    </ul>
                </div>
            </div>
            <div class="loginButton">
                <LoginButton />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import LoginButton from "@/components/frontstage/basic/LoginButton.vue";
import httpClient from "@/main.js";
import { useCounterStore } from "@/stores/counter";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
// 彈窗控制
import { VXETable } from "vxe-table";

const counterStore = useCounterStore();

// userBar控制
const isSideBarShow = ref(false);
const handleSideBarShow = () => {
    isSideBarShow.value = !isSideBarShow.value;
    getUserInfo(userId.value);
};

// const user = ref();
const userId = ref(null);
const userName = ref("");
const userPhoto = ref("");
const userStatus = ref()
const defaultPhoto =
    "https://firebasestorage.googleapis.com/v0/b/remetest-e1cbe.appspot.com/o/Basic%2F%E5%8E%9F%E5%A7%8B%E9%A3%AF%E7%B3%B0%E4%BA%BA.png?alt=media&token=2e261207-d91b-42ff-acc5-a78bbec1369a";
const defaultName = "未登入";
const tatolCoin = ref(null);
var isLogin = ref(false);
const userIdForCode = ref("");

// 把要onMounted的放一起的function
const fetchDataOnMount = () => {
    getSessionUser();
    userIdForCode.value = localStorage.getItem("userId");
};
// onMounted
onMounted(fetchDataOnMount);

// 從session拿到userId的function
const getSessionUser = () => {
    httpClient
        .get("/userA/checkCookie")
        .then(() => {
            httpClient
                .get("/user/getSession")
                .then(function (response) {
                    if (response.data != null) {
                        // console.log("response.data = ", response.data);
                        userId.value = response.data.userId;
                        userName.value = response.data.userName;
                        userPhoto.value = response.data.userPhoto;
                        isLogin = true;
                        return response.data;
                    } else {
                        isLogin = false;
                    }
                })
                .then((data) => {
                    getCoin(data.userId);
                    getUserInfo(data.userId);
                    localStorage.setItem("userId", data.userId);
                    localStorage.setItem("userName", data.userName);
                })
                .catch(function (err) {
                    console.log(err);
                    return err;
                });
        })
        .catch((err) => {
            console.log(err);
            console.log("未登入");
        });
};

const getUserInfo = (userId) => {
    httpClient
        .get(`/user/simpleuser/${userId}`)
        .then((response) => {
            userName.value = response.data.name;
            userPhoto.value = response.data.userPhoto;
            userStatus.value = response.data.status.statusId;
            console.log("getUserInfo裡面的", userName.value);
            console.log("getUserInfo裡面的", userPhoto.value);
            console.log("getUserInfo裡面的", userStatus.value);
        })
        .catch((err) => {
            console.log(err);
        });
};

const openMessage = (message) => {
    VXETable.modal.message({ content: message });
};

// 點名的function
const markAttendance = (userId) => {
    console.log(userId);
    httpClient
        .post(`/user/attendance/${userId}`)
        .then((res) => {
            if (res.data.getMoney) {
                openMessage(`恭喜你獲得免費金幣${res.data.getMoney}元～`);
            }

            openMessage("點名成功 👌👌👌");
        })
        .catch((err) => {
            openMessage("你今天已經點過名拉！😎");
            console.log(err);
        });
};

// 從userId拿到$$的function
const getCoin = (userId) => {
    httpClient
        .get("/money/account/find/User", { params: { userId } })
        .then(function (response) {
            // console.log(response.data);
            const { freeCoin, payCoin } = response.data;
            tatolCoin.value = freeCoin + payCoin;
            console.log("payCoin:", payCoin);
            console.log("freeCoin:", freeCoin);
            console.log("tatolCoin.value:", tatolCoin.value);
            localStorage.setItem("userCoin", tatolCoin.value);
        })
        .catch(function (error) {
            console.error("Error fetching coins:", error);
        });
};

const router = useRouter();
const gotoMyInfo = () => {
    console.log("去MyInfo");
    router.push("/frontstage/user/MyInfo");
};
const gotoBackstage = () => {
    console.log("去Backstage");
    router.push("/backstage/home");
};
const gotoMyCalendar = () => {
    console.log("去MyCalendar");
    router.push("/frontstage/user/MyCalendar");
};
// Yuuki用
// const gotoMyMail = () => {
//     console.log("去MyMail");
//     router.push("/frontstage/user/MyCalendar");
// };

async function redeemYourCouponCode() {
    const { value: formValues } = await Swal.fire({
        title: "Redeem Your Code",
        html: `<input id="couponCode" class="swal2-input" placeholder="Your Code">`,
        focusConfirm: false,
        preConfirm: () => {
            return {
                couponCode: document.getElementById("couponCode").value,
            };
        },
    });

    if (formValues) {
        const url = `/money/couponCodes/useCoupon?userId=${userId.value}&couponCode=${formValues.couponCode}`;

        console.log(userId.value);
        try {
            await httpClient.get(url);

            await Swal.fire({
                icon: "success",
                title: "Success",
                text: "Redeem successfully",
            });

            console.log("Redeem successfully");

            await getCoin(userId.value);
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while redeeming the code",
            });

            console.log("Code redeemed unsuccessfully", error.message);
        }
    }
}
</script>

<style scoped>
.backstage {
    position: relative;
    /* position: absolute; */
    bottom: 10;
    margin: 10;
}

.backstage button {
    border-radius: 5px;
    border: 0px pink;
    background-color: pink;
    color: gray;
    position: absolute;
    right: 10px;
    buttom: 10px
}

/******** BODY STYLE ********/
/* * {
  border-style: solid;
  border-color: rgb(255, 255, 255);
} */

/******** MY USER SIDEBAR ********/
/* 整個sidebar容器 */
.userSideBarContainer {
    position: relative;
    font-family: "Roboto Mono", monospace;
}

/* sidebar */
.userSideBar {
    position: fixed;
    top: 12%;
    right: 1.2%;
    width: 250px;
    height: 80vh;
    overflow-y: auto;
    background-color: pink;
    border-radius: 5px;
    transition: left 0.7s ease-in-out;
}

/******** USER PHOTO ********/
.userPhoto {
    width: 100px;
    height: 100px;
    display: flex;
    margin-top: 20px;
    justify-content: center;
    align-items: center;
    /* 其他样式保持不变 */
}

/******** LIST STYLE ********/
/* 清單靠左對齊，並添加左邊間距 10px */
.navList {
    padding-left: 30px;
}

/* 清單靠左對齊 */
.navList li {
    display: flex;
}

/******** SIDEBAR ICON ********/
/* 頂欄的user icon */
.userBar {
    font-size: 18px;
    color: white;
}

/* 包住user icon的按鈕 */
.userButton {
    border: 0px;
    background-color: transparent;
}

.loginButton {
    margin: 30px;
    justify-content: center;
    align-items: center;
    display: flex;
}

/******** COIN ********/
/* coin icon */
.coinIcon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: yellow;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color: black;
    font-weight: bold;
}

/* 每個barContainer */
.barContainer {
    margin: 15px;
    justify-content: center;
    align-items: center;
    display: flex;
}

.userProfile {
    text-align: center;
    /* 讓圖片和文字居中 */
}

.userProfile img {
    max-width: 150px;
    max-height: 150px;
    object-fit: cover;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    margin-top: 20px;
    justify-content: center;
    align-items: center;
}

.userName {
    margin-top: 10px;
    /* 設置名字與圖片的間距 */
    font-weight: bold;
    /* 加粗名字 */
}

/* list 沒有點點 */
ul {
    list-style-type: none;
}

li:hover {
    /* background-color: rgb(0, 0, 0); */
    cursor: pointer;
    color: rgb(116, 59, 59);
}

a {
    cursor: pointer;
    transition: 0.2s all;
    display: inline-flex;
    text-decoration: none;
    color: black;
}

a:hover {
    color: #5475ce;
}
</style>
