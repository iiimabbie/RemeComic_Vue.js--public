<script setup>
import {defineProps, ref, defineEmits} from 'vue';
import moment from "moment";
import httpClient from "@/main";
import Swal from "sweetalert2";

defineProps(['promotionId', 'promotionName', 'promotionDesc', 'promotionStartDate', 'promotionEndDate'])
const emits = defineEmits(["updateByEditOrDelete"]);

// Function Area

async function editPromotion(promotionId, promotionName, promotionDesc) {
  const {value: formValues} = await Swal.fire({
    title: 'Edit Promotion',
    html:
        `<input id="promotionName" class="swal2-input" placeholder="${promotionName}">` +
        `<input id="promotionDesc" class="swal2-input" placeholder="${promotionDesc}">`,
    focusConfirm: false,
    preConfirm: () => {
      return {
        promotionName: document.getElementById('promotionName').value,
        promotionDesc: document.getElementById('promotionDesc').value
      };
    }
  });

  if (formValues) {
    console.log('Promotion Name:', formValues.promotionName);
    console.log('Promotion Description:', formValues.promotionDesc);

    const url = "/money/promotion/update?promotionId=" + promotionId;

    try {
      await httpClient.put(url, {
        "promotionName": formValues.promotionName,
        "promotionDesc": formValues.promotionDesc,
        "startDate": "2023-11-30T09:59:16.879+0800",
        "endDate": "2023-11-30T09:59:16.879+0800"
      });

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Promotion updated successfully',
      });

      console.log('Promotion updated successfully')
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating the promotion',
      });

      console.log('Promotion updated unsuccessfully', error.message);
    }

    renew(1);
  }
}

async function deletePromotion(promotionId) {
  // const url = "/money/promotion/delete?promotionId=" + promotionId;
  //
  // try {
  //   await httpClient.delete(url);
  //
  //   console.log('Promotion deleted successfully');
  // } catch (error) {
  //   console.log(error);
  // }

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this promotion!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (result.isConfirmed) {
    const url = `/money/promotion/delete?promotionId=${promotionId}`;

    try {
      await httpClient.delete(url);

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Promotion deleted successfully',
      });

      console.log('Promotion deleted successfully');
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while deleting the promotion',
      });

      console.log(error);
    }

    renew(1);
  }
}

function renew(something) {
  emits('updateByEditOrDelete', something);
}

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
  <!--  <table class="table table-striped">-->
  <!--    <thead>-->
  <!--    <tr>-->
  <!--      <th>PromotionId</th>-->
  <!--      <th>PromotionName</th>-->
  <!--      <th>PromotionDescription</th>-->
  <!--      <th>PromotionStartDate</th>-->
  <!--      <th>PromotionEndDate</th>-->
  <!--      <th>Actions</th>-->
  <!--    </tr>-->
  <!--    </thead>-->
  <tbody>
  <tr>
    <!--      <td>{{ promotionId }}</td>-->
    <td>{{ promotionName }}</td>
    <td>{{ promotionDesc }}</td>
    <td>{{ formatDate(promotionStartDate) }}</td>
    <td>{{ formatDate(promotionEndDate) }}</td>
    <td>
      <!-- Route to Edit Page -->
      <!--        <router-link to="/backstage/money/promotion/update" class="btn btn-primary">Edit</router-link>-->
      <button @click="editPromotion(promotionId, promotionName, promotionDesc)" class="btn btn-primary">Edit</button>
      <!-- Delete Specific Promotion -->
      <button @click="deletePromotion(promotionId)" class="btn btn-danger">Delete</button>
    </td>
  </tr>
  </tbody>
  <!--  </table>-->
</template>

<style scoped>

</style>