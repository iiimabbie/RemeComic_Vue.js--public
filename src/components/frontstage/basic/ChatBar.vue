<script setup>

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useRouter} from "vue-router";

const router = useRouter();

const goToChat = () => {
  console.log("clicked me")
  router.push("/frontstage/money/chat");
}
</script>

<template>
  <button class="comment" type="button" @click="goToChat">
    <font-awesome-icon :icon="['fas', 'comment']"/>
  </button>
</template>

<style scoped>
.comment {
  color: white;
  font-size: 18px;
  background-color: transparent;
  border: none;
  width: 20px;
}

</style>