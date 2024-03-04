<template>
    <div class="onePostSection">
        <div class="onePost" v-if="!postAfterEditPublicStatus" style="background-color: lightgray;text-align: center;">
            have hidden this post
        </div>
        <div class="onePost" v-if="post && postAfterEditPublicStatus" :id="post.postId">
            <!-- {{ parentText }} -->
            <!-- parent post Id = {{ post.toCommentPostId }} -->

            <div class="postHeader" style="padding: 1rem  3rem;">
                <!-- parent post Id = {{ post.toCommentPostId }} -->
                post Id = {{ post.postId }}

                <!-- 貼文基本資訊：發文者、時間、更多編輯按鈕 -->
                <div class="postBasicHeader" style="display: flex;align-items: center;position: relative;">
                    <div class="userPhoto" :id="post.postUserId" style="display: flex;">
                        <!-- user id = {{ post.postUserId }} -->
                        <div class="userPhotoContainer"
                            style="background-color: gray;border-radius: 50%;width: fit-content;height: fit-content;">
                            <img :src="post.postUserPhoto" alt="User Avatar"
                                style="width: 40px;height: 40px;border-radius: 50%;">
                        </div>
                    </div>
                    <span style="margin: 0 0.5rem;font-size: larger;font-weight: 900;">{{ post.postUserName }}</span>
                    <!-- 發文時間 -->
                    <span style="position: absolute;right: 5rem;">{{ caculateTime }}
                        <!-- ;{{ post.postTime }} -->
                    </span>

                </div>

            </div>

            <div class="postMainContent">
                <!-- 貼文文字內容 -->
                <span style="color: #ff525a;" v-if="postContentIsEmpty">please write your post text!</span>
                <div class="postText" :style="{
                    border: isEdit ? '1px solid black' : 'none', margin: '1rem 0 0.25rem 0', padding: '0.25rem', backgroundColor: isEdit ? 'white' : 'transparent', color: isEdit ? 'black' : 'black', borderRadius: '1rem'
                }" :contenteditable="isEdit" @input="updatePostContent">{{ post.postContent }}</div>

                <!-- 貼文標籤 -->
                <div class="postTags"
                    v-if="!isEdit && post.postTagMap != undefined && Object.keys(post.postTagMap).length != 0"
                    style="padding: 0.25rem;display: flex;flex-wrap: wrap;">
                    <span v-for="tag in post.postTagMap" class="tagCss">
                        #{{ tag }}&nbsp;</span>
                </div>

                <!-- 圖片數量模板 -->
                <div class="photos" style="flex-wrap: wrap;position: relative;border-radius:1rem;overflow:hidden;"
                    v-if="!isEdit && isShowPicInPost && (post.photos != undefined && post.photos.length != 0)">

                    <div v-if="post.photos.length == 1">
                        <div v-for="(photoEle, index) in post.photos" class="onephotoContainer">
                            <img :src="photoEle.photo" class="postPhoto" @click="showPicView(index)" />
                        </div>
                    </div>
                    <div v-if="post.photos.length == 2">
                        <div class="onephotoContainer twoPhotoContainer">
                            <div v-for="(photoEle, index) in post.photos">

                                <img :src="photoEle.photo" class="postPhoto" @click="showPicView(index)" />
                            </div>
                        </div>
                    </div>
                    <div v-if="post.photos.length == 3">
                        <div class="threePhotoContainer">
                            <div v-for="(photoEle, index) in post.photos">
                                <img :src="photoEle.photo" class="postPhoto" @click="showPicView(index)" />
                            </div>
                        </div>
                    </div>
                    <div v-if="post.photos.length == 4">
                        <div class="fourPhotoContainer">
                            <div v-for="(photoEle, index) in post.photos">
                                <img :src="photoEle.photo" class="postPhoto" @click="showPicView(index)" />
                            </div>
                        </div>
                    </div>
                    <div v-if="post.photos.length >= 5">
                        <div class="morePhotoContainer">
                            <div v-for="(photoEle, index) in post.photos.slice(0, 4)" :key="index"
                                @click="showPicView(index)">
                                <span v-if="index == 3">+{{ (post.photos.length - 3) }}</span>
                                <img :src="photoEle.photo" class="postPhoto" />
                            </div>
                        </div>
                    </div>

                </div>

            </div>


        </div>
    </div>
    <div v-if="showPicPage">
        <div class="pageWindow">
            <div class="contentPage">

                <div class="photoMain">

                    <div id="carouselExampleIndicators" class="carousel slide" @wheel.stop="">
                        <div class="carousel-indicators">
                            <button v-for="(photoEle, index) in post.photos" type="button"
                                data-bs-target="#carouselExampleIndicators" :data-bs-slide-to="index" :id="'pic' + index"
                                :class="{ 'active': index == picIndexRef }" aria-current="true"
                                aria-label="Slide 1"></button>
                            <!-- <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                            aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                            aria-label="Slide 3"></button> -->
                        </div>
                        <div class="carousel-inner">
                            <div v-for="(photoEle, index) in post.photos" :id="'pic' + index"
                                :class="{ 'carousel-item': true, active: index == picIndexRef }">
                                <div class="imgContainer">
                                    <img :src="photoEle.photo" alt="">
                                </div>
                            </div>
                        </div>
                        <div v-show="photoLengthComputed">
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                                data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                                data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>

                </div>

                <div class="closeBtn">
                    <font-awesome-icon :icon="['fas', 'circle-xmark']" style="width: 3rem;height: 3rem;"
                        @click="closePicWindow" />
                </div>

            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch, defineProps, defineEmits, nextTick } from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import SelfOnePost from '@/components/frontstage/forum/OnePost.vue';


