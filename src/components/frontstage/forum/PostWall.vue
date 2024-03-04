<template>
    <div class="wallSection" ref="scrollTrigger" v-show="!showCommentPage">
        <div v-if="!hadeAddPostSection">
            <AddPost :addCommentParentPostId="addCommentParentPostId" style="padding: 1rem;margin: 1rem;" />
        </div>
        <div v-if="allPosts && allPosts.length != 0" v-for="post in allPosts">
            <div
                v-if="(post.parentPostDtoList && post.parentPostDtoList.length == 0) || getPostUrl == '/post/show/comment'">
                <OnePost :id="post.postId" ref="postRef" class="singlePost"
                    v-show="hiddenPost[post.postId] && (blockPosts[post.postId] == undefined || blockPosts[post.postId])"
                    :key="post.postId" :propsPost.sync="post" :loginUserId="loginUserId" :postIndexInPostWall="post.postId"
                    @deletePost="getDeletePostId" @commentShowPost1="getCommentShowPost1"
                    @windowScrollY1="getWindowScrollY1" @picShowPost1="getPicShowPost1" @picIndex1="getPicIndex1" />
            </div>
            <div v-else class="commentSection">

                <button type="button" class="showParentBtn" @click="changeHidden(post.postId, post.parentPostDtoList)">
                    <span v-if="isHiddenParentPost[post.postId]">Expand More
                        <font-awesome-icon :icon="['fas', 'play']" rotation=270 /></span>
                    <span v-if="!isHiddenParentPost[post.postId]">Close Show
                        <font-awesome-icon :icon="['fas', 'play']" rotation=90 /></span>
                </button>

                <div v-for="parentPost in reverseList(post.parentPostDtoList)" class="commentPostContainer">
                    <OnePost :id="post.postId + '-' + parentPost.postId" ref="postRef" class="commentPost"
                        v-show="hiddenParentPost[post.postId + '-' + parentPost.postId] && (blockPosts[parentPost.postId] == undefined || blockPosts[parentPost.postId])"
                        :key="post.postId + '-' + parentPost.postId" :propsPost.sync="parentPost" :parentText="'hey'"
                        :loginUserId="loginUserId" :postIndexInPostWall="post.postId" @deletePost="getDeletePostId"
                        @commentShowPost1="getCommentShowPost1" @windowScrollY1="getWindowScrollY1"
                        @picShowPost1="getPicShowPost1" @picIndex1="getPicIndex1" />
                </div>

                <OnePost :id="post.postId" ref="postRef" class="commentShowPost"
                    v-show="hiddenPost[post.postId] && (blockPosts[post.postId] == undefined || blockPosts[post.postId])"
                    :key="post.postId" :propsPost.sync="post" :loginUserId="loginUserId" :postIndexInPostWall="post.postId"
                    @deletePost="getDeletePostId" @commentShowPost1="getCommentShowPost1"
                    @windowScrollY1="getWindowScrollY1" @picShowPost1="getPicShowPost1" @picIndex1="getPicIndex1" />

            </div>
        </div>
    </div>
    <div v-if="showPicPage">
        <NewBigPic :picIndex="picIndexRef" :picPost="picPostRef" @closeWindow="getClose" />
    </div>
    <div v-if="showCommentPage">
        <PostCommemt :picShowPost2="picPostRef" :loginUserId="1" class="postAndCommentShow" :state="'comment'"
            @backFromComment="getBackFromComment" />
    </div>
</template>
<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick, toRaw } from 'vue';
import axios from 'axios';
import OnePost from '@/components/frontstage/forum/OnePost.vue';
import { post } from 'jquery';
import NewBigPic from '@/views/frontstage/forum/NewBigPic.vue';
import PostCommemt from '@/views/frontstage/forum/NewComment.vue';
import AddPost from "@/components/frontstage/forum/AddPost.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps(['loginUserId', 'targetPostsUrl', 'commentsBelongPostId', 'backToWindowScrollY', 'backToOriginalPostId', 'isShowComment', 'mainPostShowPiWcindowPost', 'mainPostShowPicWindowPicIndex', 'periodNumber', 'hadeAddPostSection', 'addCommentParentPostId', 'tagId', 'profileUserId', 'searchString'])
const emit = defineEmits(['commentShowPost2', 'windowScrollY2', 'picShowPost2', 'picIndex2', 'isShowComment', 'backFromComment'])

