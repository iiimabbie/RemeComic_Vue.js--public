<template>
    <h2 style="text-align: center;padding-top: 1rem;">Private Post</h2>
    <PostWall :targetPostsUrl="'/post/show/private'" :hadeAddPostSection="true" />
</template>
<script setup>
import { onActivated, onDeactivated } from 'vue';
import PostWall from "@/components/frontstage/forum/PostWall.vue"

onActivated(() => {
    console.log('onActivated')
})
onDeactivated(() => {
    console.log('onDeactivated')
})

</script>
<style scoped></style>