const props = defineProps(['propsPost', 'parentText', 'loginUserId', 'postIndexInPostWall', 'showPicInPost', 'id'])
const emit = defineEmits(['deletePost', 'commentShowPost1', 'windowScrollY1', 'picShowPost1', 'picIndex1'])
import { forumStore } from '@/stores/forum.js';
import Swal from 'sweetalert2';

const store = forumStore();

//小工具們╰(*°▽°*)╯
import axios from 'axios';
import { useRouter } from 'vue-router';
import moment from 'moment';

const router = useRouter();
const axiosHelper = axios.create({
    withCredentials: true
})
const baseUrl = 'http://localhost:8080/remecomic'
const changeLikeUrl = '/like/change'
const changeForwardUrl = '/forward/change'
const changeCollectUrl = '/collect/change'
const deletePostUrl = '/post/delete'
const searchTagForAddUrl = '/tag/show/search/addInPost'
const updatePostBodyUrl = '/post/update'
const updatePostPublicStatusUrl = '/post/update/publicStatus'
const addReportUrl = '/report/add'

const post = ref({})
const isEdit = ref(false);
const imgShowUrlList = ref([]);//展示在ui畫面上的圖片(此陣列包含firebase連結+地端圖片連結)
const imgSendToBackend = ref([]);//原有的圖片連結(此陣列專門存取firebase連結)
const imgSendToFirebaseFiles = ref({})//要傳到firebase儲存的圖片
const imgToDeleteUrl = ref([]) //要傳送到firebase去刪除的圖片連結
const fileInput = ref(null)
const tagOptionsList = ref([])
const searchString = ref("")
const tagShowList = ref([])//展示在UI畫面上的tag
const isAddTag = ref(false);
const postOriginalContent = ref("")
const postOriginalPublicStatus = ref("")

const loginUserId = ref(1)

const isShowPicInPost = computed(() => {
    // console.log('isShowPicInPost', props.showPicInPost)
    const result = props.showPicInPost === false ? false : true;
    // console.log('result', result);
    return result;
})
const postAfterEditPublicStatus = ref(true)
const showPicPage = ref(false);
const picIndexRef = ref(0);

