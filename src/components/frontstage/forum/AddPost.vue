<template>
    <div class="addPostSection" @click="isAddingPost">
        <span style="color: #ff525a;" v-if="postContentIsEmpty">please write your post text!</span>


        <div class="allInput">
            <!-- <div class="inputTextSection"> -->
            <!-- 貼文文字內容 -->
            <div class="postText" contenteditable="true" @input="updatePostContent" data-text="what do you want to say"
                ref="editableContent"></div>


            <!-- 貼文標籤(編輯狀態) -->
            <div class="postTags" style="display: flex;text-align: center;" v-if="tagShowList.length > 0">

                <div
                    style="display: flex;flex-wrap: wrap;padding: 0.25rem;border-radius: 1rem;width: 500px;align-items: center;">
                    <span v-for="tag in tagShowList" class="tagCss">
                        #{{ tag }}&nbsp;
                        <div class="closeTagBtn" @click="removeShowTag(tag)">
                            <font-awesome-icon :icon="['fas', 'circle-xmark']"
                                style="width:1.5rem;height: 1.5rem;cursor: pointer;" />
                        </div>
                    </span>
                </div>

            </div>

            <div class="addPhotoSection" v-if="imgShowUrlList.length > 0">
                <!-- 貼文圖片(編輯狀態) -->
                <div :class="{ photos: true, whenNoPhotos: imgShowUrlList.length <= 0 }"
                    style="margin-top:0.25rem;display: flex;flex-direction: row;background-color: #1f1e1e;position: relative;padding: 0.25rem;flex-wrap: wrap;border-radius: 1rem;">
                    <font-awesome-icon :icon="['fas', 'image']"
                        style="color: #efe6e6;position: absolute;width: 3rem;height: 3rem;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" />
                    <input ref="fileInput" type="file" name="fileField" accept="image/*" @change="showUpload" multiple
                        style="opacity: 0;background-color: #ff525a;position: absolute;width: 100%;height: 100%;">
                    <div v-for="(imgUrl, index) in imgShowUrlList" style="position: relative;margin: 0.5rem;">
                        <img :src="imgUrl" style="width: 5rem;height: 5rem;border-radius: 30%;object-fit: cover;" />
                        <div class="closeImgBtn" @click="removeShowImg(imgUrl)">
                            <font-awesome-icon :icon="['fas', 'circle-xmark']" style="width:25px;height: 25px;" />
                        </div>
                    </div>

                </div>
            </div>

            <!-- </div> -->

        </div>
        <!-- 貼文輸入搜索+選單 -->
        <div class="postTagsOptions" v-if="isAddTag" style="padding: 0.5rem;">

            <datalist id="options0">
                <div v-for="tag in tagOptionsList">
                    <option v-if="!tagShowList.includes(tag.tagName)">
                        {{ tag.tagName }}
                    </option>
                </div>
            </datalist>
            <input v-model="searchString" type="text" id="input0" list="options0" @input="searchForaddTag"
                @keyup.enter="addTag" class="inputTag" placeholder="want's the tag name you want to add"
                style="width: 100%;padding: 0 0.5rem 0 0.5rem;">
        </div>

        <div style="display: flex;position: relative;">
            <div class="addRemindIconCircle">
                <font-awesome-icon :icon="['fas', 'hashtag']" class="addRemindIcon" @click="showAddTagSection" />
                <button @click="(isAddTag = !isAddTag)"
                    style="opacity: 0;background-color: #ff525a;position: absolute;width: 100%;height: 100%;"></button>
            </div>
            <div class="addRemindIconCircle">
                <font-awesome-icon :icon="['fas', 'image']" class="addRemindIcon" @click="showAddPhotosSection" />
                <input ref="fileInput" type="file" name="fileField" accept="image/*" @change="showUpload" multiple
                    style="opacity: 0;background-color: #ff525a;position: absolute;width: 100%;height: 100%;">
            </div>
            <div :class="{ publicStatus: true, privateStatus: postPublicStatus == 'private' }"
                style="position: absolute;right: 0;" @click="changePublicStatus(post)">
                <div
                    :class="{ publicStatusDot: true, publicStatusDotCss: postPublicStatus == 'public', privateStatusDotCss: postPublicStatus == 'private' }">
                </div>
                <span v-if="postPublicStatus == 'public'"
                    style="position: relative;left: 40px;top:0.25rem;color: white;">public</span>
                <span v-if="postPublicStatus == 'private'"
                    style="position: relative;left: 5px;top:0.25rem;color: white;">private</span>
            </div>
        </div>


        <div class="publicStatusSetSection">
            <!-- 儲存編輯狀態&取消 & 更改貼文公開狀態 -->
            <div class="editHelper" style="position: relative;display: flex;padding: 0.25rem;justify-content: center;">
                <button @click="cancelUplaodPost" style="background-color: rgb(107, 153, 173);">CLEAR</button>
                <button @click="addPost" style="background-color: rgb(39, 185, 248);">POST</button>
            </div>
        </div>
        <!-- <div class="postBtn">
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Understood</button>
            </div>
        </div> -->
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch, defineProps, defineEmits, nextTick } from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from 'axios';
import { useRouter } from 'vue-router';
import { forumStore } from '@/stores/forum.js';
import Swal from 'sweetalert2';

