<template>
  <div>
    <h2>Create Question And Answer</h2>
    <br />
    <!-- Question -->
    <div class="mb-3">
      <label for="InputQuestion" class="form-label">Question: </label>
      <input
        type="text"
        class="form-control"
        id="InputQuestion"
        v-model="question"
      />
    </div>
    <!-- Answer -->
    <div class="mb-3">
      <label for="InputAnswer" class="form-label">Answer: </label>
      <input
        type="text"
        class="form-control"
        id="InputAnswer"
        v-model="answer"
      />
    </div>
    <!-- Category -->
    <div class="mb-3">
      <label for="inputCategory" class="form-label">Category: </label>
      <select class="form-select" aria-label="Default select example" id="inputCategory" v-model="category">
        <option :value="null" disabled>Please Select One</option>
            <option v-for="option in options" :key="option.value" :value="option.value" >
            {{ option.label }}
        </option>
      </select>
    </div>
    <br />
    <div class="flex c30">
      <button type="submit" class="btn btn-outline-primary" @click="addQuestion">
        Submit
      </button>
      <button type="button" class="btn btn-outline-warning white" @click="clickInput">One-click input</button>
      <!-- <Cancel /> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import Cancel from "@/components/backstage/helpCenter/CancelToQA.vue";
import httpClient from "@/main.js";
import Swal from "sweetalert2";

const question = ref("");
const answer = ref("");
const category = ref(null);

const addQuestion = () => {
  // console.log(question.value);
  httpClient
    .post("/helpcenter/question/add", {
      question: question.value,
      answer: answer.value,
      category: category.value,
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  clearInput();

  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Add Success",
  }).then((result) => {});
};

const handleCancelBtn = () => {
}

const gridOptions = {
  components: {
    cancel: Cancel,
  },
  context: {
    cancel: handleCancelBtn
  },
};

const clickInput = () => {
  question.value = "How can I register a new account?";
  answer.value = 'You can click on the "Register" link on the homepage, then fill in the required information to create a new account.';
}

// 清除表格內文字
function clearInput() {
  question.value = "";
  answer.value = "";
  category.value = "";
}

const options = [
  {value : 1, label: "Comic"},
  {value : 2, label: "User"},
  {value : 3, label: "Money"},
  {value : 4, label: "Promotion"},
  {value : 5, label: "Order"},
  {value : 6, label: "Reading"},
]
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
}
.white:hover{
  color: #fff;
}
.c30 {
  column-gap: 30px;
}
</style>
