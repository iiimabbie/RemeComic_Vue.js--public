<template>
  <button
    class="btn btn-outline-danger btn-sm"
    @click="delBtn(props.params.data.helpId)"
  >
    Delete
  </button>
</template>

<script setup>
import { defineProps } from "vue";
import httpClient from "@/main.js";
import Swal from "sweetalert2";

const props = defineProps(["params"]);

const delBtn = async (id) => {

  const warning = await Swal.fire({
    title: "Are you sure ?",
    text: "You will not be able to recover this question !",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF0000",
    cancelButtonColor: "#CA8EFF",
    confirmButtonText: "Yes, delete it !",
  });

  if (warning.isConfirmed) {
    await httpClient
      .delete(`/helpcenter/question/delete?id=${id}`)
      .then((response) => {
        console.log(response)
        Swal.fire({
        icon: "success",
        title: "Success",
        text: "Delete Success !",
      }).then(result => {
       props.params.context.delBtnRefresh();
      });
      })
      .catch((error) => console.log(error));
      
      
  }
};
</script>

<style></style>
