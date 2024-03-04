<template>
    <div v-if="props.params.data.version>1 && !props.params.value"
        style="margin:0 0 0 5px;
        font-size:14px">v.{{props.params.data.version}}</div>
    <div @click=handleUnlock>
        <span v-if="props.params.value" 
        style="color:rgb(255, 255, 255);
        position:absolute;
        left:30px; top:5px;">
            v.{{props.params.data.version}}
        </span>
        <img :src="lock.url" :alt="lock.title" 
        v-if="props.params.value"
        @click=handleUnlock 
        style="width:30px
        position:absolute
        "/> 
    </div>
    
</template>

<script setup>
import {defineProps, defineEmits} from 'vue'
import httpClient from '@/main.js'
import Swal from 'sweetalert2'
import Images from '@/assets/Images.json';
const props = defineProps(['params']);
const emits = defineEmits(['sendIsUnlock']);

const unlock = Images.find(image => image.imageId == 24);
const lock = Images.find(image => image.imageId == 25);
const handleUnlock = ()=>{
    Swal.fire({
        html:`<div>
                <br>
                <div >
                    <img src=${unlock.url} alt=${unlock.title} width:100px; height:30px; 
                     style="margin:0 0 10px 0">
                    <span style="color: crimson; font-weight:bold; font-size:36px">Unlock?</span>
                <div>
                <br>
                <p>This is a published draft! </p>
                <p style="color: crimson;">By unlocking the draft, system will duplicated the selected draft and create a new version from it! </p>
                <p>Do you wish to proceed? </p>
            </div>`,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'Unlock',
        cancelButtonText: 'Cancel'
    }).then((res) => {
        
        if (res.isConfirmed) {
            console.log(props.params.value);
            httpClient.get("/comicD/comic/drafts/unlock", {params:{draftId:props.params.data.draftId}})
            .then((res)=>{
                props.params.context.onRefreshTable();
                console.log(res.data.draftId)
            })
            .catch(err => {
                console.log(err)
            })
            console.log("Confirmed");
        } else if (res.dismiss === Swal.DismissReason.cancel) {
            // Handle the cancellation
            console.log("Cancelled");
        }
    })
}


</script>

<style>

</style>