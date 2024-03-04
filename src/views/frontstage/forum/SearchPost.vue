<template>
    <div v-show="!showCommentPage">
        <h2 style="text-align: center;padding-top: 1rem;">Search：{{ searchStringRef }}</h2>
        <div class="choosePostBar">
            <nav>
                <ul style="border-radius: 1rem;overflow: hidden;">
                    <li v-for="profileView in profileNav">
                        <span @click="changeViewShow(profileView, $event)" :class="{ nowView: profileView == nowView }">{{
                            profileView }}</span>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    <PostWall :targetPostsUrl="getTagUrl" :searchString="searchStringRef" :hadeAddPostSection="true"
        @isShowComment="getIsShowComment" @backFromComment="getBackFromComment" />
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, defineProps, computed, ref, nextTick, watch } from 'vue';

import PostWall from "@/components/frontstage/forum/PostWall.vue"

const props = defineProps(['searchString'])

const profileNav = ['Hot', 'New'];
const nowView = ref('Hot');
const getTagUrl = ref("/post/show/search/hot")

const searchStringRef = ref("");


onMounted(() => {
    searchStringRef.value = props.searchString;
})

async function changeViewShow(targetView, event) {
    nowView.value = targetView

    if (targetView == 'Hot') {
        getTagUrl.value = '/post/show/search/hot';

    } else if (targetView == 'New') {
        getTagUrl.value = '/post/show/search/new';

    }
    location.href = "#";
}

const showCommentPage = ref(false)
function getIsShowComment(check) {
    showCommentPage.value = check;
}
function getBackFromComment(check) {
    showCommentPage.value = false
}

watch(() => [props.searchString], () => {
    searchStringRef.value = props.searchString;
})

onMounted(() => {
    console.log('periodNumber', props.periodNumber)
})

onActivated(() => {
    console.log('onActivated')
})
onDeactivated(() => {
    console.log('onDeactivated')
})

</script>
<style scoped>
.choosePostBar ul {
    display: flex;
    list-style-type: none;
    padding-left: 0;
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
</style>