<template>
  <button class="btn btn-outline-warning btn-sm" @click="updateBtn(props.params.data.helpId)"> Update </button>
</template>

<script setup>
import { defineProps } from 'vue';
import httpClient from '@/main.js';
import Swal from "sweetalert2";
import Question from '@/views/backstage/helpCenter/TableQA.vue';

const props = defineProps(["params"]);

const updateBtn = async (id) => {
    const warning = await Swal.fire({
      title: "Are you sure ?",
      text: "You will not be able to recover this question !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF0000",
      cancelButtonColor: "#CA8EFF",
      confirmButtonText: "Yes, update it !",
    });

    if(warning.isConfirmed){
      console.log(props.params.data);
      await httpClient.post(`/helpcenter/question/update?id=${id}&category=${props.params.data.category}&question=${props.params.data.question}&answer=${props.params.data.answer}`)
      .then((response) => {
        console.log(response)
        Swal.fire({
        icon: "success",
        title: "Success",
        text: "Update Success !",
      }).then(result => {
        props.params.context.updateBtnRefresh();
      });
      })
      .catch(error => console.log(error))

    }
}

</script>

<style scoped>

</style>