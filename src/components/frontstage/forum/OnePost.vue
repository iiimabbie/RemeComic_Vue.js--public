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
                <!-- 這則貼文與跟隨中好友的關係 -->
                <div class="postConn" style="color: rgb(255, 125, 194);margin-bottom: 0.5rem;font-size: 25px;">
                    <!-- 跟隨的好友中喜歡這則貼文的 -->
                    <span
                        v-if="post.connectMap && (post.connectMap.like.length != 0 || post.connectMap.forward.length != 0)">
                        Your friend&nbsp;</span>
                    <div v-if="post.connectMap && post.connectMap.like">
                        <div v-for="(like, index) in post.connectMap.like">
                            <span v-if="index <= 3">{{ like.userName }}</span>
                            <span v-if="index != post.connectMap.like.length - 1">&nbsp;,&nbsp;</span>
                            <span v-if="index > 3">...etc,</span>
                        </div>
                        <span v-if="post.connectMap.like.length != 0">&nbsp;
                            liked&nbsp;<font-awesome-icon :icon="['fas', 'heart']" /></span>
                        <div v-if="post.connectMap.like.length != 0 && post.connectMap.forward.length != 0">,&nbsp;and&nbsp;
                        </div>
                    </div>
                    <!-- 跟隨的好友中轉發這則貼文的 -->
                    <div v-if="post.connectMap && post.connectMap.forward">
                        <div v-for="(forward, index) in post.connectMap.forward">
                            <span v-if="index <= 3">{{ forward.userName }}&nbsp;</span>
                            <span v-else>...etc,</span>
                        </div><span v-if="post.connectMap.forward.length != 0">
                            forwarded&nbsp;<font-awesome-icon :icon="['fas', 'rotate']" /></span>
                    </div>
                </div>
                <!-- 貼文基本資訊：發文者、時間、更多編輯按鈕 -->
                <div class="postBasicHeader"
                    style="display: flex;align-items: center;position: relative;width: 100%;justify-content: space-between;">
                    <div style="display: flex;justify-content: center;align-items: center;">
                        <div class="userPhoto" :id="post.postUserId" @mousemove="handleMouseOver('target')"
                            @mouseleave="handleMouseLeave('target')" style="position: relative;">
                            <!-- user id = {{ post.postUserId }} -->
                            <div class="userPhotoContainer"
                                style="background-color: gray;border-radius: 50%;width: fit-content;height: fit-content;">
                                <img :src="post.postUserPhoto ? post.postUserPhoto : 'https://firebasestorage.googleapis.com/v0/b/remecomic-a4a29.appspot.com/o/images%2F%E5%8E%9F%E5%A7%8B%E9%A3%AF%E7%B3%B0%E4%BA%BA.png?alt=media&token=36530ef8-2d6b-4fcb-8d22-22228009eac6'"
                                    alt="頭貼"
                                    style="width: 80px;height: 80px;border-radius: 50%;cursor: pointer;object-fit: cover;"
                                    @click="showUserProfile(post.postUserId)">
                            </div>

                            <!-- 快速顯示該使用者的基本資料 -->
                            <div v-if="isHovered || stayHover" class="mytooltip" style="background-color: #ff226f;"
                                @mousemove="handleMouseOver('window')" @mouseleave="handleMouseLeave('window')">
                                <!-- Tooltip content -->
                                <ProfileDetail :profileUserId="post.postUserId" />

                            </div>


                        </div>
                        <span style="margin: 0 0.5rem;font-size: larger;font-weight: 900;cursor: pointer;"
                            @click="showUserProfile(post.postUserId)">{{ post.postUserName }}</span>

                    </div>

                    <!-- 發文時間 -->
                    <span>{{ caculateTime }}
                        <!-- ;{{ post.postTime }} -->
                    </span>
                    <!-- 更多針對貼文的操作 -->
                    <div class="dropdown">
                        <a class="btn btn-secondary dropdown-toggle" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <font-awesome-icon :icon="['fas', 'bars']"
                                @click="showUserAndPost(loginUserId, post.postUserId)" />
                        </a>
                        <ul class="dropdown-menu">
                            <li v-show="loginUserId == post.postUserId" @click="editPostComputed(post.photos)">
                                <a class="dropdown-item">Edit this Post</a>
                            </li>
                            <li v-show="loginUserId == post.postUserId" @click="deletePost(post.postId, post.photos)">
                                <a class="dropdown-item">Delete this Post</a>
                            </li>
                            <li v-show="loginUserId != post.postUserId" @click="reportPostSwal(post.postId)">
                                <a class="dropdown-item">Report this Post</a>
                            </li>
                        </ul>
                    </div>
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
                    <span v-for="(tag, key) in post.postTagMap" class="tagCss" @click="showTagPost(tag, key)">
                        #{{ tag }}&nbsp;</span>
                </div>
                <!-- 貼文標籤(編輯狀態) -->
                <div class="postTags" v-if="isEdit" style="text-align: center;">

                    <div
                        style="display: flex;flex-wrap: wrap;background-color: #9c9c9c;padding: 0.25rem;border-radius: 1rem;width: 600px;align-items: center;">
                        <span v-for="tag in tagShowList" class="tagCss">
                            #{{ tag }}&nbsp;
                            <div class="closeTagBtn" @click="removeShowTag(tag)">
                                <font-awesome-icon :icon="['fas', 'circle-xmark']"
                                    style="width:1.5rem;height: 1.5rem;cursor: pointer;" />
                            </div>
                        </span>

                        <div class="postTagsOptions" v-if="isAddTag">
                            <input v-model="searchString" type="text" id="input0" list="options0" @input="searchForaddTag"
                                @keyup.enter="addTag" class="inputTag">
                            <datalist id="options0">
                                <div v-for="tag in tagOptionsList">
                                    <option v-if="!tagShowList.includes(tag.tagName)">
                                        {{ tag.tagName }}
                                    </option>
                                </div>
                            </datalist>

                        </div>

                    </div>
                    <button :disabled="isAddTag" @click="(isAddTag = true)"
                        style="width:10rem;height:50px;margin: auto 1rem;border-radius: 1rem;background-color: darkcyan;color: white;border: none;">
                        Add Tag</button>
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

                <!-- 貼文圖片(編輯狀態) -->
                <div :class="{ photos: true, whenNoPhotos: imgShowUrlList.length <= 0 }" v-if="isEdit"
                    style="margin-top:0.25rem;display: flex;flex-direction: row;background-color: #1f1e1e;position: relative;padding: 0.25rem;flex-wrap: wrap;border-radius: 1rem;">
                    <font-awesome-icon :icon="['fas', 'image']"
                        style="color: #efe6e6;position: absolute;width: 3rem;height: 3rem;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" />
                    <input ref="fileInput" type="file" name="fileField" accept="image/*" @change="showUpload" multiple
                        style="opacity: 0;background-color: #ff525a;position: absolute;width: 100%;height: 100%;">
                    <div v-for="(imgUrl, index) in imgShowUrlList" style="position: relative;margin: 0.5rem;">
                        <img :src="imgUrl" style="width: 5rem;height: 5rem;border-radius: 30%;object-fit: cover;" />
                        <div class="closeImgBtn" @click="removeShowImg(imgUrl)">
                            <font-awesome-icon :icon="['fas', 'circle-xmark']" style="width:30px;height: 30px;" />
                        </div>
                    </div>

                </div>

                <!-- 儲存編輯狀態&取消 & 更改貼文公開狀態 -->
                <div class="editHelper" style="position: relative;display: flex;padding: 0.25rem;" v-if="isEdit">
                    <button @click="cancelUplaodPost" style="background-color: rgb(107, 153, 173);">CANCEL</button>
                    <button @click="uplaodPost(post.postId)" style="background-color: rgb(39, 185, 248);">SAVE</button>


                    <div :class="{ publicStatus: true, privateStatus: post.publicStatus == 'private' }"
                        @click="changePublicStatus(post)">
                        <div
                            :class="{ publicStatusDot: true, publicStatusDotCss: post.publicStatus == 'public', privateStatusDotCss: post.publicStatus == 'private' }">
                        </div>
                        <span v-if="post.publicStatus == 'public'"
                            style="position: relative;left: 50px;top:0.2rem;color: white;">public</span>
                        <span v-if="post.publicStatus == 'private'"
                            style="position: relative;left: 5px;top:0.2rem;color: white;">private</span>
                    </div>

                </div>

                <div class="activeBar" style="margin:1rem">
                    <div class="activeOneGroup">
                        <div class="activeOne">
                            <div class="activeBtn commentBtn" @click="showCommentView">
                                <font-awesome-icon :icon="['far', 'comment']" class="fa-regular activeIcon" />
                                <!-- <font-awesome-icon :icon="['far', 'comment']" style="color: #1f9eff;" /> -->
                            </div>
                            <span style="margin:0 0.5rem;">{{ post.commentAmount }}</span>
                        </div>

                        <div class="activeOne">
                            <div class="activeBtn likeBtn" @click="changeActive('like')">
                                <!-- @click="changeActive('like', post)" -->
                                <!--樣式1 -->
                                <!--normal -->
                                <font-awesome-icon v-if="!post.loginUserLiked" :icon="['far', 'heart']"
                                    class="activeIcon" />
                                <!-- have click -->
                                <font-awesome-icon v-else :icon="['fas', 'heart']" style="color: #ff226f;"
                                    class="activeIcon" />
                                <!-- focus -->
                                <!-- <font-awesome-icon :icon="['far', 'heart']" beat-fade style="color:#ff226f;" /> -->
                            </div>
                            <span style="margin:0 0.5rem;">{{ post.likeAmount }}</span>
                        </div>

                        <div class="activeOne">
                            <div class="activeBtn forwardBtn" @click="changeActive('forward')">
                                <!-- normal -->
                                <font-awesome-icon v-if="!post.loginUserForwarded" :icon="['fas', 'rotate']"
                                    class="activeIcon" />

                                <font-awesome-icon v-else :icon="['fas', 'rotate']" style="color: #1ee6a3;"
                                    class="activeIcon" />
                            </div>
                            <span style="margin:0 0.5rem;">{{ post.forwardAmount }}</span>
                        </div>
                    </div>
                    <div class="activeBtn collectBtn" @click="changeActive('collect')">
                        <!-- normal -->
                        <font-awesome-icon v-if="!post.loginUserCollected" :icon="['far', 'bookmark']" class="activeIcon" />

                        <font-awesome-icon v-else :icon="['fas', 'bookmark']" style="color: #6500a8;" class="activeIcon" />
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch, defineProps, defineEmits, nextTick } from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import SelfOnePost from '@/components/frontstage/forum/OnePost.vue';
import ProfileDetail from '@/components/frontstage/forum/ProfileDetail.vue';

