<template>
    <div v-show="!showCommentPage">
        <h2 style="text-align: center;padding-top: 1rem;">Main Post Wall</h2>
        <NewPostNav :nowView="'Follow'" />
    </div>
    <PostWall :targetPostsUrl="'/post/follow/show/new'" :hadeAddPostSection="true" @isShowComment="getIsShowComment"
        @backFromComment="getBackFromComment" />
</template>
<script setup>
import { onActivated, onDeactivated, ref } from 'vue';
import PostWall from "@/components/frontstage/forum/PostWall.vue"
import NewPostNav from '@/components/frontstage/forum/NewPostNav.vue';
import AddPost from "@/components/frontstage/forum/AddPost.vue";
import { useRouter } from 'vue-router';

const showCommentPage = ref(false)
function getIsShowComment(check) {
    showCommentPage.value = check;
}
function getBackFromComment(check) {
    showCommentPage.value = false
}
onActivated(() => {
    console.log('onActivated')
})
onDeactivated(() => {
    console.log('onDeactivated')
})

</script>
<style scoped></style>