<script setup>

import LineChart from "@/components/backstage/money/LineChart.vue";
import httpClient from "@/main";
import {onMounted, reactive, ref} from "vue";
import moment from "moment";
import {useLoading} from "vue-loading-overlay";

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const data = [150, 230, 224, 218, 135, 147, 260];
const memoLabels = ref([]);
const memoData = ref([]);
const isShow = ref(false);
const {loading, show} = useLoading();

// Fetch Data

onMounted(async () => {
  await getOrderDate();
  isShow.value=true;
})

async function getOrderDate() {
  const url = "/money/order/findDateAndTotal";

  try {
    const response = await httpClient.get(url);

    console.log(response.data)
    if (typeof response.data === 'object') {
      const dataArray = Object.entries(response.data);


      dataArray.forEach(([dateString, amount]) => {
        const formattedDate = convertDate(new Date(dateString));

        if (!memoLabels.value.includes(formattedDate)) {
          memoLabels.value.push(formattedDate);
          memoData.value.push(amount);
        }
      });
    } else {
      console.error('Response data is not an object:', response.data);
    }

    console.log(memoLabels.value);
    console.log(memoData.value);
    console.log(data);
  } catch (error) {
    // console.log(error);
  }
}
console.log("memoOutside", memoData.value);
console.log("memoLabel", memoLabels.value);
function convertDate(orderDate) {
  return moment(orderDate).format('MM/DD');
}

</script>

<template>
  <LineChart v-if="isShow"
      :labels="memoLabels"
      :data="memoData"
  />

<!--  v-if="isShow"-->
</template>

<style scoped>

</style>