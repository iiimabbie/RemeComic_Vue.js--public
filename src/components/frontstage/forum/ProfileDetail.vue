<template>
    <div class="profileDetailPage">
        <div class="bgImgContainer">
            <img :src="userRrofileInfo.backgroundPhoto" style="object-fit: cover;" class="bgImg">
        </div>
        <div class="userImgContainer">
            <img :src="userRrofileInfo.userPhoto" style="object-fit: cover;" class="userImg">
        </div>

        <div class="userInfo">
            <span style="font-size: 50px;">{{ userRrofileInfo.userName }}</span>
            <!-- <span>userId={{ userRrofileInfo.userId }}</span> -->

            <button class="followBtn" style="background-color: rgb(94, 61, 0);"
                v-if="loginUserId != profileUserId && userRrofileInfo.loginUserFollowing"
                @click="changeFollow(userRrofileInfo.userId)">FOLLOWED</button>
            <button class="followBtn" v-if="loginUserId != profileUserId && !userRrofileInfo.loginUserFollowing"
                @click="changeFollow(userRrofileInfo.userId)">FOLLOW</button>

            <div>{{ userRrofileInfo.info }}</div>
            <div style="display: flex;font-size: 30px;">
                <router-link :to="{ path: '/frontstage/forum/friends/following/' + userRrofileInfo.userId }"><span>{{
                    followingssCount
                }}&nbsp;followings</span></router-link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <router-link :to="{ path: '/frontstage/forum/friends/follower/' + userRrofileInfo.userId }"><span>{{
                    followersCount }}&nbsp;followers</span></router-link>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch, nextTick, defineProps } from 'vue';
import axios from 'axios';
const router = useRouter();
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
const props = defineProps(['profileUserId'])
const emit = defineEmits([])

//小工具們╰(*°▽°*)╯
const axiosHelper = axios.create({
    withCredentials: true
})
const profileUrl = '/user/profile';
const baseUrl = 'http://localhost:8080/remecomic';
const changeFollowUrl = '/follow/change';
const loginUserId = ref(1);
const userRrofileInfo = ref({});

const followersCount = ref(0);
const followingssCount = ref(0);

onMounted(() => {


    nextTick(async () => {
        console.log('props.profileUserId', props.profileUserId)
        if (localStorage.getItem("userId")) {
            loginUserId.value = localStorage.getItem("userId")
        }
        // console.log('props.propsPost', props.propsPost);
        try {
            await getProfileDetail();
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    })

})

async function getProfileDetail() {
    console.log('userId', props.profileUserId)
    console.log('loginUserId', localStorage.getItem("userId"))
    axiosHelper.get(baseUrl + profileUrl, {
        params: {
            userId: props.profileUserId ? props.profileUserId : localStorage.getItem("userId"),
            loginUserId: localStorage.getItem("userId")
        }
    }).then((res) => {
        console.log('res', res.data)
        userRrofileInfo.value = res.data;
        followersCount.value = userRrofileInfo.value.followersList.length
        followingssCount.value = userRrofileInfo.value.followingList.length
    }).catch((err) => {
        console.log('err', err)
    })
}
watch(() => props.profileUserId, async () => {
    if (localStorage.getItem("userId")) {
        loginUserId.value = localStorage.getItem("userId")
    }
    // console.log('props.propsPost', props.propsPost);
    try {
        await getProfileDetail();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
})

async function changeFollow(userIndex) {
    // console.log('進入到changeFollow,userIndex=' + userIndex)
    // console.log('loginUserId', loginUserId.value)
    // console.log('users.value[userIndex].userId', users.value[userIndex].userId)
    let conString = new String("follow");
    axiosHelper.post(baseUrl + changeFollowUrl, {
        userId: loginUserId.value,
        followedUserId: userIndex,
        connString: conString
    }).then((res) => {
        console.log('res', res.data)
        // users.value.splice(userIndex, 1);
        userRrofileInfo.value.loginUserFollowing = !userRrofileInfo.value.loginUserFollowing;
        let text = "已成功跟隨";
        if (!userRrofileInfo.value.loginUserFollowing) {
            text = "已取消跟隨";
        }
        Swal.fire({
            title: text,
            icon: 'success',
            showCloseButton: false, // 預設顯示在右上角的關閉按鈕
            showConfirmButton: false,
        })

        console.log('changeFollow')
        // console.log('users.value[userIndex]', users.value)

    }).catch((err) => {
        console.log('err', err)
    })
}
</script>
<style scoped>
.profileDetailPage {
    position: relative;
    background-color: white;
    color: black;
}

.userImg {
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
}

.bgImg {
    position: relative;
    width: 100%;
    height: 15rem;
}

.userImgContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 5rem;
    transform: translateY(-50%);
}

.userInfo {
    margin-top: 6rem;
    font-size: 20px;
    padding: 2rem;
    position: relative;
}

.userInfo>* {
    padding: 1rem;
}

.followBtn {
    background-color: orange;
    color: lightyellow;
    border-radius: 2rem;
    position: absolute;
    right: 0;
    margin-right: 3rem;
    padding: 1rem;
    font-size: larger;
    font-weight: 500;
    width: 10rem;
}
</style>