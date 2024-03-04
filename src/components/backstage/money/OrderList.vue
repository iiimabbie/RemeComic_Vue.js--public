<script setup>
import {defineProps, onMounted, ref} from 'vue';
import moment from "moment";
import httpClient from "@/main";

const props = defineProps(['orderId', 'accountId', 'episodeId', 'orderDate', 'dueDate', 'price']);
const username = ref('');
const comicTitle = ref('');

// Fetch Data

onMounted(() => {
  findUsernameByAccountId(props.accountId);
  getSimpleEpisodeById(props.episodeId);
})

/**
 * 時間格式轉成 YYYY/MM/DD HH:mm:ss
 * @param dateString
 * @returns {string}
 */
const formatDate = (dateString) => {
  console.log(dateString);
  const date = moment(dateString);

  return date.format('YYYY/MM/DD HH:mm:ss');
};

async function findUsernameByAccountId(accountId) {
  const url = `/money/account/username/find/account?accountId=${accountId}`;

  try {
    const response = await httpClient.get(url);

    username.value = response.data.name;
  } catch (error) {
    console.log(error);
  }
}

async function getSimpleEpisodeById(episodeId) {
  const url = `/money/orders/ComicTitle/findByEpisode?episodeId=${episodeId}`;

  try {
    const response = await httpClient.get(url);

    console.log(response);
    console.log(response.data);
    console.log(response.data.comicTitle);

    comicTitle.value = response.data.comicTitle;
  } catch (error) {
    console.log(error);
  }
}

</script>

<template>
<!--  <table class="table table-striped">-->

<!--    <thead>-->
<!--    <tr>-->
<!--      <th>OrderId</th>-->
<!--      <th>AccountId</th>-->
<!--      <th>EpisodeId</th>-->
<!--      <th>OrderDate</th>-->
<!--      <th>DueDate</th>-->
<!--      <th>Price</th>-->
<!--    </tr>-->
<!--    </thead>-->

    <tbody>
    <tr>
      <td>{{ orderId }}</td>
<!--      <td>{{ accountId }}</td>-->
      <td>{{ username }}</td>
      <td>{{ comicTitle }}</td>
      <td>{{ formatDate(orderDate) }}</td>
      <td>{{ formatDate(dueDate) }}</td>
      <td>{{ price }}</td>
    </tr>
    </tbody>

<!--  </table>-->
</template>

<style scoped>

</style>