const caculateTime = computed(() => {
    // console.log('post.value.postTime', post.value.postTime)

    let targetTime = moment(post.value.postTime, 'YYYY/MM/DD HH:mm:ss')
    let result = targetTime.fromNow();//人性化顯示發文時間與當前時間的差距
    let constrast = moment().diff(targetTime, 'days');//計算發文時間與現在時間的天數差距
    const nowYear = moment().year(); //當前月份
    const nowMonth = moment().month(); //當前月份
    const targetYear = targetTime.year();//發文時的年
    const targetMonth = targetTime.month();//發文時的月
    if (targetYear != nowYear) {
        return targetTime.format('YYYY/MM/DD HH:mm');
    } else if (targetMonth != nowMonth) {
        return targetTime.format('MM/DD HH:mm');
    } else {
        return result;
    }


})
onMounted(() => {
    // console.log('id', props.id)
    // console.log('postIndexInPostWall', props.postIndexInPostWall)
    if (props.loginUserId) {
        loginUserId.value = props.loginUserId
    }

    nextTick(() => {
        // console.log('props.propsPost', props.propsPost);
        post.value = props.propsPost;
        if (post.value && Array.isArray(post.value.photos)) {
            for (const photoEle of post.value.photos) {
                //展示在ui畫面上的圖片(此陣列包含firebase連結+地端圖片連結)
                imgShowUrlList.value.push(photoEle.photo);
            }
        }

        for (const tagEle in post.value.postTagMap) {
            tagShowList.value.push(post.value.postTagMap[tagEle])
        }
        postOriginalContent.value = post.value.postContent
        postOriginalPublicStatus.value = post.value.publicStatus;
    });


    // console.log('tagShowList', tagShowList.value)
})


function updatePostContent(e) {
    post.value.postContent = e.target.innerText;
    console.log('content', post.value.postContent)
}
const postContentIsEmpty = computed(() => {
    return post.value.postContent === ""
})

import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_FORUM_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_FORUM_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_FORUM_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_FORUM_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_FORUM_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_FORUM_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_FORUM_MEASUREMENTID
};
const app = initializeApp(firebaseConfig);

let defaultStorage = getStorage(app);

function showPicView(picIndex) {
    console.log('showPicView')
    console.log('picShowPost1', post.value)
    console.log('picIndex', picIndex)
    showPicPage.value = true;
    picIndexRef.value = picIndex;
}
function closePicWindow() {
    showPicPage.value = false;
}
const photoLengthComputed = computed(() => {
    return post.value?.photos && Object.entries(post.value.photos).length > 1;
})
</script>
<style scoped>
* {
    /* border: solid 1px; */
    box-sizing: border-box;
}

.onePostSection {
    /* width: 100%; */
    /* background-color: salmon; */
}

.activeBar {
    /* display: flex; */
}

.activeIcon {
    width: 2rem;
    height: 2rem;
    transition: 0.05s;
}

.activeBtn {
    /* background-color: lightblue; */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4rem;
    height: 4rem;
    transition: 0.25s;
    /* margin: 0 0.5rem; */
}

.activeOne {
    display: flex;
    justify-content: center;
    align-items: center;
}

.activeOneGroup {
    display: flex;
}

.closeImgBtn {
    width: 25px;
    height: 25px;
    background-color: rgb(1, 1, 1);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    transform: translateY(-50%) translateX(-50%);
    cursor: pointer;
}

.closeTagBtn {
    display: flex;
    justify-content: center;
    align-items: center;
}

.onePost {
    margin: 0 0.25rem 0 0.25rem;
    padding: 0.25rem;
    /* border: solid 1px gray; */
    border-radius: 1rem;
    background-color: rgb(255, 255, 255);
    color: black;
    min-width: 30rem;
}

.activeBar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.postText {
    background-color: rgb(0, 0, 0);
    border: 1px solid black;
    margin: 1rem 0 0.25rem 0;
    padding: 0.25rem;
    border-radius: 1rem;
    color: black;
    outline-color: rgb(52, 129, 154);
}

.postText[contentEditable=true]:empty:not(:focus):before {
    content: attr(data-text);
    color: rgb(45, 132, 160);
}

