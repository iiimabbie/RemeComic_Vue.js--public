<template>
  <div>
    <button class="btn btn-outline-warning btn-sm" @click="responseReport(props.params.data.reportId)">
      Response
    </button>
  </div>
</template>

<script setup>
const props = defineProps(["params"]);

const responseReport = () => {
  props.params.context.responseBtn(props.params.data.reportId);
  console.log("props.params: " + props.params.data.reportId);
}
</script>

<style scoped></style>
