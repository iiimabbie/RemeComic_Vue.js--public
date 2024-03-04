<template>
    <div class="postDetailPage">
        <div v-show="!showCommentPage">
            <button @click="backFromComment" v-if="showPicInPostComputed"
                style="padding: 1rem;border-radius: 1rem;font-size: 30px;">GO
                BACK</button>
            <h2 style="text-align: center;padding-top: 1rem;">Comment</h2>

            <OnePost :key="picShowPost2.postId" :propsPost.sync="picShowPost2" :showPicInPost="showPicInPostComputed"
                :loginUserId="1" @picShowPost1="getPicShowPost1" @picIndex1="getPicIndex1" />
        </div>
        <PostWall :targetPostsUrl="'/post/show/comment'" :commentsBelongPostId="picShowPost2.postId" :loginUserId="1"
            @isShowComment="getIsShowComment" :mainPostShowPiWcindowPost="mainPostShowPiWcindowPost"
            :mainPostShowPicWindowPicIndex="mainPostShowPiWcindowPicIndex" @backFromComment="getBackFromComment"
            :addCommentParentPostId="picShowPost2.postId" />
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch, onUpdated } from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import OnePost from '@/components/frontstage/forum/OnePost.vue';
import PostWall from "@/components/frontstage/forum/PostWall.vue"
import SelfOnePost from '@/components/frontstage/forum/OnePost.vue';

const props = defineProps(['commentShowPost3', 'windowScrollY3', 'loginUserId', 'picShowPost2', 'state'])
const emit = defineEmits(['deletePost', 'goBackScrollY', 'picShowPost3', 'picIndex3', 'picWindowShowStatus', 'commentPostShow', 'backFromComment'])

onMounted(() => {
    console.log('picShowPost2 postId', props.picShowPost2.postId)
    console.log('picShowPost2', props.picShowPost2)
})

const showMainPostPic = ref(false)

const showCommentPage = ref(false)

function getIsShowComment(check) {
    showCommentPage.value = check;
}
const showPicInPostComputed = computed(() => {
    if (props.state == 'comment') {
        return true
    } else {
        return false
    }
})
const mainPostShowPiWcindowPost = ref({});
const mainPostShowPiWcindowPicIndex = ref(0);
function getPicShowPost1(picPost) {
    mainPostShowPiWcindowPost.value = picPost
}
function getPicIndex1(picIndex) {
    mainPostShowPiWcindowPicIndex.value = picIndex
}
function backFromComment() {
    emit('backFromComment', true)

}
function getBackFromComment(check) {
    showCommentPage.value = false;
}

// const windowScrollYRef = ref(0);

// function getWindowScrollY2(windowScrollY) {
//     console.log('windowScrollY:' + windowScrollY)
//     windowScrollYRef.value = windowScrollY;
// }
</script>
<style scoped></style>