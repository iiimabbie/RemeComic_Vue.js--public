<script setup>
import httpClient from "@/main";
import {defineProps, onMounted, ref} from "vue";
import moment from "moment";

const props = defineProps(['episodeId', 'buyOutOrNot', 'price']);
const userId = ref('');

// Fetch Data
onMounted(() => {
  createOrder();
})

async function createOrder() {
  const url = `/money/orders/create?userId=${userId}`;

  try {
    await httpClient.post(url, {
      "episodeId": props.episodeId,
      "dueDate": formatDate(changeBuyOutOrNotToDueDate(props.buyOutOrNot)),
      "price": props.price
    })
  } catch (error) {
    console.log(error);
  }
}

function changeBuyOutOrNotToDueDate(buyOutOrNot) {
  let currentDate = new Date();

  if (buyOutOrNot) {
    return currentDate.setFullYear(currentDate.getFullYear() + 100);
  } else {
    return currentDate.setFullYear(currentDate.getFullYear() + 1);
  }
}

/**
 * 時間格式轉成 YYYY/MM/DD HH:mm:ss
 * @param dateString
 * @returns {string}
 */
const formatDate = (dateString) => {
  const date = moment(dateString);

  return date.format('YYYY/MM/DD HH:mm:ss');
}

</script>

<template>

</template>

<style scoped>

</style>