.postMainContent {
    margin: 1rem 3rem;
}

.tagCss {
    background-color: rgb(134, 219, 255);
    color: rgb(255, 255, 255);
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    border-radius: 10px;
    position: relative;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;
    padding: 0.25rem;
    margin: 0.25rem;
}

.postTags {
    display: flex;
}

.publicStatus {
    background-color: #ff525a;
    position: absolute;
    height: fit-content;
    width: 6rem;
    border-radius: 3rem;
    right: 0;
    padding: 0.25rem;
    margin: 0 1rem;
    transition: 0.5s;
}

.privateStatus {
    background-color: aqua;
}

.publicStatusDot {
    border-radius: 50%;
    height: 1.5rem;
    width: 1.5rem;
    position: absolute;
    margin: 0.25rem;
    transition: 0.5s;
    top: 0;
}

.publicStatusDotCss {
    background-color: #6500a8;
    left: 0;
}

.privateStatusDotCss {
    background-color: #ff0000;
    transform: translateX(3.75rem);
    /* right: 0; */
}

.onephotoContainer {
    background-color: #ff525a;
    position: relative;
    width: 100%;
    height: 200px;
    /* overflow: hidden; */
}

.postPhoto {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    cursor: pointer;
    border-radius: 1rem;
}

.twoPhotoContainer,
.fourPhotoContainer,
.morePhotoContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 7px;
    background-color: rgba(203, 203, 203, 0.8);
    padding: 10px;
}

.fourPhotoContainer,
.morePhotoContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 100px;
}

.threePhotoContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 100px;
    grid-gap: 7px;
    background-color: rgba(203, 203, 203, 0.8);
    padding: 10px;
}

.threePhotoContainer>div:first-child {
    /* background-color: red; */
    grid-row-start: 1;
    grid-row-end: 3;
}

.morePhotoContainer>div:last-child .postPhoto {
    -webkit-filter: brightness(.3);
}

.morePhotoContainer>div:last-child {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.morePhotoContainer span {
    position: absolute;
    font-size: 5rem;
    color: white;
    z-index: 100;
}

.postConn * {
    display: inline;
}

.inputTag {
    outline-color: lightblue;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    border-color: lightblue;
    color: rgb(0, 89, 255);
}

.editHelper>* {
    margin: 1rem;
}

.editHelper button {
    padding: 0.5rem;
    width: 100px;
}

.whenNoPhotos {
    height: 5rem;
}

.pageWindow {
    background-color: rgb(0, 0, 0);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.contentPage {
    display: flex;
    height: 100%;
}

.photoMain {
    /* background-color: black; */
    height: 100vh;
    position: relative;
    /* width: 100%; */
    flex: 3;
    /* display: flex;
    justify-content: center;
    align-items: center; */
    object-fit: scale-down;
    /* padding: 2rem; */
}

.postAndCommentShow {
    flex: 1.5;
    /* background-color: blue; */
    /* width: 40%; */
    height: 100%;
    overflow: auto;
}


.carousel {
    width: 100%;
    height: 100%;
    /* background-color: blueviolet; */
    /* object-fit: contain; */
}

.carousel-indicators {
    transform: translateY(-3rem);
}


.carousel-inner {
    /* width: 75%; */
    /* width: 100%;*/
    /* background-color: cadetblue; */
    height: 100%;
    object-fit: scale-down;
    position: relative;
    /* margin: 1rem; */
}


.imgContainer {
    /* border: 2px red solid; */
    text-align: center;
    position: relative;
    top: 50vh;
    transform: translateY(-50%);
}

.carousel-item img {
    object-fit: scale-down;
    max-width: 90%;
    max-height: 90vh;
}

.closeBtn {
    z-index: 1001;
    cursor: pointer;
    width: 2.5rem;
    height: 2.5rem;
    /* border: #71747a 1px solid; */
    margin: 1rem 1.5rem;
    position: absolute;
    background-color: rgb(24, 24, 24);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.closeBtn:hover {
    background-color: rgb(137, 124, 124);
}
</style>