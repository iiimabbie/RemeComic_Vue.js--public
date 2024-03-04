<template>
    <div >
        <input 
          :id = "inputId"
          class="fileInput" 
          ref="fileInput"
          type="file" 
          @change="onFileChange"
          style="display:none"/>
        <button 
          class="btn chooseFileButton" 
          @click="triggerFileInput"
          :style="getStyle()">
            Upload Image
          </button>
          <span v-if="selectedFileName">
            {{ selectedFileName }}
          </span>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps} from 'vue';
import Swal from 'sweetalert2';
import Images from '@/assets/Images.json'
import { initializeApp } from 'firebase/app'
import { getStorage, ref as firebaseRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import httpClient from '@/main.js'
const selectPhoto = Images.find(image => image.imageId == 18)
const props = defineProps(['params']);
const emits = defineEmits(['refreshTable']);

const inputId = ref(null);
function determineInputId(){
  const data = props.params.data;
  const comicId = data.comicId;
  if (data.episodeId) {
    const episodeId = data.episodeId
    inputId.value = `combine-${comicId}-${episodeId}`;
  } else{
    inputId.value = `combine-${comicId}-0`;
  }
}

const tempFile = ref(null);
const selectedFileName = ref(null);
function onFileChange(event) {
  const combinedId = event.target.id;
  const type = ref('');
  if(combinedId.substring(combinedId.length-1)==0){
    type.value = 'ComicCover';
  }else{
    type.value = 'EpisodeCover'  
  }
  const file = event.target.files[0];
  selectedFileName.value = file.name;

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      Swal.fire({
        title: selectedFileName.value,
        imageUrl: e.target.result,
        imageAlt: 'The uploaded image',
        confirmButtonText: 'Confirm',
        html: `<button id="upload" 
          class="upload"
          style="border-radius:2px;">
          Upload
          </button>`,
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
            tempFile.value = file;
        }else if (result.isDismissed){
          event.target.value = '';
          selectedFileName.value= '';
        }
      });
      document.getElementById('upload').addEventListener('click', ()=>{
        uploadImage(file, type, combinedId)})
    };
    reader.readAsDataURL(file);
  }else {
    selectedFileName.value = '';
  }
}

const uploadImage = (file, type, combinedId) => {
  const regex = /-(\d+)/;
  const regexEp = /(?:-[^-]*)-(\d+)/;
  const match = combinedId.match(regex);
  const matchEp = combinedId.match(regexEp);
  let comicId = null;
  let episodeId = null;
  if(match){
    comicId = match[1];  
  }
  if(matchEp){
    episodeId = matchEp[1];
  }
  console.log(console.log("episodeId", episodeId));
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_COMICD_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_COMICD_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_COMICD_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_COMICD_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_COMICD_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_COMICD_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_COMICD_MEASUREMENTID
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const storageRef = firebaseRef(storage, `${type.value}/` + file.name);
  uploadBytes(storageRef, file)
  .then((snapshot) => {
    console.log('Upload Successed!');
    Swal.close();
    getDownloadURL(snapshot.ref)
    .then((downloadURL) => {
    console.log('File available at', downloadURL);
    let requestUrl = null;
    let requestBody = null;
    if(episodeId == 0 ){
      requestUrl = "/comicD/comic/update/multiple"
      requestBody = [{
        "comicId": parseInt(comicId),
        "comicCover": downloadURL,
      }]
    }else{
      requestUrl = "/comicD/episode/update/multiple"
      requestBody = [{
        "episodeId": parseInt(episodeId),
        "episodeCover": downloadURL,
      }]
    }
      httpClient.put(requestUrl,requestBody)
      .then(res => {
        props.params.context.onRefreshTable(props.params);
        Swal.close();
      })
      .catch(err => {
        console.log(err)
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
};


const fileInput = ref(null);
function triggerFileInput () { 
  if(fileInput.value){
    fileInput.value.click();
    fileInput.value.fileName;
  }
}

onMounted(() => {
  determineInputId();
})

const getStyle = () => {
  return {
    margin: '25px 0 0 0',
    padding: '0 7px 2px 7px',
    height: '30px',
    fontSize: '20px',
    color: 'lightGrey',
    border: '1px solid rgba(15, 16, 16, 0.39)',
    borderRadius: '15px',
    textAlign: 'center',
    verticalAlign: 'center',
  };
}



</script>

<style scoped>

</style>