const props = defineProps(['addCommentParentPostId'])
const emit = defineEmits([])

const store = forumStore();
const router = useRouter();

const textContent = ref("");
const postPublicStatus = ref("public");

const editableContent = ref("")


//小工具們╰(*°▽°*)╯

const axiosHelper = axios.create({
    withCredentials: true
})
const baseUrl = 'http://localhost:8080/remecomic'
const searchTagForAddUrl = '/tag/show/search/addInPost'
const addPostBodyUrl = '/post/add'

const post = ref({})

const imgShowUrlList = ref([]);//展示在ui畫面上的圖片(此陣列包含firebase連結+地端圖片連結)
const imgSendToBackend = ref([]);//要送到後端的圖片連結(此陣列專門存取firebase連結)
const imgSendToFirebaseFiles = ref({})//要傳到firebase儲存的圖片
const imgToDeleteUrl = ref([]) //要傳送到firebase去刪除的圖片連結

const fileInput = ref(null)
const tagOptionsList = ref([])
const searchString = ref("")
const tagShowList = ref([])//展示在UI畫面上的tag
const isAddTag = ref(false);
const postOriginalContent = ref("")
const postOriginalPublicStatus = ref("")
const start = ref(0);

const loginUserId = ref(1)

onMounted(() => {
    if (localStorage.getItem("userId")) {
        loginUserId.value = localStorage.getItem("userId")
    }

})


function isAddingPost(event) {
    console.log('新增貼文區塊被點擊了!');
    console.log('事件對象：', event);
}
function editPostComputed(photos) {
    // console.log('isEdit', isEdit.value)
    // isEdit.value = true
    console.log('photos', photos)
    for (const photoEle of photos) {
        //原有的圖片連結(此陣列專門存取firebase連結)
        imgSendToBackend.value.push(photoEle.photo);
        console.log('photo', photoEle.photo)
    }
    imgToDeleteUrl.value = []
    // console.log('isEdit', isEdit.value)
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
    if (postPublicStatus.value == 'public') {
        postPublicStatus.value = 'private'
    } else {
        postPublicStatus.value = 'public'
    }
}

function cancelUplaodPost() {
    // isEdit.value = false;
    isAddTag.value = false;

    imgSendToBackend.value = []
    imgSendToFirebaseFiles.value = []
    imgToDeleteUrl.value = []
    imgShowUrlList.value = []
    tagShowList.value = []
    editableContent.value.innerText = ""
    post.value.postContent = postOriginalContent.value
    post.value.publicStatus = postOriginalPublicStatus.value
    postPublicStatus.value = 'public'
    start.value = 0;

    for (const photoEle of post.value.photos) {
        //展示在ui畫面上的圖片(此陣列包含firebase連結+地端圖片連結)
        imgShowUrlList.value.push(photoEle.photo);
    }
    for (const tagEle in post.value.postTagMap) {
        tagShowList.value.push(post.value.postTagMap[tagEle])
    }
}
const toCommentPostIdParam = ref(null);
const groupIdParam = ref(null)

