<template>
    <div v-show="!showCommentPage">
        <h2 style="text-align: center;padding-top: 1rem;">Hot Post</h2>
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
    <PostWall :targetPostsUrl="'/post/show/hot'" :periodNumber="periodNumberCommputed" :hadeAddPostSection="true"
        @isShowComment="getIsShowComment" @backFromComment="getBackFromComment" />
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, defineProps, computed, ref } from 'vue';
import AddPost from "@/components/frontstage/forum/AddPost.vue";
import PostWall from "@/components/frontstage/forum/PostWall.vue"

const props = defineProps(['periodNumber'])

const profileNav = ['Day', 'Week', 'Month', 'All'];
const nowView = ref('Day');

const periodNumberRef = ref(1);

async function changeViewShow(targetView, event) {
    nowView.value = targetView
    console.log('nav view & periodNumber', periodNumberRef.value)
    if (targetView == 'Day') {
        periodNumberRef.value = 1
    } else if (targetView == 'Week') {
        periodNumberRef.value = 7
    } else if (targetView == 'Month') {
        periodNumberRef.value = 30
    } else if (targetView == 'All') {
        periodNumberRef.value = 100
    }
    location.href = "#";
}

const periodNumberCommputed = computed(() => {
    console.log('periodNumber', periodNumberRef.value)
    return periodNumberRef.value;
})
const showCommentPage = ref(false)
function getIsShowComment(check) {
    showCommentPage.value = check;
}
function getBackFromComment(check) {
    showCommentPage.value = false
}
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