const allPosts = ref([]);        // 所有貼文數據
const displayedPosts = ref([])  // 目前顯示的貼文
const frontCurrentPage = ref(1)     // 當前頁碼
const postsPerPage = ref(5)    // 每頁顯示的貼文數量
const backCurrentPage = ref(0);
const backTotalPage = ref(0);
const isBottom = ref(true);
const scrollTrigger = ref(null);

const hiddenPost = ref({});
const hiddenParentPost = ref({});
const blockPosts = ref({})

const goBackScrollY = ref(0);
const currentPostId = ref(null);
const postRef = ref(null);

const hadeAddPostSection = ref(false)

const isShowCommentRef = ref(false);
watch(() => props.isShowComment, () => {
    console.log('change can load')
    if (props.isShowComment) {
        isShowCommentRef.value = true
    } else {
        isShowCommentRef.value = false
    }
    console.log('isShowCommentRef', isShowCommentRef.value)
})
const isHiddenParentPost = ref({});
function changeHidden(postId, parentPostDtoList) {
    nextTick(() => {
        console.log('postId', postId)
        for (const parentPost of parentPostDtoList) {
            console.log('result be', hiddenParentPost.value[postId + '-' + parentPost.postId])
            console.log('postId=' + postId + ',parentPost.postId=' + parentPost.postId)
            hiddenParentPost.value[postId + '-' + parentPost.postId] = !hiddenParentPost.value[postId + '-' + parentPost.postId]
            console.log('result af', hiddenParentPost.value[postId + '-' + parentPost.postId])
        }
    })
    console.log('change before isHiddenParentPost', isHiddenParentPost.value)
    isHiddenParentPost.value[postId] = !isHiddenParentPost.value[postId];
    console.log('change after isHiddenParentPost', isHiddenParentPost.value)
}

//小工具們╰(*°▽°*)╯
const axiosHelper = axios.create({
    withCredentials: true
})
const baseUrl = 'http://localhost:8080/remecomic'
const getPostUrl = ref("");
const reverseList = (parentPostDtoList) => {
    if (parentPostDtoList) {
        return parentPostDtoList.slice().reverse();
    } else {
        return parentPostDtoList;
    }

}

async function checkAndLoadMorePosts() {
    // console.log('load more!!1')
    const scrollBottom = scrollTrigger.value ? scrollTrigger.value.getBoundingClientRect().bottom : 0;
    // console.log('load more!!1')
    // 判斷是否滑到頁面底端
    if (scrollBottom <= window.innerHeight) {
        // console.log('backCurrentPage', backCurrentPage.value)
        // console.log('backTotalPage', backTotalPage.value)
        // console.log('isBottom', isBottom.value)
        console.log('load more!!2')
        if (backCurrentPage.value < backTotalPage.value && isBottom.value) {
            console.log('load more!!3')
            await getPosts();
        }
    }
}
onMounted(async () => {
    console.log('periodNumber', props.periodNumber)
    getPostUrl.value = props.targetPostsUrl
    console.log('post wall getPostUrl', getPostUrl.value)
    if (props.hadeAddPostSection) {
        hadeAddPostSection.value = props.hadeAddPostSection
    }
    nextTick(async () => {
        if (!avoidDoubleWatch.value) {
            console.log('props.propsPost', props.propsPost);
            try {
                // 等待getPosts完成
                await getPosts();

                // 初始化加載第一頁貼文
                // 監聽滾動事件
                window.addEventListener("scroll", checkAndLoadMorePosts);

            } catch (error) {
                console.error('Error during initialization:', error);
            }
        }

    });

    // 秀出html&body滾動條
    const hideScrollStyle = document.getElementById('hideScrollStyle');
    if (hideScrollStyle) {
        document.head.removeChild(hideScrollStyle);
    }
    document.body.style.overflow = 'auto';
    // 恢復原來的 scroll-behavior
    document.documentElement.style.scrollBehavior = '';

    showPicPage.value = false;

})

onBeforeUnmount(() => {
    // 移除滾動事件監聽
    window.removeEventListener("scroll", checkAndLoadMorePosts);
});

