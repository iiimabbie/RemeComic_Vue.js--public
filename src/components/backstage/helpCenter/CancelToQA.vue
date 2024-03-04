<template>
  <div>
    <button type="button" class="btn btn-outline-primary" @click="cancelQA">
      Cancel
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import httpClient from "@/main.js";
import { defineProps } from 'vue';

const props = defineProps(["params"]);

const cancelQA = () => {
  // props.params.context.cancel();
  console.log(props.params);
};
</script>

<style></style>