const props = defineProps(['propsPost', 'parentText', 'loginUserId', 'postIndexInPostWall', 'showPicInPost'])
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
    if (localStorage.getItem("userId")) {
        loginUserId.value = localStorage.getItem("userId")
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

function changeActive(activeName) {
    if (activeName === 'like') {
        sendToBackendChangeActive(post.value.postId, changeLikeUrl)
        console.log('post id = ' + post.value.postId)
        console.log('props.loginUserId = ' + props.loginUserId)
        console.log('post loginUserLiked 1', post.value.loginUserLiked)
        post.value.loginUserLiked = !post.value.loginUserLiked
        if (post.value.loginUserLiked) {
            post.value.likeAmount++;
        } else {
            post.value.likeAmount--;
        }
        console.log('post loginUserLiked 2', post.value.loginUserLiked)
    } else if (activeName === 'forward') {
        sendToBackendChangeActive(post.value.postId, changeForwardUrl)
        console.log('post loginUserForwarded 1', post.value.loginUserForwarded)
        post.value.loginUserForwarded = !post.value.loginUserForwarded
        if (post.value.loginUserForwarded) {
            post.value.forwardAmount++;
        } else {
            post.value.forwardAmount--;
        }
        console.log('post loginUserForwarded 2', post.value.loginUserForwarded)
    } else if (activeName === 'collect') {
        sendToBackendChangeActive(post.value.postId, changeCollectUrl)
        console.log('post loginUserCollected 1', post.value.loginUserCollected)
        post.value.loginUserCollected = !post.value.loginUserCollected
        console.log('post loginUserCollected 2', post.value.loginUserCollected)
    }
}
function sendToBackendChangeActive(postId, activeUrl) {
    axiosHelper.post(baseUrl + activeUrl, {
        userId: localStorage.getItem("userId"),
        postId: postId
    })
        .then(res => {
            console.log(res.data)
            if (activeUrl == changeCollectUrl) {
                Swal.fire({
                    title: post.value.loginUserCollected ? "已收藏貼文" : "已取消收藏",
                    icon: 'success',
                    showCloseButton: false, // 預設顯示在右上角的關閉按鈕
                    showConfirmButton: false,
                })
            }
        })
        .catch(err => {
            console.log(err)

        })
}
async function deletePost(postId, photos) {
    //變化前端ui頁面的貼文顯示
    emit('deletePost', postId)
    //送給後端request刪除post
    axiosHelper.delete(baseUrl + deletePostUrl, {
        params: {
            postId: postId
        }
    }).then(res => {
        console.log(res)
        Swal.fire({
            title: "已刪除貼文",
            icon: 'success',
            showCloseButton: false, // 預設顯示在右上角的關閉按鈕
            showConfirmButton: false,
        })
    }).catch(err => {
        console.log(err)
        Swal.fire({
            title: "貼文刪除失敗",
            icon: 'error',
            showCloseButton: false, // 預設顯示在右上角的關閉按鈕
            showConfirmButton: false,
        })
    })
    //刪除firebase中存有的貼文圖片資料
    if (photos.length != 0) {
        console.log('before delete, imgToDeleteUrl', imgToDeleteUrl.value)
        photos.forEach(photoEle => {
            imgToDeleteUrl.value.push(photoEle.photo)
        });
        deleteImgs();
        console.log('after delete, imgToDeleteUrl', imgToDeleteUrl.value)
        // imgToDeleteUrl.value = [];

    }

}
function editPostComputed(photos) {
    console.log('isEdit', isEdit.value)
    isEdit.value = true

    imgSendToBackend.value = []
    imgSendToFirebaseFiles.value = []
    imgToDeleteUrl.value = []

    const photosGroup = post.value.photos

    console.log('photos', photos)
    for (const photoEle of photosGroup) {
        //原有的圖片連結(此陣列專門存取firebase連結)
        imgSendToBackend.value.push(photoEle.photo);
        console.log('photo', photoEle.photo)
    }
    console.log('imgSendToBackend', imgSendToBackend.value)
    console.log('isEdit', isEdit.value)
}
function showUpload(event) { //可以即時秀出用戶上傳的圖片
    const fileShowList = (event.target.files);
    for (let i = 0; i < fileShowList.length; i++) {
        let imgUrl = URL.createObjectURL(fileShowList[i])
        console.log('imgUrl', imgUrl);
        imgShowUrlList.value.push(imgUrl);

        if (imgSendToFirebaseFiles.value[imgUrl] == undefined) {
            imgSendToFirebaseFiles.value[imgUrl] = fileShowList[i];
        }
    }

}
function changePublicStatus() {
    if (post.value.publicStatus == 'public') {
        post.value.publicStatus = 'private'
    } else {
        post.value.publicStatus = 'public'
    }
}

function cancelUplaodPost() {
    isEdit.value = false;
    isAddTag.value = false;

    imgSendToBackend.value = []
    imgSendToFirebaseFiles.value = []
    imgToDeleteUrl.value = []
    imgShowUrlList.value = []
    tagShowList.value = []
    post.value.postContent = postOriginalContent.value
    post.value.publicStatus = postOriginalPublicStatus.value

    for (const photoEle of post.value.photos) {
        //展示在ui畫面上的圖片(此陣列包含firebase連結+地端圖片連結)
        imgShowUrlList.value.push(photoEle.photo);
    }
    for (const tagEle in post.value.postTagMap) {
        tagShowList.value.push(post.value.postTagMap[tagEle])
    }
}
const uplaodPost = async (postId) => {

    if (post.value.postContent == "") return
    //修改UI畫面
    isEdit.value = false
    isAddTag.value = false;
    // 上傳圖片到filebase
    //遍歷所有上傳檔案
    try {

        //如果貼文的公開狀態有改，再送往後端資料
        if (post.value.publicStatus != postOriginalPublicStatus.value) {
            console.log('postId', postId)
            console.log('postOriginalPublicStatus', postOriginalPublicStatus.value)

            axiosHelper.put(baseUrl + updatePostPublicStatusUrl, {
                postId: postId,
                publicStatusString: post.value.publicStatus
            }).then(res => {
                console.log(res.data)
                if (res.data.publicStatus == post.value.publicStatus) {
                    console.log('狀態修改成功，已修改成：' + post.value.publicStatus)
                } else {
                    throw err('狀態修改失敗')
                }
                //確認更新後的貼文公開狀態，決定是否在畫面上隱藏
                if (post.value.publicStatus == 'private') {
                    postAfterEditPublicStatus.value = false;
                }
            }).catch(err => {
                console.log(err)
            })
        }

        await uplaodPostToFirebase(postId);
        await deleteImgs();

        //傳送到後端更新post資料
        console.log('postId', postId)
        console.log('postContent', post.value.postContent)
        console.log('tagArray', Array.from(tagShowList.value))
        console.log('photoArray', Array.from(imgSendToBackend.value))
        //更新貼文
        axiosHelper.put(baseUrl + updatePostBodyUrl, {
            // params: {
            postId: postId,
            postContent: post.value.postContent,
            tagArray: tagShowList.value.length != 0 ? Array.from(tagShowList.value).join(',') : null,
            photoArray: imgSendToBackend.value.length != 0 ? Array.from(imgSendToBackend.value).join(',') : null
            // }
        }).then((res) => {
            console.log(res.data)
            Swal.fire({
                title: "貼文已更新",
                icon: 'success',
                showCloseButton: false, // 預設顯示在右上角的關閉按鈕
                showConfirmButton: false,
            })
            post.value = res.data
            imgSendToBackend.value = []
            imgSendToFirebaseFiles.value = []
            imgToDeleteUrl.value = []
            imgShowUrlList.value = []


            if (post.value && Array.isArray(post.value.photos)) {
                for (const photoEle of post.value.photos) {
                    //展示在ui畫面上的圖片(此陣列包含firebase連結+地端圖片連結)
                    imgShowUrlList.value.push(photoEle.photo);
                }
            }

        }).catch(err => {
            console.log(err)
            Swal.fire({
                title: "貼文更新失敗",
                icon: 'error',
                showCloseButton: false, // 預設顯示在右上角的關閉按鈕
                showConfirmButton: false,
            })
        })



    } catch (err) {
        console.log(err)
    }

}

async function uplaodPostToFirebase(postId) {
    const keys = Object.keys(imgSendToFirebaseFiles.value);
    for (let i = 0; i < keys.length; i++) {
        const keyUrl = keys[i];
        console.log('keyUrl', keyUrl)
        const valueFile = imgSendToFirebaseFiles.value[keyUrl];
        console.log('valueFile', valueFile)

        if (keys.length == 0) return;

        let file = valueFile;
        console.log('file', file)
        if (file.size === 0) return;

        const files_name = file.name;
        console.log('files_name', files_name)

        //生成唯一id
        const id = `${postId}_${i}_${Date.now()}_${file.name}`;

        const imgRef = storageRef(defaultStorage, `images/${id}`);
        console.log('img id', `images/${id}`)

        try {
            const uplaodTask = uploadBytesResumable(imgRef, file);
            await uplaodTask;
            // alert('上傳成功');
            const url = await getDownloadURL(imgRef);
            imgSendToBackend.value.push(url);


        } catch (err) {
            console.log(err)
            // alert('上傳失敗');
        }

        // imgToDeleteUrl.value = [];
    }
}
function updatePostContent(e) {
    post.value.postContent = e.target.innerText;
    console.log('content', post.value.postContent)
}
function removeShowImg(imgUrl) {
    const deleteImgIndex = imgShowUrlList.value.indexOf(imgUrl);
    imgShowUrlList.value.splice(deleteImgIndex, 1);
    console.log('removeShowImg');
    console.log('imgSendToBackend', imgSendToBackend.value);
    console.log('imgUrl', imgUrl)
    if (imgSendToBackend.value.indexOf(imgUrl) != -1) {
        //現在imgSendToBackend存的是firebase的url，已經儲存在db中了
        //如果要送到後端的資料中包含這個想移除的圖片(移除貼文原本的圖片)
        imgSendToBackend.value.splice(imgSendToBackend.value.indexOf(imgUrl), 1);

        if (!imgToDeleteUrl.value.includes(imgUrl)) {

            imgToDeleteUrl.value.push(imgUrl)
            console.log('移除貼文原本的圖片', imgToDeleteUrl.value)
        }
    } else {
        //如果不包含這個想移除的圖片(移除這次更新時新增的圖片)
        // 就不用特地把url加到imgToDeleteUrl，傳給firebase去刪除
        console.log('移除這次更新時新增的圖片 將現在想刪的加進imgToDeleteUrl裡面!', imgToDeleteUrl.value)
    }
    if (imgSendToFirebaseFiles.value[imgUrl] != undefined) {
        console.log('imgSendToFirebaseFiles.value[imgUrl]', imgSendToFirebaseFiles.value[imgUrl])
        delete imgSendToFirebaseFiles.value[imgUrl];
        console.log('imgSendToFirebaseFiles.value[imgUrl]', imgSendToFirebaseFiles.value[imgUrl])
    }
}
function searchForaddTag() {
    axios.get(baseUrl + searchTagForAddUrl, {
        params: {
            searchString: searchString.value
        }
    }).then((res) => {
        // console.log(res.data)
        tagOptionsList.value = res.data
    }).catch((err) => {
        console.log(err)
    })
}
function addTag() {
    console.log('add searchString', searchString.value)
    let trimSpace = searchString.value.trim();
    // 防呆
    if (!tagShowList.value.includes(trimSpace)) {

        if (trimSpace.length == 0) {
            console.log('searchString.value.trim', trimSpace)
            isAddTag.value = false;
        } else {
            isAddTag.value = false;
            tagShowList.value.push(trimSpace)
            searchString.value = ""
        }

    } else {
        // alert('tag 重複了!')
        Swal.fire({
            title: "tag 重複了",
            icon: 'error',
            showCloseButton: false, // 預設顯示在右上角的關閉按鈕
            showConfirmButton: false,
        })
        searchString.value = ""
    }

}
function removeShowTag(tag) {
    const tagIndex = tagShowList.value.indexOf(tag);
    if (tagIndex != -1) {
        tagShowList.value.splice(tagIndex, 1)
    }
    console.log('remove tag', tag)
    console.log('tagShowList', tagShowList.value)
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

function deleteImgs() {
    console.log("進入到刪除方法!")
    console.log('imgToDeleteUrl', imgToDeleteUrl.value)
    for (let i = 0; i < imgToDeleteUrl.value.length; i++) {
        console.log('imgToDeleteUrl.value[i])=', imgToDeleteUrl.value[i])
        const imgRef = storageRef(defaultStorage, imgToDeleteUrl.value[i]);
        deleteObject(imgRef)
            .then(() => {

                // alert('圖片已刪除:');
            }).catch((err) => {
                // alert('圖片刪除失敗:', err)
            })
    }
    console.log('imgToDeleteUrl', imgToDeleteUrl.value)
    imgToDeleteUrl.value = []
}
function showCommentView() {
    console.log('showCommentView')
    console.log('window.scrollY', window.scrollY)
    emit('commentShowPost1', post.value)
    emit('windowScrollY1', window.scrollY)
    // if (!showPicPage) {
    // console.log('到達最上方')
    // location.href = '#';
    // }
    location.href = "#"
}
function showPicView(picIndex) {
    console.log('showPicView')
    // const postInStore = store.storePost[post.value.postId];
    // if (!postInStore) {
    //     store.storePost[post.value.postId] = post.value;
    // }
    // router.push({
    //     name: 'Picture',
    //     params: {
    //         'postId': post.value.postId,
    //         'picIndex': picIndex
    //     }
    // });

    // console.log('forumStore.storePost[post.value.postId]', forumStore.storePost[post.value.postId])
    console.log('picShowPost1', post.value)
    console.log('picIndex', picIndex)
    emit('picShowPost1', post.value)
    emit('picIndex1', picIndex)

    // location.href = '#'
}
// watch(() => props.showPicInPost, () => {
//     if (props.showPicInPost) {
//         isShowPicInPost.value = true
//     } else {
//         isShowPicInPost.value = false
//     }
// })
function showUserAndPost(logUserId, postUserId) {
    console.log('login userId=' + logUserId)
    console.log('post userId=' + postUserId)
}
function reportPostSwal(postId) {
    Swal.fire({
        title: "Report Reason",
        showCloseButton: true,
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: "Check",
        input: 'select',
        inputOptions: {
            '1': 'Junk messages垃圾訊息',
            '2': 'Insults or harmful content謾罵或有害內容',
            '3': 'Inappropriate advertisements不適當的廣告',
            '4': 'Self-harm and impersonation自殘和冒充他人',
            '5': 'Other其他',
        },
        inputPlaceholder: 'please choose reason',
    }).then(async (res) => {
        if (res.isConfirmed) {
            console.log('res', res)
            console.log('res', res.value)
            let result = await reportPost(postId, res.value)

            if (result != null) {
                Swal.fire({
                    title: "Report this Post successfully",
                    text: 'Thank for your Response!',
                    icon: 'success',
                    showCloseButton: true,
                    confirmButtonText: "OK"
                })
            }
        } else {
            Swal.close();
        }
    })
}
async function reportPost(postId, reasonId) {
    console.log('進入到reportPost')
    console.log('postId', postId)
    console.log('userId', localStorage.getItem("userId"))
    console.log('reasonId', reasonId)
    let result;
    await axiosHelper.post(baseUrl + addReportUrl, {
        postId: postId,
        userId: localStorage.getItem("userId"),
        reasonId: reasonId
    }).then((res) => {
        console.log('res', res.data)
        result = res.data
    }).catch((err) => {
        console.log('err', err)
        if (err.response.status == 403) {
            Swal.fire({
                title: "Double Report",
                text: 'You have reported this report',
                icon: 'warning',
                showCloseButton: true
            })
        }
    })
    return result;
}
async function showTagPost(tagName, tagId) {
    console.log('tagName', tagName)
    console.log('tagId', tagId)
    console.log('showTagPost')
    await router.push({ path: '/frontstage/forum/tag/' + tagId + '/' + tagName });
}
async function showUserProfile(profileUserId) {
    await router.push({ path: '/frontstage/forum/profile/' + profileUserId });
    location.href = "#"
}
const isHovered = ref(false);
const stayHover = ref(false)
function handleMouseOver(targetOrWindow) {
    // console.log('移動進來了')
    isHovered.value = true;
    stayHover.value = true;
    // console.log(targetOrWindow)
    // console.log('isHovered', isHovered.value)
    // console.log('stayHover', stayHover.value)
}
async function handleMouseLeave(targetOrWindow) {
    // console.log('移動出去了')
    await setTimeout(() => {
        isHovered.value = false;
    }, 400)
    stayHover.value = false;
    //     console.log(targetOrWindow)
    //     console.log('isHovered', isHovered.value)
    //     console.log('stayHover', stayHover.value)
}
</script>
<style scoped>
* {
    /* border: solid 1px; */
    box-sizing: border-box;
    font-size: 30px;
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

.commentBtn:hover {
    color: #1f9eff;
    background-color: #a8d9ff;
}

.commentBtn:active .activeIcon {
    transition: 0.5s;
    transform: scale(150%);
}

.likeBtn:hover {
    color: #ff226f;
    background-color: #ffa4a9;
}

.likeBtn:active .activeIcon {
    transition: 0.5s;
    transform: translateY(-1rem) scale(150%);
}

.forwardBtn:hover {
    color: #1ee6a3;
    background-color: #a6ffe1;
}

.forwardBtn:active .activeIcon {
    transition: 0.5s;
    transform: scale(150%) rotate(360deg);
}

.collectBtn:hover {
    color: #6500a8;
    background-color: #dfaeff;
}

.collectBtn:active .activeIcon {
    transition: 0.5s;
    transform: scale(150%);
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
    background-color: rgb(255, 248, 248);
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
    margin: 0 1rem 0 1rem;
    padding: 1rem;
    /* border: solid 1px gray; */
    border-radius: 1rem;
    background-color: rgb(255, 255, 255);
    color: black;
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
    cursor: pointer;
}

.postTags {
    display: flex;
}

.publicStatus {
    background-color: #157d9f;
    position: absolute;
    height: 4rem;
    width: 10rem;
    border-radius: 3rem;
    right: 0;
    padding: 0.5rem;
    margin: 1rem 1rem;
    transition: 0.5s;
}

.privateStatus {
    background-color: rgb(202, 59, 76);
}

.publicStatusDot {
    border-radius: 50%;
    height: 3rem;
    width: 3rem;
    position: absolute;
    margin: 0.25rem;
    transition: 0.5s;
    top: 0.1rem;
}

.publicStatusDotCss {
    background-color: #8cd5ff;
    left: 0;
}

.privateStatusDotCss {
    background-color: #ffcbcb;
    transform: translateX(6rem);
}

.onephotoContainer {
    background-color: #ff525a;
    position: relative;
    width: 100%;
    height: 400px;
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
    grid-auto-rows: 200px;
}

.threePhotoContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 200px;
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
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    border: 3px solid white;
    color: white;
    font-size: larger;
}

.whenNoPhotos {
    height: 5rem;
}

.mytooltip {
    width: 50rem;
    /* height: fit-content; */
    position: absolute;
    top: 0;
    left: -50%;
    /* padding: 5px; */
    transform: translateY(-105%);
    border-radius: 1rem;
    box-shadow: 3px 3px 3px rgb(120, 120, 120);
    z-index: 100;
}
</style>