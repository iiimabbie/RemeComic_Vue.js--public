<template>
  <div class="bg-local">
   <Header />
   <br />
   <main class="bgc-black">
   

    <div class="justify">
  <div class="bg center">

    <br><br><h1>Add Comic Info</h1>
  <form @submit.prevent="uploadcomicInfo"><br><br>

    <label for="comicName" class="form-label">Comic Name:</label>
    <input v-model="orgComicDto.comicName" id="comicName" required class="form-control input justify"/><br><br>

    <label for="orgComicCover" class="form-label">Comic Cover:</label>
    <input type="file" name="fileField" accept="image/*" ref="orgComicCover" class="form-control input justify"/><br><br>

    <label for="introduction" class="form-label">Introduction:</label>
    <textarea v-model="orgComicDto.introduction" id="introduction" required class="form-control Introductioninput justify"></textarea><br><br>

    <label for="userId" class="form-label">User ID:</label>
    <input v-model="orgComicDto.userId" id="userId" required class="form-control input justify"/><br><br>


    <label for="genreid">Genre ID:</label>
    <select class="form-select" v-model="orgComicDto.genreid" name="genre">
   <option value="1">romance</option>
   <option value="2">action</option>
   <option value="3">comedy</option>
   <option value="4">thriller</option>
   <option value="5">life</option>
   <option value="6">drama</option>
   <option value="7">fantasy</option>
   <option value="9">TeenageGirl</option>
   <option value="15">adventure</option>
</select><br><br>

    <label for="orgPublishDate" class="form-label">Publish Date:</label>
    <input type="date" v-model="orgComicDto.orgPublishDate" id="orgPublishDate" readonly class="form-control input justify"/><br><br>

    <button type="submit" class="btn btn-outline-primary">Add Comic</button><br><br>

  </form>

</div>
    </div>
</main>

</div>

</template>

<script setup>

import { ref } from 'vue';
import 'bootstrap-datepicker';
import axios from 'axios'
import Header from "@/components/frontstage/basic/FrontstageHeader.vue";
import { v4 as uuidv4 } from 'uuid';

const orgComicCover = ref([])
const orgComicDto = ref({
comicName: '',
orgComicCover: '',
orgPublishDate: new Date().toISOString().split('T')[0],
introduction: '',
userId: '',
verify: '4',
comicId: '',
genreid: '',
});

const addOrgComic = () => {
  axios.post('http://localhost:8080/remecomic/orgcomic/add', orgComicDto.value)
    .then(response => {
      alert('Comic successfully added');
    })
    .catch(error => {
      alert('Error adding comic');
    });
};



const uploadcomicInfo = async () => {
  const uniqueId = uuidv4();
  if (orgComicCover.value.files != null) {
    const comicCover = orgComicCover.value.files[0];
    const imgRef = storageRef(defaultStorage, `cover/${uniqueId}_comicCover`);
    try {
      const uploadTask = uploadBytesResumable(imgRef, comicCover);
      await uploadTask;
      const url = await getDownloadURL(imgRef);

      // 存儲漫畫封面 URL 到 orgComicDto
      orgComicDto.value.orgComicCover = url;

      // 這裡將 addOrgComic 的呼叫移到 try 块的外部
    } catch (err) {
      console.log(err);
    }
  }

  // 在這裡呼叫 addOrgComic 函數，確保只在成功上傳漫畫封面後才將資料送到後端
  addOrgComic();
};

 import { initializeApp } from "firebase/app";
 import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
 const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_ORGCOMIC_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_ORGCOMIC_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_ORGCOMIC_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_ORGCOMIC_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_ORGCOMIC_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_ORGCOMIC_APP_ID,
     measurementId: import.meta.env.VITE_FIREBASE_ORGCOMIC_MEASUREMENTID
 };
 const app = initializeApp(firebaseConfig);
 
 let defaultStorage = getStorage(app);
</script>

<style scoped>
  .justify {
 text-align: justify; 
} 
.center{
  text-align: center; 
}
*{
box-sizing: border-box;
padding: 0;
}
.bg-local{
  height: 1200px;
  background-color: #000;
}
.bg{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  margin: auto;
  height: 1000px;
  width: 1100px;
  background-position: justify;
  border-radius: 20px;
}
.input{
  width: 300px; 
  height: 30px;
}
.Introductioninput{
  width: 300px; 
  height: 100px;
}

</style>