async function getPosts() {

    // 在此設定傳送參數：
    let paramsSetting;
    if (getPostUrl.value == '/post/follow/show/new' || getPostUrl.value == '/post/show/new') {
        paramsSetting = {
            userId: localStorage.getItem("userId"), //user id 從session裡面得到
            pageNumber: backCurrentPage.value + 1
        };
    } else if (getPostUrl.value == '/post/show/hot') {
        console.log('periodNumber', props.periodNumber)
        paramsSetting = {
            userId: localStorage.getItem("userId"), //user id 從session裡面得到
            pageNumber: backCurrentPage.value + 1,
            periodNumber: props.periodNumber
        };
    } else if (getPostUrl.value == '/post/profile/show' || getPostUrl.value == '/post/profile/show/photo' || getPostUrl.value == '/post/profile/show/comment' || getPostUrl.value == '/post/profile/show/like' || getPostUrl.value == '/post/profile/show/collect') {
        console.log("進入到profilegetPost")
        console.log('periodNumber', props.periodNumber)
        console.log('loginUserId', localStorage.getItem("userId"));
        paramsSetting = {
            loginUserId: localStorage.getItem("userId"), //user id 從session裡面得到
            pageNumber: backCurrentPage.value + 1,
            profileUserId: props.profileUserId ? props.profileUserId : localStorage.getItem("userId")
        };
    } else if (getPostUrl.value == '/post/show/private') {
        console.log("進入到privatePost")
        paramsSetting = {
            loginUserId: localStorage.getItem("userId"),
            pageNumber: backCurrentPage.value + 1,
        };
    } else if (getPostUrl.value == '/post/tag/show/hot') {
        console.log("進入到獲得hot tag的post")
        console.log('userId', localStorage.getItem("userId"))
        console.log('tagId', props.tagId)
        console.log('pageNumber', backCurrentPage.value + 1)
        console.log('periodNumber', 100)
        paramsSetting = {
            userId: localStorage.getItem("userId"),
            tagId: props.tagId,
            pageNumber: backCurrentPage.value + 1,
            periodNumber: 100
        };
    } else if (getPostUrl.value == '/post/tag/show/new') {
        console.log("進入到獲得new tag的post")
        paramsSetting = {
            userId: localStorage.getItem("userId"),
            tagId: props.tagId,
            pageNumber: backCurrentPage.value + 1,
        };
    } else if (getPostUrl.value == '/post/show/search/hot') {
        console.log("進入到獲得hot search的post")
        console.log('loginUserId', localStorage.getItem("userId"))
        console.log('searchString', props.searchString)
        console.log('pageNumber', backCurrentPage.value + 1)
        console.log('periodNumber', 100)
        paramsSetting = {
            loginUserId: localStorage.getItem("userId"),
            searchString: props.searchString,
            pageNumber: backCurrentPage.value + 1,
            periodNumber: 100
        };
    } else if (getPostUrl.value == '/post/show/search/new') {
        console.log("進入到獲得new search的post")
        paramsSetting = {
            loginUserId: localStorage.getItem("userId"),
            searchString: props.searchString,
            pageNumber: backCurrentPage.value + 1,
        };
    }

    if (getPostUrl.value != '/post/show/comment' && !isShowCommentRef.value) {
        console.log('enter getPost get follow post')
        isBottom.value = false;
        console.log('loginUserId', localStorage.getItem("userId"));
        await axiosHelper.get(baseUrl + getPostUrl.value, { params: paramsSetting })
            .then(res => {
                console.log('post', res.data.content)
                isBottom.value = true;
                if (res.data.content != undefined && res.data.content != null) {
                    allPosts.value = allPosts.value.concat(res.data.content)
                    backCurrentPage.value = res.data.number + 1
                    backTotalPage.value = res.data.totalPages
                    // console.log('post backCurrentPage', backCurrentPage.value)
                    // console.log('post backTotalPage', backTotalPage.value)
                    for (const post of res.data.content) {
                        if (hiddenPost.value[post.postId] == undefined) {
                            hiddenPost.value[post.postId] = true;
                        }
                        isHiddenParentPost.value[post.postId] = true;
                        for (const pareent of post.parentPostDtoList) {
                            if (hiddenParentPost.value[post.postId + '-' + pareent.postId] == undefined) {
                                hiddenParentPost.value[post.postId + '-' + pareent.postId] = false;
                            }
                        }
                    }
                    // console.log('hiddenPost', hiddenPost.value)
                    // console.log('hiddenParentPost', hiddenParentPost.value)

                }

            }).catch(err => {
                console.log(err)
            })
    } else if (getPostUrl.value === '/post/show/comment') {
        console.log('enter getPost get comment post')
        console.log('props.commentsBelongPostId=', props.commentsBelongPostId)
        console.log('url', baseUrl + getPostUrl.value)
        console.log('backCurrentPage.value', backCurrentPage.value)
        // console, log('userId=' + props.loginUserId + ';pageNumber=' + (backCurrentPage.value + 1) + ';postId=' + props.commentsBelongPostId)
        if (props.commentsBelongPostId) {
            isBottom.value = false;

            axiosHelper.get(baseUrl + getPostUrl.value, {
                params: {
                    userId: localStorage.getItem("userId"), //user id 從session裡面得到
                    pageNumber: backCurrentPage.value + 1,
                    postId: props.commentsBelongPostId
                }
            })
                .then(res => {
                    console.log('comment', res.data.content)
                    isBottom.value = true;
                    if (res.data.content != undefined && res.data.content != null) {
                        allPosts.value = allPosts.value.concat(res.data.content)
                        backCurrentPage.value = res.data.number + 1
                        backTotalPage.value = res.data.totalPages
                        // console.log('comment backCurrentPage', backCurrentPage.value)
                        // console.log('comment backTotalPage', backTotalPage.value)
                        for (const post of res.data.content) {
                            if (hiddenPost.value[post.postId] == undefined) {
                                hiddenPost.value[post.postId] = true;
                            }
                            // for (const pareent of post.parentPostDtoList) {
                            //     if (hiddenParentPost.value[post.postId + '-' + pareent.postId] == undefined) {
                            //         hiddenParentPost.value[post.postId + '-' + pareent.postId] = false;
                            //     }
                            // }
                        }
                        // console.log('hiddenPost', hiddenPost.value)
                        // console.log('hiddenParentPost', hiddenParentPost.value)

                    }
                }).catch(err => {
                    console.log(err)
                })
        }


    }
}
function getDeletePostId(postId) {
    if (blockPosts.value[postId] == undefined) {
        blockPosts.value[postId] = false;
        console.log('blockPosts', blockPosts.value)
    }
    for (const key in hiddenParentPost.value) {

        const [, parentPostId] = key.split('-');
        if (parentPostId == postId) {
            console.log('key', key)
            console.log('hiddenParentPost.value[key]', hiddenParentPost.value[key])
            console.log('hiddenParentPost.value[key]', hiddenParentPost.value[key])
        }

    }
}
const showCommentPage = ref(false)
function getCommentShowPost1(post) {
    console.log('(post wall)show commemt post id:' + post.postId)
    // emit('commentShowPost2', post)
    picPostRef.value = post;
    showCommentPage.value = true;
    emit('isShowComment', true)
}

