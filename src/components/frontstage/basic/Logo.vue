<template>
    <a class="brand" href="http://localhost:5173/frontstage/home">
        <img :src="logo.url" :alt="logo.imageTitle">
    </a>
</template>

<script setup>
import Images from '@/assets/Images.json'
const logo = Images.find(image => image.imageId == 1);
</script>

<style>
.brand>img{
    width:110px;

}
</style>