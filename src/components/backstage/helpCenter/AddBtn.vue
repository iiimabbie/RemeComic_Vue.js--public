<template>
  <div>
    <button type="button" class="btn btn-outline-primary" @click="addQA">
      ADD QA
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import httpClient from "@/main.js";

const router = useRouter();

const addQA = () => {
  router.push("/backstage/help/add");
};
</script>

<style></style>
