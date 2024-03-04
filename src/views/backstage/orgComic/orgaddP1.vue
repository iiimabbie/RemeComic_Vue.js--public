<template>
   <div class="container-fluid">
   
</div>
   <h1>Update Comic Series</h1><br><br>
    <form @submit.prevent="updateOrgComic">
    <label for="comicId">Comic ID:</label>
<input v-model="orgComicDto.comicId" id="comicId" @input="fetchComicData" required class="form-control input"/><br><br>

     <label for="comicName" class="form-label">Comic Name:</label>
     <input v-model="orgComicDto.comicName" id="comicName" required class="form-control input"/><br><br>

     <label for="orgComicCover">Comic Cover:</label>
     <input type="file" name="fileField" accept="orgComicCover/*" ref="orgComicCover" @change="handleFileChange" class="form-control input"/><br><br>

     <label for="introduction">Introduction:</label>
     <textarea v-model="orgComicDto.introduction" id="introduction" required class="form-control Introductioninput input"></textarea><br><br>

     <label for="userId" >User ID:</label>
     <input v-model="orgComicDto.userId" id="userId" required class="form-control input"/><br><br>


     <label for="genreid">Genre ID:</label>
     <select class="form-select select" v-model="orgComicDto.genreid" name="genre">
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

<label for="verify">Verify:</label> 
     <select v-model="orgComicDto.verify" class="form-select select" >
       <option value="1">pass</option>
       <option value="2">fail</option>
       <option value="3">serial</option>
       <option value="4">unverify</option>
     </select><br><br>

     <label for="orgPublishDate">Publish Date:</label>
     <input type="date" v-model="orgComicDto.orgPublishDate" id="orgPublishDate" readonly class="form-control input"/><br><br>

     <button @click="updateOrgComic" class="btn btn-outline-dark">Update Comic</button><br><br>
   </form>
</template>

<script setup>
import { ref,reactive } from 'vue';
import 'bootstrap-datepicker';
import axios from 'axios'
import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from 'uuid';

import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const handleFileChange = (event) => {
  orgComicDto.value.orgComicCover = event.target.files[0];
}

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
const orgComicDto = ref(reactive({
  comicId: '',
  comicName: '',
  orgComicCover: null,
  orgPublishDate: new Date().toISOString().split('T')[0],
  introduction: '',
  userId: '',
  verify: '',
  genreid: '',
}));


const updateOrgComic = async () => {
  if (!orgComicDto.value.comicId) {
    alert('Error Comic ID');
    return;
  }
  
  try {
    console.log('Updating OrgComic:', orgComicDto.value);
    const response = await axios.get(`http://localhost:8080/remecomic/orgcomic/${orgComicDto.value.comicId}`);

    const { comicName, orgComicCover, introduction, userId, genreid, verify, orgPublishDate } = response.data;
  
    orgComicDto.value.verify = orgComicDto.value.verify ||verify;
    orgComicDto.value.comicName = orgComicDto.value.comicName || comicName;
    orgComicDto.value.orgComicCover = orgComicDto.value.orgComicCover || orgComicCover;
    orgComicDto.value.orgPublishDate = orgPublishDate;
    orgComicDto.value.introduction = orgComicDto.value.introduction || introduction;
    orgComicDto.value.userId = orgComicDto.value.userId || userId;
    orgComicDto.value.genreid = Number(orgComicDto.value.genreid || genreid);

    const photoUrl = await uploadorgcomiccover(orgComicDto.value.orgComicCover);
  
    orgComicDto.value.orgComicCover = photoUrl;
    console.log('Firebase Storage URL:', photoUrl);
    await axios.put(`http://localhost:8080/remecomic/orgcomic/update/${orgComicDto.value.comicId}`, orgComicDto.value);

} catch (error) {
  console.error('Error updating comic', error);
}
}

const uploadorgcomiccover = async()=>{
  if (!orgComicDto.value.orgComicCover) {
    console.error('Comic body photo is null.');
    return;
  }

    const uniqueId = uuidv4();
    
      const coverPhoto = orgComicDto.value.orgComicCover;
      const imgRef = storageRef(defaultStorage, `cover/${uniqueId}_cover`);
      try {
              const uplaodTask = uploadBytesResumable(imgRef, coverPhoto);
              await uplaodTask;
              const url = await getDownloadURL(imgRef);
              return url;        
          } catch (err) {
              console.log(err)
              alert('Get DATA Fail');
              throw err;
          }
    }

let defaultStorage = getStorage(app);
</script>
<style scoped>
/* .center {
 text-align: center; 
} 
.input{
  width: 300px; 
  height: 30px;
} 
.Introductioninput{
  width: 300px; 
  height: 100px;
}
.select{
  width: 800px;
} */

</style>