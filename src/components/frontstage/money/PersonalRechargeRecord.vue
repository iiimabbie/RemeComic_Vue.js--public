<script setup>
import {defineProps} from 'vue';
import moment from "moment";

defineProps(['rechargeId', 'accountId', 'rechargeAmount', 'rechargeDate', 'coinType'])

/**
 * 時間格式轉成 YYYY/MM/DD HH:mm:ss
 * @param dateString
 * @returns {string}
 */
const formatDate = (dateString) => {
  // console.log(dateString);
  const date = moment(dateString);

  return date.format('YYYY/MM/DD HH:mm:ss');
};

</script>

<template>
  <tbody>
  <tr>
    <td>{{ rechargeId }}</td>
    <td>{{ accountId }}</td>
    <td>{{ rechargeAmount }}</td>
    <td>{{ formatDate(rechargeDate) }}</td>
    <td>{{ coinType }}</td>
  </tr>
  </tbody>
</template>

<style scoped>

</style>