<template>
    <div :class="{ profileSection: true, smaller: becomeSmaller }">
        <div class="userInfomation" style="border-top-left-radius: 1rem;border-top-right-radius: 1rem;overflow: hidden;">
            <ProfileDetail :profileUserId="profileUserIdComputed" />
        </div>
        <div class="choosePostBar">
            <nav>
                <ul>
                    <li v-for="  profileView   in   profileNav  ">
                        <span @click="changeViewShow(profileView, $event)" :class="{ nowView: profileView == nowView }">{{
                            profileView }}</span>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="postShow">
            <div v-if="nowView == 'Post'">
                <UserPostWall :targetPostsUrl="'/post/profile/show'" :hadeAddPostSection="true"
                    :profileUserId="profileUserIdComputed" />
            </div>

            <div v-if="nowView == 'Media'">
                <MediaPostWall :targetPostsUrl="'/post/profile/show/photo'" :hadeAddPostSection="true"
                    :profileUserId="profileUserIdComputed" />
            </div>

            <div v-if="nowView == 'Reply'">
                <ReplyPostWall :targetPostsUrl="'/post/profile/show/comment'" :hadeAddPostSection="true"
                    :profileUserId="profileUserIdComputed" />
            </div>

            <div v-if="nowView == 'Like'">
                <LikePostWall :targetPostsUrl="'/post/profile/show/like'" :hadeAddPostSection="true"
                    :profileUserId="profileUserIdComputed" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch, defineProps, nextTick } from 'vue';
import axios from 'axios';

import ProfileDetail from '@/components/frontstage/forum/ProfileDetail.vue';

import UserPostWall from "@/components/frontstage/forum/PostWall.vue";
import MediaPostWall from "@/components/frontstage/forum/PostWall.vue"
import ReplyPostWall from "@/components/frontstage/forum/PostWall.vue"
import LikePostWall from "@/components/frontstage/forum/PostWall.vue"
import { event } from 'jquery';

const props = defineProps(['loginUserId', 'profileUserId', 'smaller'])
const emit = defineEmits([])

//小工具們╰(*°▽°*)╯

const loginUserId = ref(1);
const profileNav = ['Post', 'Media', 'Reply', 'Like'];
const nowView = ref('Post');

function changeViewShow(targetView, event) {
    nowView.value = targetView
}

const becomeSmaller = ref(false)
onMounted(() => {
    if (localStorage.getItem("userId")) {
        loginUserId.value = localStorage.getItem("userId")
    }
    nextTick(() => {
        if (props.smaller) {
            becomeSmaller.value = true
        }
    })
})

const profileUserIdComputed = computed(() => {
    console.log('Profile props.profileUserId', props.profileUserId)
    return props.profileUserId
})
watch(() => props.profileUserId, async () => {
    if (localStorage.getItem("userId")) {
        loginUserId.value = localStorage.getItem("userId")
    }
    // console.log('props.propsPost', props.propsPost);
})
</script>
<style scoped>
.choosePostBar ul {
    display: flex;
    list-style-type: none;
    padding-left: 0;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    overflow: hidden;
}

.choosePostBar li {
    background-color: #6e6b6b;
    width: 100%;
    font-size: 2rem;
    text-align: center;
    position: relative;
}

.choosePostBar li span {
    padding: 1.5rem 0;
    display: inline-block;
    height: 100%;
    width: 100%;
}

.choosePostBar li span:hover {
    background-color: salmon;
    cursor: pointer;
}

.nowView {
    background-color: rgb(179, 18, 0);
}

.smaller {
    transform: scale(0.5);
}
</style>