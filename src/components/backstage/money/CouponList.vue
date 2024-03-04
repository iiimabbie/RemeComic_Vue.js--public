<script setup>
import {defineProps, onMounted, ref} from 'vue';
import moment from "moment";
import httpClient from "@/main";

const props = defineProps(['couponId', 'userId', 'promotionId', 'couponCode', 'couponCoin', 'start', 'expired', 'isUsed']);
const username = ref('');
const promotionName = ref('');

// Fetch Date

onMounted(() => {
  findUsernameByUserId(props.userId);
  findMoneyPromotionNameByPromotionId(props.promotionId);
})

/**
 * 時間格式轉成 YYYY/MM/DD HH:mm:ss
 * @param dateString The date we send.
 * @returns {string} Give us the formatted date.
 */
const formatDate = (dateString) => {
  const date = moment(dateString);

  return date.format('YYYY/MM/DD HH:mm:ss');
};

/**
 * Upon the userId is passed here, we can find its own username by this function.
 * @param userId
 * @returns {Promise<void>}
 */
async function findUsernameByUserId(userId) {
  const url = `/user/simpleuser/${userId}`;

  try {
    const response = await httpClient.get(url);

    console.log(response);
    console.log(response.data);

    username.value = response.data.name;
  } catch (error) {
    console.log(error);
  }
}

async function findMoneyPromotionNameByPromotionId(promotionId) {
  const url = `/money/promotion/findName?promotionId=${promotionId}`;

  try {
    const response = await httpClient.get(url);

    console.log(response);
    console.log(response.data);

    promotionName.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

</script>

<template>
  <tbody>
  <tr>
<!--    <td>{{ userId }}</td>-->
    <td>{{ username }}</td>
    <td>{{ promotionName }}</td>
    <td>{{ couponCode }}</td>
    <td>{{ couponCoin }}</td>
    <td>{{ formatDate(start) }}</td>
    <td>{{ formatDate(expired) }}</td>
    <td>{{ isUsed }}</td>
  </tr>
  </tbody>
</template>

<style scoped>

</style>