const windowScrollYRef = ref(0);
function getWindowScrollY1(windowScrollY) {

    // emit('windowScrollY2', windowScrollY)
    windowScrollYRef.value = windowScrollY;
    console.log('windowScrollYRef:' + windowScrollYRef.value)
}

// watch(() => props.backToWindowScrollY, (newVal) => {
//     // console.log('watch!!')
//     if (newVal) {
//         console.log('watch into!!')
//         // const currentPost = document.getElementById(currentPostId.value);
//         // if (currentPost) {
//         //     currentPost.scrollIntoView({
//         //         behavior: 'smooth'
//         //     })
//         // }
//         windowScrollYRef.value = newVal;
//         console.log('backToWindowScrollY', newVal)
//         // setTimeout(function () {
//         //     window.scrollTo({
//         //         top: props.backToWindowScrollY,
//         //         behavior: 'auto'
//         //     })
//         //     console.log('scroll!!!')
//         // }, 0);

//     }
// });
const showPicPage = ref(false)
const picPostRef = ref({});
const picIndexRef = ref(0);
function getPicShowPost1(picPost) {
    // emit('picShowPost2', picPost)
    picPostRef.value = picPost
    showPicPage.value = true;

    // 隱藏html&body滾動條
    const hideScrollStyle = document.getElementById('hideScrollStyle');
    if (!hideScrollStyle) {
        const style = document.createElement('style');
        style.id = 'hideScrollStyle';
        style.textContent = 'html { scroll-behavior: auto !important; }';
        document.head.appendChild(style);
    }
    document.body.style.overflow = 'hidden';
}
function getPicIndex1(picIndex) {
    // emit('picIndex2', picIndex)
    picIndexRef.value = picIndex;

}
watch(() => props.mainPostShowPiWcindowPost, () => {
    getPicIndex1(props.mainPostShowPicWindowPicIndex)
    getPicShowPost1(props.mainPostShowPiWcindowPost);

})

