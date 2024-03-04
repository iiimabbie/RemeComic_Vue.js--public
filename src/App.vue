<template>
  <router-view />
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goToFrontstage = () => {
  router.push('/frontstage/home');
}
const goToBackstage = () => {
  router.push('/backstage/home');
}
</script>

<style>
/* *{
  color:white;
} */
</style>