const addPost = async (event) => {

    if (textContent.value == "") return
    //修改UI畫面
    // isEdit.value = false
    isAddTag.value = false;
    // 上傳圖片到filebase
    //遍歷所有上傳檔案
    try {
        // 先更新貼文內容
        await updatePostContent(event);

        // 先儲存到firebase，獲得firebase的圖片url
        await uplaodPostToFirebase();

        //如果貼文的公開狀態有改，再送往後端資料
        // if (post.value.publicStatus != postOriginalPublicStatus.value) {
        console.log('editableContent', editableContent.value.innerText)

        console.log('postPublicStatus', postPublicStatus.value)
        let paramsSetting;
        if (props.addCommentParentPostId) {
            // 先設好基本params
            paramsSetting = {
                'postContent': editableContent.value.innerText,
                'postUserId': loginUserId.value,
                'publicStatus': postPublicStatus.value,
                'toCommentPostId': props.addCommentParentPostId
            }
        } else {
            // 先設好基本params
            paramsSetting = {
                'postContent': editableContent.value.innerText,
                'postUserId': loginUserId.value,
                'publicStatus': postPublicStatus.value
            }
        }

        //如果該貼文為回覆
        if (toCommentPostIdParam.value) {
            paramsSetting['toCommentPostId'] = toCommentPostIdParam.value;
        }
        //如果標籤不為空
        if (tagShowList.value.length != 0) {
            paramsSetting['tagArray'] = Array.from(tagShowList.value).join(',');
        }
        //如果圖片不為空
        if (imgSendToBackend.value.length != 0) {
            paramsSetting['photoArray'] = Array.from(imgSendToBackend.value).join(',');
        }
        //如果該貼文並非群組貼文
        if (groupIdParam.value) {
            paramsSetting['groupId'] = groupIdParam.value;
        }

        axiosHelper.post(baseUrl + addPostBodyUrl, paramsSetting)
            .then(res => {

                // alert('已新增貼文!')
                Swal.fire({
                    title: "已新增貼文",
                    icon: 'success',
                    showCloseButton: false, // 預設顯示在右上角的關閉按鈕
                    showConfirmButton: false,
                })


                console.log(res.data)
                post.value = res.data
                imgSendToBackend.value = []
                imgShowUrlList.value = []
                tagShowList.value = []
                editableContent.value.innerText = ""
                postPublicStatus.value = "public";
                textContent.value = "";
                start.value = 0
                //確認更新後的貼文公開狀態，決定是否在畫面上隱藏
                // if (post.value.publicStatus == 'private') {
                //     postAfterEditPublicStatus.value = false;
                // }
                location.reload();

            }).catch(err => {
                Swal.fire({
                    title: props.addCommentParentPostId ? "新增評論失敗" : "新增貼文失敗",
                    icon: 'error',
                    showCloseButton: false, // 預設顯示在右上角的關閉按鈕
                    showConfirmButton: false,
                })
                console.log(err)
            })
        // }


        //傳送到後端更新post資料
        // console.log('postId', postId)
        console.log('postContent', post.value.postContent)
        console.log('tagArray', Array.from(tagShowList.value))
        console.log('photoArray', Array.from(imgSendToBackend.value))
        // //更新貼文
        // axiosHelper.put(baseUrl + updatePostBodyUrl, {
        //     // params: {
        //     postId: postId,
        //     postContent: post.value.postContent,
        //     tagArray: tagShowList.value.length != 0 ? Array.from(tagShowList.value).join(',') : null,
        //     photoArray: imgSendToBackend.value.length != 0 ? Array.from(imgSendToBackend.value).join(',') : null
        //     // }
        // }).then((res) => {
        //     console.log(res.data)
        //     post.value = res.data
        //     imgSendToBackend.value = []

        // }).catch(err => {
        //     console.log(err)
        // })
    } catch (err) {
        console.log(err)
    }

}

