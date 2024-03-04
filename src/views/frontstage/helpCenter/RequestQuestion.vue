<template>
  <div class="bg-local">
    <Header />
    <br />
    <main class="container bgc-white radius10px">
      <br />
      <h1>Report</h1>
      <div class="outline">
        <!-- 會員ID -->
        <div class="mb-3">
          <label for="inputUser" class="form-label">User: </label>
          <input
            type="text"
            class="form-control"
            id="inputUser"
            v-model="userName"
            disabled
          />
        </div>
        <!-- 問題大綱 -->
        <div class="mb-3">
          <label for="inputTitle" class="form-label">Title: </label>
          <input
            type="text"
            class="form-control"
            id="inputTitle"
            v-model="reportTitle"
          />
        </div>
        <!-- 問題分類 -->
        <div class="mb-3">
          <label for="inputCategory" class="form-label">Category: </label>
          <select
            class="form-select"
            aria-label="Default select example"
            id="inputCategory"
            v-model="reportCategory"
          >
            <option :value="null" disabled>Please Select One</option>
            <option v-for="option in options" :key="option.value" :value="option.value" >
            {{ option.label }}
            </option>
          </select>
        </div>
        <!-- 問題發生時間 -->
        <div class="mb-3">
          <label for="inputDate" class="form-label">Time: </label>
          <input
            type="datetime-local"
            class="form-control"
            id="inputDate"
            v-model="reportDate"
          />
        </div>
        <!-- 問題內容 -->
        <div class="mb-3">
          <label for="inputContent" class="form-label">Content: </label>
          <textarea
            type="text"
            class="form-control"
            id="inputContent"
            v-model="reportContent"
            style="height: 100px"
          />
        </div>
        <!-- 問題圖片上傳 -->
        <div class="mb-3">
          <label for="inputPic" class="form-label">Picture: </label>
          <input type="file" class="form-control" id="inputPic" ref="filePic" @change="uploadPic"/>
        </div>
        <div v-if="base64Pic">
          <img style="max-width: 500px" :src="base64Pic" alt="Picture" />
        </div>
        <br />
        <!-- 按鈕 -->
        <div class="flex">
          <div class="c30">
            <button type="button" class="btn btn-outline-primary" @click="addReport">Submit</button>
            <CancelBtn />
          </div>
          <div class="c30">
            <button type="button" class="btn btn-outline-warning white" @click="clickInput">One-click input</button>
            <button type="button" class="btn btn-outline-danger" @click="resetBtn">Reset</button>
          </div>
        </div>
      </div>
    </main>
    <br />
    <br />
  </div>
</template>

<script setup>
import { ref } from "vue";
import httpClient from "@/main.js";
import Swal from "sweetalert2";
import Header from "@/components/frontstage/basic/FrontstageHeader.vue";
import CancelBtn from "@/components/frontstage/helpCenter/Cancel.vue";

const reportTitle = ref("");
const reportContent = ref("");
const reportDate = ref();
const filePic = ref(null);
const base64Pic = ref(null);
const reportCategory = ref(null)

const userName = localStorage.getItem("userName");
const userId = localStorage.getItem("userId");

const uploadPic = () => {
  console.log(filePic.value.files[0]);
  const file = filePic.value.files[0];

  if(file){
    const reader = new FileReader();
  
    reader.onload = () => {
      base64Pic.value = reader.result;
      // console.log(base64Pic.value);

    }
  
    reader.readAsDataURL(file);
  }else{
    console.error("圖片沒有上傳成功");
  }
}

const addReport = async () => {
  const warning = await Swal.fire({
      title: "Are you sure ?",
      text: "You will not be able to recover this question !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF0000",
      cancelButtonColor: "#CA8EFF",
      confirmButtonText: "Yes, report it !",
    });

  if(warning.isConfirmed){
    if(!filePic.value || !filePic.value.files[0]){
      return;
    }
  
    httpClient.post("/helpcenter/report/add" ,{
      userId : userId,
      userName : userName,
      reportDate : reportDate.value,
      reportTitle : reportTitle.value,
      reportContent : reportContent.value,
      reportPhoto : base64Pic.value.split(",")[1],
      reportStatus : 1,
      category : reportCategory.value,
    })
    .then((response) => {
      console.log(response)
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Report Success",
      })
    .then(result => {
        resetBtn();
    })
    })
    .catch((err) => console.log(err))

  }

}

const options = [
  {value : 1, label: "Comic"},
  {value : 2, label: "User"},
  {value : 3, label: "Money"},
  {value : 4, label: "Promotion"},
  {value : 5, label: "Order"},
  {value : 6, label: "Reading"},
]

  const clickInput = () => {
    reportTitle.value = "Cannot Access Website";
    reportContent.value = "I am unable to access the website. The page does not load, and I receive an error message.";
  }

const resetBtn = () => {
  reportTitle.value = "";
  reportDate.value = "";
  reportContent.value = "";
  filePic.value.value = null;
  base64Pic.value = "";
}
</script>

<style scoped>
*{
box-sizing: border-box;
padding: 0;
max-width: 100%;
overflow-x: hidden;
}
h1{
  overflow: hidden;
}
.white:hover{
  color: #fff;
}
.bg-local {
  min-height: 932px;
  background-color: #000;
}
.black {
  background-color: #000;
}
.font-white {
  color: #fff;
}
.bgc-white {
  background-color: #fff;
}
.outline {
  border: 1px solid #fff;
  border-radius: 10px;
  padding: 20px;
}
.flex {
  display: flex;
  justify-content: space-between;
}
.radius10px {
  border-radius: 10px;
}
.c30 {
  display: inline-flex;
  column-gap: 50px;
}
</style>
