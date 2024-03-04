<template>
  <button class="publishButton" @click="handlePublishDraft">
    Publish
  </button>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue'
import httpClient from '@/main.js'
import Swal from 'sweetalert2';
const props = defineProps(['params'])
const emits = defineEmits(['sendIsPublish'])

const handlePublishDraft = () => {
  const today = new Date();
  const publishDate = new Date(props.params.publishDate);
  today.setHours(0,0,0,0);
  publishDate.setHours(0,0,0,0);
  let popupQuestion = "";
  if(today.getTime() === publishDate.getTime()){
    popupQuestion = `
    <br>
    <p style="font-size:24px">Are you sure you want to publish?!<p>`
  }else{
    popupQuestion = `
    <div >
    <h2 style="color:crimson"> ! Published Date Not Match </h2>
    <br>
    <p style="font-size:18px">Inputed Publish Date does not match Today's date! If proceed publish date will be overwrite with today's date! </p>
    <p style="font-size:18px font-weight:bold">Do you wish to proceed?</p>
    <div>`
  }
  Swal.fire({
            html: popupQuestion,
            showCancelButton: true,
            confirmButtonText: "Sure!",
            cancelButtonText: "Cancel",
        })
        .then(res => {
            if(res.isConfirmed){
                //const updateData = JSON.stringify(props.params);
                //console.log(updateData);
                httpClient.post("/comicD/comic/draft/publish", props.params)
                .then(res => {
                    saveInLocalSession(res.data.draftId);
                    console.log("published!",res.data);
                    emits("sendIsPublish");
                    Swal.fire({
                        title: `${res.data.comicTitle} was succuessfully published!`
                    })
                })
                .catch(err => {
                    console.log(err)
                    Swal.fire({
                            title: "Error",
                            text: "Please make sure at least one genre is selected.",
                            icon: "error",
                        });
                    });
            }
        });
   
}

const saveInLocalSession = (draftId) =>{
  let draftsData = JSON.parse(localStorage.getItem('draftsData'));
    const draft = draftsData.find(draft => draft.draftId === draftId);
    console.log("publishButtonLocalSession",draft)
    draft.isPublished = 1;
    const serializedData = JSON.stringify(draftsData);
    localStorage.setItem('draftsData', serializedData);
}

</script>

<style>
.publishButton{
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

.publishButton:hover {
  background-color: rgb(154, 154, 154);
  color: rgb(85, 85, 85);
}
</style>