async function uplaodPostToFirebase() {
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
        const id = `${i}_${Date.now()}_${file.name}`;

        const imgRef = storageRef(defaultStorage, `images/${id}`);
        console.log('img id', `images/${id}`)

        try {
            const uplaodTask = uploadBytesResumable(imgRef, file);
            await uplaodTask;
            //alert('上傳成功');
            const url = await getDownloadURL(imgRef);
            imgSendToBackend.value.push(url);

            deleteImgs()
        } catch (err) {
            console.log(err)
            //alert('上傳失敗');
        }
        imgToDeleteUrl.value = []
    }
}
async function updatePostContent(event) {
    console.log('start', start.value)
    start.value = 1
    if (event && event.target) {
        editableContent.value = event.target.innerText;
        textContent.value = event.target.innerText; // 更新 component 中的 data 屬性
        console.log('content', textContent.value);
    } else {
        console.error('Event or event.target is undefined');
    }
}
function removeShowImg(imgUrl) {
    const deleteImgIndex = imgShowUrlList.value.indexOf(imgUrl);
    imgShowUrlList.value.splice(deleteImgIndex, 1);
    if (imgSendToBackend.value.indexOf(imgUrl) != -1) {
        imgSendToBackend.value.splice(imgSendToBackend.value.indexOf(imgUrl), 1);

        imgToDeleteUrl.value.push(imgUrl)
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
        //alert('tag 重複了!')
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
    console.log("start", start.value)
    if (start.value == 0) {
        return false;
    } else {
        return textContent.value === ""
    }

})

import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { event } from 'jquery';
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
    for (let i = 0; i < imgToDeleteUrl.value.length; i++) {
        const imgRef = storageRef(defaultStorage, `${imgToDeleteUrl.value[i]}`);
        deleteObject(imgRef)
            .then(() => {
                // alert('圖片已刪除');
            }).catch((err) => {
                // alert('圖片刪除失敗', err)
            })
    }
}

const isShowAddTagSection = ref(false)
const isShowAddPhotosSection = ref(false)
function showAddTagSection() {
    isShowAddTagSection.value = !isShowAddTagSection.value
}
function showAddPhotosSection() {
    isShowAddTagSection.value = !isShowAddTagSection.value
}
</script>
<style scoped>
* {
    /* border: solid 1px; */
    box-sizing: border-box;
}

.addPostSection {
    background-color: lightblue;
    /* padding: 2rem; */
    border-radius: 1rem;
    /* margin: 1rem; */
}

.inputTextSection {
    background-color: brown;
    margin: 0.25rem 0 0.25rem 0;
    padding: 0.25rem;
    border-radius: 10px;
    /* height: 100px; */
}

.allInput {
    background-color: white;
    margin: 0.25rem 0 0.25rem 0;
    padding: 0.25rem;
    border-radius: 10px;
}

.postText {
    /* background-color: rgb(198, 170, 170); */
    height: fit-content;
    /* border: 1px solid black; */
    margin: 0.25rem 0 0.25rem 0;
    padding: 0.25rem;
    border-radius: 10px;
    color: black;
    outline: none;
    font-size: 28px;
}

.postText[contentEditable=true]:empty:before {
    content: attr(data-text);
    color: rgb(45, 132, 160);
    cursor: text;
}

.addTagSection {
    /* background-color: aqua; */

}

.addPhotoSection {
    /* background-color: blue; */

}

.photos {
    /* height: 3rem; */
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

.closeTagBtn {
    display: flex;
    justify-content: center;
    align-items: center;
}

.inputTag {
    outline-color: lightblue;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    border-color: lightblue;
    color: rgb(0, 89, 255);
}

.publicStatusSetSection {
    /* background-color: blueviolet; */
}

.publicStatus {
    background-color: #157d9f;
    position: absolute;
    height: 3rem;
    width: 7rem;
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
    height: 2rem;
    width: 2rem;
    position: absolute;
    margin: 0.25rem;
    transition: 0.5s;
    top: 0.25rem;
}

.publicStatusDotCss {
    background-color: #8cd5ff;
    left: 0;
}

.privateStatusDotCss {
    background-color: #ffcbcb;
    transform: translateX(3.75rem);
}

.postBtn {
    /* background-color: rebeccapurple; */
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

.modalSection {
    z-index: 999 !important;
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

.addRemindIconCircle {
    padding: 1rem;
    border-radius: 50%;
    width: 4rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5rem;
    position: relative;
}

.addRemindIconCircle:hover {
    background-color: #bbebff;
    cursor: pointer;
    box-shadow: 0 0 2px 2px rgb(254, 255, 255);
}

.addRemindIconCircle:active {
    background-color: #8fddff;
    cursor: pointer;
    box-shadow: 0 0 2px 2px rgb(242, 250, 255);
}

.addRemindIcon {
    width: 3rem;
    height: 3rem;
}
</style>