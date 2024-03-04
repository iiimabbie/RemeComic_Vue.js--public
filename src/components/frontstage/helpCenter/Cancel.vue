<template>
  <button type="button" class="btn btn-outline-secondary" @click="goQuestion">Cancel</button>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goQuestion = () => {
  router.push('/frontstage/help/home')
}
</script>

<style scoped>

</style>