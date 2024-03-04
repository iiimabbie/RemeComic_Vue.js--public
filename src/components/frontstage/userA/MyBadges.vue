<template>
    <div class="userViewBody">
        <FrontstageHeader class="FrontstageHeader" />
        <UserFrontstageBar class="UserFrontstageBar" />
        <div class="containerUser">
            <div class="info" v-if="userBadgeDBData">
                <div class="badge-container">
                    <h1>My Badges :</h1>
                    <div v-for="data in userBadgeDBData" :key="data" class="badge">
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
import { onMounted, ref } from "vue";
import httpClient from "@/main.js";

const userId = ref(parseInt(localStorage.getItem("userId")));
const userBadgeDBData = ref({});

const getBadges = () => {
    httpClient
        .get("/userA/checkCookie")
        .then(() => {
            httpClient
                .get("/user/findUserBadge", {
                    params: {
                        userId: userId.value,
                    },
                })
                .then((userResponse) => {
                    userBadgeDBData.value = userResponse.data;
                    // console.log(userDBData.value);
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};

const fetchDataOnMount = () => {
    getBadges();
};

onMounted(fetchDataOnMount);
</script>
<style scoped>
.userViewBody {
    background-color: black;
    min-height: 100vh;
    padding-bottom: 20px;
}

.UserFrontstageBar {
    margin: 50px 200px 0 200px;
    position: absolute;
}

.badge-container {
    width: 70%;
    font-size: large;
}

.containerUser {
    border-radius: 0 20px 20px 0;
    /* border-style: solid; */
    border-color: black;
    background-color: pink;
    min-width: 500px;
    min-height: 900px;
    height: 80vh;
    margin: 50px 200px 0px 450px;
    color: black;
    font-family: "Roboto Mono", monospace;
}

.badge-circle {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    margin: 10px auto;
    background-size: cover;
    background-color: rgb(255, 220, 226);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
}

.badge {
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

.badge img {
    width: 100px;
    margin: 0 auto;
}

.badge p {
    color: black;
}

.info {
    padding: 50px;
    height: 800px;
    display: flex;
    flex-direction: column;
}

.info h1 {
    margin: 0 0 30px 0;
}
</style>
