<template>
    <div class="userViewBody">
        <FrontstageHeader class="FrontstageHeader" />
        <UserFrontstageBar class="UserFrontstageBar" />
        <div class="containerUser">
            <div class="info">
                <h1>My Calendar :</h1>
                <!-- {{ timeBadgeData[0].badge.badgePhoto }} class="FullCalendar" :options="calendarOptions"-->
                <div id="calendar">
                    <FullCalendar
                        class="FullCalendar"
                        :key="calendarOptions"
                        :options="calendarOptions"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import FrontstageHeader from "@/components/frontstage/basic/FrontstageHeader.vue";
import UserFrontstageBar from "@/components/frontstage/userA/UserFrontstageBar.vue";
import FullCalendar from "@fullcalendar/vue3";
// import '@fullcalendar/daygrid/main.css';
// import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from "@fullcalendar/daygrid";
import { nextTick, onMounted, ref } from "vue";
import httpClient from "@/main.js";

const userId = ref(parseInt(localStorage.getItem("userId")));
// const timeBadgeData = ref([]);

const calendarEvents = ref([]);

const getTimeBadgeData = () => {
    httpClient
        .get(`/user/findUserBadge?userId=${userId.value}`)
        .then((res) => {
            console.log("rawfrom End-Point", res.data);
            res.data.forEach((userBadge) => {
                let calendarEvent = {};
                (calendarEvent["mousehover"] = userBadge.badge.badgeName),
                    (calendarEvent["date"] = new Date(userBadge.getTime)),
                    (calendarEvent["imageUrl"] = userBadge.badge.badgePhoto);
                calendarEvents.value.push(calendarEvent);
            });
        })
        .catch((err) => console.log(err));
};

console.log("i am event ", calendarEvents);

const calendarOptions = ref({
    plugins: [dayGridPlugin],
    initialView: "dayGridMonth", // 月曆型態
    events: false ? calendarEvents.value : calendarEvents.value,
    eventContent: renderEventContent,
});

const counter = 0;
function renderEventContent(arg) {
    console.log("what is in event", arg);
    if (arg.event && arg.event.extendedProps.imageUrl) {
        console.log("i am in ar.events == undefined", arg.event);
        return {
            html: `
        ${arg.event.title}</div>
        <img src="${arg.event.extendedProps.imageUrl}" title="${arg.event.extendedProps.mousehover}" style="background-color:pink;border-radius: 40px;max-width:50px;height:40px;">
      `,
        };
    } else if (arg.event && counter <= 2) {
        console.log("counter", counter);
        setTimeout(renderEventContent(arg), 500);
    } else {
        console.log("nope");
        return {
            html: `${arg.event.title}</div>`,
        };
    }
}

// 取得userBadgeInfomation
// const getTimeBadgeData = () => {
//     httpClient
//         .get('/userA/checkCookie')
//         .then(() => {
//             httpClient
//                 .get("/user/findUserBadge", {
//                     params: {
//                         userId: userId.value,
//                     },
//                 })
//                 .then((res) => {
//                     console.log(timeBadgeData.value);

//                     const events = res.data.map(data => ({
//                         badgeName: data.badge.badgeName,
//                         getTime: data.getTime,
//                         badgePhoto: data.badge?.badgePhoto,
//                         badgeDetail: data.badge.badgeDetail
//                     }))
//                     timeBadgeData.value = events

//                     console.log(events);
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 })
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// }
// console.log(events);

// onMounted
const fetchDataOnMount = async () => {
    // const events = await getTimeBadgeData();
    // nextTick(() => {
    //     timeBadgeData.value = events;
    // });
};
onMounted(() => {
    getTimeBadgeData();
});
</script>
<style>
:root {
    --fc-event-bg-color: rgba(255, 192, 203, 0);
    --fc-event-border-color: rgba(255, 255, 255, 0);
    --fc-event-text-color: rgb(253, 140, 158);
}

.fc-col-header-cell-cushion {
    color: rgb(253, 140, 158);
}

.fc-daygrid-day-number {
    color: rgb(253, 140, 158);
}

#calendar {
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.534);
    position: relative;
    overflow: hidden;
    color: rgb(248, 152, 168);
    /* z-index: 0 !important; */
}

.fc-event-main {
    background-color: rgba(240, 248, 255, 0);
}

.FullCalendar {
    padding: 20px;
    width: 100%;
    height: 100%;
    color: rgb(248, 152, 168) !important;
}

.userViewBody {
    background-color: black;
    min-height: 100vh;
    padding-bottom: 50px;
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
}

.info {
    padding: 50px 100px 50px 100px;
    height: 900px;
    display: flex;
    flex-direction: column;
}

.info h1 {
    margin: 0 0 30px 0;
}
</style>
