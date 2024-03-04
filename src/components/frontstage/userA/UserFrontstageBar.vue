<template>
    <!-- <div class="containerUser"> -->
    <div class="sidebarUser">
        <!-- google字體 -->
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap" rel="stylesheet">
        <!-- google字體 -->
        <div>
            <ul>
                <li @click="gotoMyInfo">
                    <p><font-awesome-icon :icon="['fas', 'user-gear']" />&emsp;My Info</p>
                </li>
                <!-- <li @click="gotoMyBadges">
                    <p><font-awesome-icon :icon="['fas', 'otter']" />&emsp;My Badges</p>
                </li> -->
                <li @click="gotoMyCalendar">
                    <p><font-awesome-icon :icon="['fas', 'calendar-days']" />&emsp;Mini Calendar</p>
                </li>
            </ul>
        </div>




    </div>

    <!-- </div> -->
</template>
<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const gotoMyInfo = () => {
    console.log('去MyInfo');
    router.push("/frontstage/user/MyInfo");
}
// const gotoMyBadges = () => {
//     console.log('去MyBadges');
//     router.push("/frontstage/user/MyBadges");
// }
const gotoMyCalendar = () => {
    console.log('去MyCalendar');
    router.push("/frontstage/user/MyCalendar");
}

</script>
<style scoped>
.containerUser {
    border-radius: 20px;
    border-style: solid;
    border-color: black;
    background-color: pink;
    min-width: calc(100vw - 100px);
    min-height: 500px;
    margin: 50px;
}

.sidebarUser {
    border-radius: 20px 0 0 20px;
    min-height: 900px;
    height: 85vh;
    border-right: dotted white;
    width: 250px;
    background-color: pink;
    overflow-x: hidden;
    padding-top: 50px;
    font-size: larger;
}

.sidebarUser ul {
    list-style-type: none;
    padding: 0;
    height: 100%;
    font-family: 'Roboto Mono', monospace;
}

.sidebarUser li {
    padding: 15px;
}

.sidebarUser p {
    margin: 0;
    display: inline-block;
}

.sidebarUser li:hover {
    background-color: rgb(0, 0, 0);
    cursor: pointer;
    color: pink;
}

/* .sidebarUser .icon {
    margin-right: 10px;
} */
</style>