function getBackFromComment() {
    console.log('back from comment')
    showCommentPage.value = false;

    console.log('backToWindowScrollY', windowScrollYRef.value)
    setTimeout(function () {
        window.scrollTo({
            top: windowScrollYRef.value,
            behavior: 'auto'
        })
        console.log('scroll!!!')
    }, 0);

    emit('backFromComment', true)
}
function getClose() {
    // 秀出html&body滾動條
    const hideScrollStyle = document.getElementById('hideScrollStyle');
    if (hideScrollStyle) {
        document.head.removeChild(hideScrollStyle);
    }
    document.body.style.overflow = 'auto';
    // 恢復原來的 scroll-behavior
    document.documentElement.style.scrollBehavior = '';

    showPicPage.value = false;
}
const avoidDoubleWatch = ref(false);
watch(() => [props.commentsBelongPostId, props.periodNumber, props.tagId, props.targetPostsUrl, props.profileUserId, props.searchString], async () => {

    console.log('watch到變更')
    console.log('avoidDoubleWatch', avoidDoubleWatch.value)
    if (avoidDoubleWatch.value) {
        console.log('return 回去!')
        return
    }
    avoidDoubleWatch.value = true;

    backCurrentPage.value = 0;
    allPosts.value = [];
    hiddenPost.value = {};
    getPostUrl.value = props.targetPostsUrl
    console.log('post wall getPostUrl', getPostUrl.value)
    console.log('in wall find change,change post id=', props.commentsBelongPostId)
    try {
        // 等待getPosts完成
        await getPosts();

        // 初始化加載第一頁貼文
        // 監聽滾動事件
        console.log('get comment!')
        window.addEventListener("scroll", checkAndLoadMorePosts);
    } catch (error) {
        console.error('Error during initialization:', error);
    }
    avoidDoubleWatch.value = false;

    // // 秀出html&body滾動條
    // const hideScrollStyle = document.getElementById('hideScrollStyle');
    // if (hideScrollStyle) {
    //     document.head.removeChild(hideScrollStyle);
    // }
    // document.body.style.overflow = 'auto';
    // // 恢復原來的 scroll-behavior
    // document.documentElement.style.scrollBehavior = '';

    // showPicPage.value = false;
})
</script>
<style scoped>
.wallSection {
    position: relative;
}

.showParentBtn {
    width: 100%;
    /* margin: 0 1rem; */
    padding: 1rem;
    font-size: 30px;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
    color: rgb(141, 0, 0);
    border-color: rgb(141, 0, 0);
    margin-bottom: 1rem;
    outline-color: rgb(141, 0, 0);
}

.showParentBtn:hover {
    background-color: rgb(177, 177, 177);
}

.commentSection {
    background-color: rgb(141, 0, 0);
    border-radius: 1rem;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

.commentPost,
.commentShowPost {
    position: relative;
}

.commentPostContainer:nth-child(2)>.commentPost::before {
    /* background-color: aqua; */
    content: '';
    width: 10px;
    height: 90%;
    background-color: #cd3a00;
    display: block;
    position: absolute;
    left: 40px;
    top: 100px;
}

.commentPost {
    border-bottom: 5px solid rgb(141, 0, 0);
    /*overflow: hidden;*/
}

.commentPost::before {
    /* background-color: aqua; */
    content: '';
    width: 10px;
    height: 100%;
    background-color: #cd3a00;
    display: block;
    position: absolute;
    left: 40px;
    /* top: 100px; */
}

.commentPost::after {
    /* background-color: aqua; */
    content: '';
    width: 30px;
    height: 30px;
    background-color: #ff4b04;
    display: block;
    position: absolute;
    left: 40px;
    top: 100px;
    border-radius: 50%;
    transform: translateX(-35%) translateY(-50%);
    border: white solid 2px;
}

.commentShowPost::before {
    /* background-color: aqua; */
    content: '';
    width: 10px;
    height: 100px;
    background-color: #cd3a00;
    display: block;
    position: absolute;
    left: 40px;
}

.commentShowPost::after {
    /* background-color: aqua; */
    content: '';
    width: 30px;
    height: 30px;
    background-color: #ff4b04;
    display: block;
    position: absolute;
    left: 40px;
    top: 100px;
    border-radius: 50%;
    transform: translateX(-35%) translateY(-50%);
    border: white solid 2px;
}

.singlePost {
    /* background-color: blue; */
    margin-bottom: 1rem;
}
</style>