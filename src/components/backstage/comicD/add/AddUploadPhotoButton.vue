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
                class="col-3 btn chooseFileButton" 
                @click="triggerFileInput">
                    Upload Image
          </button>
    </div>
</template>

<script setup>
import { ref, defineProps} from 'vue';
import Swal from 'sweetalert2';
import { initializeApp } from 'firebase/app';
import { getStorage, ref as firebaseRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import httpClient from '@/main.js'
const props = defineProps(['params']);
const emits = defineEmits(['sendImagePreview'])

const tempFile = ref(null);
const selectedFileName = ref(null);
const onFileChange = (event) => {
  const file = event.target.files[0];
  selectedFileName.value = file.name;

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageURL = e.target.result;
        Swal.fire({
            title: selectedFileName.value,
            imageUrl: e.target.result,
            imageAlt: 'The uploaded image',
            showConfirmButton: false,
            showCloseButton:true,
            html: `<button id="upload" 
            class="upload"
            style="
            width:150px
            height:60px;
            padding:10px;
            font-size:22px;
            border:2px solid rgba(251, 110, 187, 0.8);
            border-radius:15px;
            background-color:Pink;
            box-shadow: 0 0 2px lightpink;
            color: white
            ">
            Upload
            </button>
            <button id="preview" 
            class="upload"
            style="
            width:150px
            height:60px;
            padding:10px;
            font-size:22px;
            border-radius:15px;
            border:0px;
            background-color:rgba(251, 173, 213, 0.8);
            box-shadow: 0 0 2px lightpink;
            color: white">
            Preview
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
          const folder = props.params.folder ;
          const updateData = props.params.data ;
          uploadImage(file,folder, updateData)})
        document.getElementById('preview').addEventListener('click', ()=>{
            emits('sendImagePreview',imageURL)
            Swal.close();
        })
        };
        reader.readAsDataURL(file);
    }else {
        selectedFileName.value = '';
    }
}


const uploadImage = (file, folder, updateData) => {
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
  const storageRef = firebaseRef(storage, `${folder}/` + file.name);
  uploadBytes(storageRef, file)
  .then((snapshot) => {
    console.log('Upload Successed!');
    Swal.close();
    getDownloadURL(snapshot.ref)  
    .then((downloadURL) => {
        emits('sendImagePreview',downloadURL)
        console.log('File available at', downloadURL);    
        updateData.draftData.comicCover = downloadURL;
        httpClient.post("/comicD/comic/drafts/update",updateData)
        .then((res) => { 
          console.log("photoUpdate", res.data)
          //emits('sendImagePreview',downloadURL)
          saveInLocalSession(updateData.draftData.draftId, downloadURL);
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

const saveInLocalSession = (draftId, downloadURL) =>{
  let draftsData = JSON.parse(localStorage.getItem('draftsData'));
    const draft = draftsData.find(draft => draft.draftId === draftId);
    draft.comicCover = downloadURL;
    const serializedData = JSON.stringify(draftsData);
    localStorage.setItem('draftsData', serializedData);
}




</script>

<style scoped>

.chooseFileButton {
  padding: 0 7px 5px 7px;
  width:200px;
  height: 30px;
  font-size: 20px;
  color: lightgrey;
  border: 2px solid rgba(110, 110, 110, 0.39);
  border-radius: 15px;
  text-align: center;
  vertical-align: center;
}

.chooseFileButton:hover {
  background-color: rgb(154, 154, 154);
  color: rgb(85, 85, 85);
}

</style>