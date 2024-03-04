<template>
  <a class="forumBar" href="/frontstage/forum/home">
    <img :src="post.url" :alt="post.imageTitle">
  </a>
</template>

<script setup>
import Images from '@/assets/Images.json'
const post = Images.find(image => image.imageId == 12);
</script>

<style scoped>
.forumBar>img {
  width: 40px;
}
</style>