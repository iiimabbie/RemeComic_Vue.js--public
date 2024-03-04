<template>
    <div>
        <button @click="backToUrl" style="padding: 1rem;border-radius: 1rem;font-size: 30px;">GO
            BACK</button>
        <h2 style="text-align: center;padding-top: 1rem;" v-if="conString == 'following'">Following</h2>
        <h2 style="text-align: center;padding-top: 1rem;" v-if="conString == 'follower'">Follower</h2>
        <div v-if="users">
            <div v-for="(user, userIndex) in users"
                style="border-radius: 3rem;background-color: white;color: black;margin: 1rem;cursor: pointer;overflow: hidden;"
                @click="showUserProfile(user.userId)">
                <div class="userSimple">
                    <div class="userImgContainer">
                        <img :src="user.userPhoto" style="object-fit: cover;" class="userImg">
                    </div>
                    <div class="userInfoSection">
                        <div class="nameAndBtn">
                            <span style="font-size: 50px;">{{ user.userName }}</span>
                            <!-- <span>userId={{ user.userId }}</span> -->

                            <button class="followBtn" style="background-color: rgb(94, 61, 0);"
                                v-if="loginUserId != user.userId && user.loginUserFollowing"
                                @click.stop="changeFollow(userIndex)">FOLLOWED</button>
                            <button class="followBtn" v-if="loginUserId != user.userId && !user.loginUserFollowing"
                                @click.stop="changeFollow(userIndex)">FOLLOW</button>
                        </div>
                        <div class="infoText">{{ user.info }}</div>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch, nextTick, defineProps } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const props = defineProps(['conString', 'targetUserId'])
const emit = defineEmits([])
import Swal from 'sweetalert2';
const router = useRouter();
const axiosHelper = axios.create({
    withCredentials: true
})
const getUserConnUrl = ref('/following/show');
const changeFollowUrl = '/follow/change';
const baseUrl = 'http://localhost:8080/remecomic';
const loginUserId = ref(1);
const users = ref({});

const targetUserIdRef = ref(0);

onMounted(() => {
    console.log('props.conString', props.conString)
    console.log('props.targetUserId', props.targetUserId)
    if (localStorage.getItem("userId")) {
        loginUserId.value = localStorage.getItem("userId")
    }
    if (props.conString == "following") {
        getUserConnUrl.value = '/following/show';
    } else if (props.conString == 'follower') {
        getUserConnUrl.value = '/follower/show';
    }
    if (props.targetUserId) {
        targetUserIdRef.value = props.targetUserId
    } else {
        targetUserIdRef.value = loginUserId.value
    }

    nextTick(async () => {
        console.log('props.propsPost', props.propsPost);
        try {
            await getFollowingUsers();
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    })

})

async function getFollowingUsers() {
    axiosHelper.get(baseUrl + getUserConnUrl.value, {
        params: {
            userId: props.targetUserId ? props.targetUserId : loginUserId.value,
            loginUserId: loginUserId.value
        }
    }).then((res) => {
        console.log('res', res.data)
        users.value = res.data;
        // followersCount.value = userRrofileInfo.value.followersList.length
        // followingssCount.value = userRrofileInfo.value.followingList.length
    }).catch((err) => {
        console.log('err', err)
    })
}

async function changeFollow(userIndex) {
    console.log('進入到changeFollow,userIndex=' + userIndex)
    console.log('loginUserId', loginUserId.value)
    console.log('users.value[userIndex].userId', users.value[userIndex].userId)
    let conString = new String("follow");
    axiosHelper.post(baseUrl + changeFollowUrl, {
        userId: loginUserId.value,
        followedUserId: users.value[userIndex].userId,
        connString: conString
    }).then((res) => {
        console.log('res', res.data)
        // users.value.splice(userIndex, 1);
        users.value[userIndex].loginUserFollowing = !users.value[userIndex].loginUserFollowing;
        console.log('users.value[userIndex].loginUserFollowing', users.value[userIndex].loginUserFollowing)
        Swal.fire({
            title: users.value[userIndex].loginUserFollowing ? "已成功跟隨" : "已取消跟隨",
            icon: 'success',
            showCloseButton: false, // 預設顯示在右上角的關閉按鈕
            showConfirmButton: false,
        })

        console.log('changeFollow')
        console.log('users.value[userIndex]', users.value)

    }).catch((err) => {
        console.log('err', err)
    })
}

function backToUrl() {
    history.go(-1);
}
watch(() => props.targetUserId, async () => {
    if (localStorage.getItem("userId")) {
        loginUserId.value = localStorage.getItem("userId")
    }
    // console.log('props.propsPost', props.propsPost);
    try {
        await getFollowingUsers();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
})
async function showUserProfile(profileUserId) {
    await router.push({ path: '/frontstage/forum/profile/' + profileUserId });
    location.href = "#"
}
</script>
<style scoped>
.userSimple {
    position: relative;
    display: flex;
    /* justify-content: center; */
    align-items: center;
}

.userInfoSection {
    display: flex;
    flex-direction: column;
    /* width: 20rem; */
    padding: 1rem;
    /* background-color: blue; */
}

.nameAndBtn {
    display: flex;
    align-items: center;
}

.userImg {
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
}

.userImgContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 1rem;
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

.infoText {
    display: inline-block;
    /* background-color: aqua; */
}
</style>