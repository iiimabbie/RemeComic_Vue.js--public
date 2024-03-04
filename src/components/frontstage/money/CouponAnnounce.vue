<script setup>
import httpClient from "@/main";
import {onMounted, ref} from "vue";
import Swal from "sweetalert2";
import moment from "moment/moment";

const couponList = ref([]);
const startList = ref([]);
const expiredList = ref([]);
const couponCodeList = ref([]);

onMounted(() => {
  getAllCoupon();
})

async function getAllCoupon() {
  const url = "/money/couponCodes/findAll";

  try {
    const response = await httpClient.get(url);

    couponList.value = response.data;

    const sortedCoupons = response.data.sort((a, b) => new Date(a.start) - new Date(b.start));

    console.log(sortedCoupons[sortedCoupons.length - 1]);

    couponCodeList.value = sortedCoupons[sortedCoupons.length - 1]


    let timerInterval;
    Swal.fire({
      title: "Congrats!🎉",
      html: `👉Get Coupon Now!👍👍👍<br/>
                <div>Code: ${couponCodeList.value.couponCode}</div>`,
      timer: 10000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

const formatDate = (dateString) => {
  const date = moment(dateString);

  return date.format('YYYY/MM/DD HH:mm:ss');
};

</script>

<template>

</template>

<style scoped>

</style>