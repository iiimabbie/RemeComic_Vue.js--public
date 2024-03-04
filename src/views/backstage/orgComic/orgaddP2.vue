<template>

<div class="container-fluid">
   
  </div>
  <!-- <div class="col-md-9 col-lg-9">
   <div class="center"> -->
 <h1 >Update Comic Body</h1><br><br>
 <form @submit.prevent="addOrgComicBody">

   <label for="comicId">Comic Id:</label>
   <input v-model="orgComicBodyDto.comicId" id="comicId" required class="form-control input"/><br><br>


   <label for="comicEpisode">Comic Episode:</label>
   <input v-model="orgComicBodyDto.comicEpisode" id="comicEpisode" required class="form-control input"/><br><br>

   <label for="comicBodyPhoto">Comic Body Photo:</label>
   <input type="file" name="fileField" accept="comicBodyPhoto/*" ref="comicBodyPhoto" class="form-control input"/><br><br>

   <button type="submit" class="btn btn-outline-dark">
            <span v-if="loading" class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
            <span v-else>Update Comic</span>
          </button><br><br>

 </form>
<!-- </div>
  </div> -->

</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

const loading = ref(false);
const comicBodyPhoto = ref([])
const orgComicBodyDto = ref({
comicId: '',
comicEpisode: '',
comicBodyPhoto: '',
});


const uploadcomicBodyPhoto = async()=>{
    const uniqueId = uuidv4();
    if(comicBodyPhoto.value.files!=null){
      const bodyPhoto = comicBodyPhoto.value.files[0]
      const imgRef = storageRef(defaultStorage, `body/${uniqueId}_body`);
      try {
              const uplaodTask = uploadBytesResumable(imgRef, bodyPhoto);
              await uplaodTask;
              const url = await getDownloadURL(imgRef);
  
              return url;
          } catch (err) {
              console.log(err)
              throw err;
          }
    }
  
  }
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
  const addOrgComicBody = async() => {
    try {
      loading.value = true;
      // 上傳漫畫體照片到 Firebase Storage 並取得 URL
      const photoUrl = await uploadcomicBodyPhoto();

      // 使用 Firebase Storage 的 URL 更新 orgComicBodyDto
      orgComicBodyDto.value.comicBodyPhoto = photoUrl;

      // 將資料發送到後端
      await axios.post('http://localhost:8080/remecomic/comicbody/add', orgComicBodyDto.value);
      // loading.value = true;

      alert('Add Comic Body Succeed');
    } catch (error) {
      console.error('Err', error);
      alert('Add Comic Body Err');
    }finally {
    loading.value = false;
  }
  };
</script>

<style>
.center {
 text-align: center; 
}

</style>