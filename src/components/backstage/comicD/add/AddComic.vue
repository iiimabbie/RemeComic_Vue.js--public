<template>
    <div class="addColumnContainer">
        <div class="input-group firstRow">
            <span class="input-group-text" >Comic Title</span>
            <input 
            type="text" 
            class="form-control" 
            :readOnly="isReadOnly"
            v-model="formData.comicTitle">
        </div>
        <div class="input-group creatorInput">
            <span class="input-group-text" >Creator</span>
            <input type="text" class="form-control"  
            :readOnly="isReadOnly"
            v-model="formData.creator">
        </div>
        <div class="input-group" id="comicDescription">
            <span class="input-group-text">Comic Description</span>
            <textarea class="form-control" 
            placeholder="Please enter within 250 characters ..."
            :readOnly="isReadOnly" 
            v-model="formData.comicDescription"></textarea>
        </div>
        <div class = "lowerGroupWithImage row">
            <div class = "lowerGroup">
                <div class="input-group">
                    <span class="input-group-text" >Genre</span>
                    <input type="text" class="form-control" 
                    @click="handleGenreSelection"
                    :disabled="isReadOnly"
                    v-model="formData.genres" >
                </div>
                <div class="col input-group creatorInput">
                    <span class="input-group-text" >Publish Date</span>
                    <input type="date" 
                    class="form-control"
                    :readOnly="isReadOnly"
                    v-model="formData.publishDate">
                </div>   
                <div class="input-group">
                    <span class="input-group-text" >Update Day</span>
                    <input type="text" class="form-control" 
                    list="days"
                    :readOnly="isReadOnly"
                    v-model="formData.updateDay">
                    <datalist id="days">
                        <option v-for="weekday in weekdays" :key="weekday" :value="weekday" >{{weekday}}</option>
                    </datalist>    
                </div>       
                <div class="input-group">
                    <span class="input-group-text" >Purchase Price</span>
                    <input type="text" class="form-control" 
                    :readOnly="isReadOnly"
                    v-model="formData.purchasePrice" >
                </div>
                <div class="input-group">
                    <span class="input-group-text" >Rental Price</span>
                    <input type="text" class="form-control"
                    :readOnly="isReadOnly"
                    v-model="formData.rentalPrice" >
                </div> 
                <br>
                <AddUploadPhotoButton class="col-5 addUploadPhotoButton"
                :params = "paramsForOutSource"
                v-show="!isReadOnly"
                @sendImagePreview="handleImagePreview"/>
                <br>
                <PublishButton class="col-5 addUploadPhotoButton"
                :params = "formData"
                v-show="!isReadOnly"
                @sendIsPublish="handleRenewTable"
                />
            </div>
            <div class="col-5  imagePack">
                <div class="imageFrame" >     
                </div>  
                <img ref="imagePreview" alt="">
                <span class="textForImage">Comic Cover: 400*600</span>
            </div>
        </div>   
    </div>
</template>

<script setup>
import {ref, watch, createApp, defineEmits} from 'vue';
import httpClient from '@/main.js';
import Swal from 'sweetalert2';
import moment from 'moment';
import { useCounterStore } from '@/stores/counter';
import SelectedGenreNameTag from '@/components/backstage/comicD/genres/SelectedGenreNameTag.vue';
import AddUploadPhotoButton from '@/components/backstage/comicD/add/AddUploadPhotoButton.vue';
import PublishButton from '@/components/backstage/comicD/add/PublishButton.vue';

const counterStore = useCounterStore();
const props = defineProps(['clickDraftIdFromTable', 'fetchData', 'newInputForm'])
const emits = defineEmits(['onRefreshDraftTable','completeResetForm'])

const weekdays = ref(['Monday','Tuesday','Wedneday','Thursday', 'Friday', 'Saturday', 'Sunday'])
const currentTime = new Date().getTime();

const formData = ref({
    draftId:"",
    comicTitle:"",
    creator:"",
    comicCover:"",
    comicDescription:"",
    genres:[],
    publishDate:"",
    updateDay: "",
    purchasePrice: 0,
    rentalPrice: 0,
    isPublished:0
})
const draftId = ref(formData.value.draftId);

let previousFormData = formData.value;
const isResetOff = ref(true);
watch(formData, (newValue, oldValue) => {
    let change = "";
    if(newValue && oldValue && isResetOff.value){
    console.log("I am in autosave trigger watch", isResetOff.value)
    console.log("oldValue",oldValue);
    console.log("newValue",newValue);   
        if(newValue.comicTitle != previousFormData.comicTitle){    
            change = "comicTitle" ;    
            handleInputChange(newValue, change) 
        }else if (newValue.publishDate != previousFormData.publishDate) {
            change = "publishDate" ;    
            handleInputChange(newValue, change)
        }else if (newValue.modificationTime != previousFormData.modificationTime) {
            change = "modificationTime" ;    
            handleInputChange(newValue, change, previousFormData)
        }else if (newValue.isPublished == 1) {
            change = "isPublished" ;    
            handleInputChange(newValue, change)
        }else{
            handleInputChange(newValue) 
            paramsForOutSource.value.data.draftData=newValue;
        }
    }
    previousFormData = JSON.parse(JSON.stringify(newValue));   
}, {deep:true});

const isReadOnly = ref(false);
watch(() => props.clickDraftIdFromTable, (data) => {
    let draftId = data.draftId;
    isReadOnly.value = data.isReadOnly;

    let draftsData = JSON.parse(localStorage.getItem('draftsData'));
    const index = draftsData.findIndex(draft => draft.draftId === draftId);
    if(index !== -1){
        formData.value = draftsData[index]
        // everytime i click and call out new value 
        handleImagePreview(draftsData[index].comicCover) 
        paramsForOutSource.value.data.draftData = draftsData[index]
    }
    //fetchData(props.clickDraftIdFromTable);
}, {deep:true});

console.log("=======================",props.newInputForm)
watch(() => props.newInputForm, (newValue) => {
    console.log("in watcher for props.newInputForm", newValue);
    if(newValue === true ){
        formData.value = {  
            draftId:0,
            comicTitle:"",
            creator:"",
            comicCover:"",
            comicDescription:"",
            genres:[],
            publishDate:"",
            updateDay: "",
            purchasePrice: 0,
            rentalPrice: 0,
            isPublished:0
        },
        isResetOff.value = false;
        console.log("I am in newInput trigger watch", isResetOff.value)
        imagePreview.value.style.display = 'none';
        emits('completeResetForm')
        setTimeout(()=>{
            isResetOff.value = true;
        },2000)
    }
    
});


let autoSaveServerTimeoutId;
let autoSaveLocalTimeoutId;
const handleInputChange = (formDataToUpdate, change,previousFormData) => {
    let draftsData = JSON.parse(localStorage.getItem('draftsData'));
    const draftId = formDataToUpdate.draftId
    if(!draftsData.filter(data => data.draftsId == draftId)){
        emits('onRefreshDraftTable')
    }
    console.log("handleInputChange", formDataToUpdate); 
    clearTimeout(autoSaveServerTimeoutId);
    clearTimeout(autoSaveLocalTimeoutId); 

    if(change === "modificationTime" &&
    ! new Date(formDataToUpdate.modificationTime).getTime() - new Date(previousFormData.modificationTime).getTime() >= 30*60*1000
    ){
        autoSaveDraft(formDataToUpdate);
    }
    else if(change === "comicTitle"){
        console.log("incomicTitle")
        autoSaveServerTimeoutId = setTimeout(() => {
            autoSaveDraft(formDataToUpdate);
        }, 1000)
    }else if(change === "publishDate"){
        console.log("inpublishDate")
        let publishDate = new Date(formDataToUpdate.publishDate);
        publishDate.setHours(0,0,0,0);
        formDataToUpdate.publishDate = moment(publishDate).format("YYYY-MM-DD")
        autoSaveDraft(formDataToUpdate);
        autoSaveServerTimeoutId = setTimeout(() => {
            autoSaveDraft(formDataToUpdate);
        }, 1000) 
    }else if(change === "isPublished"){
        console.log("isPublished")
        emits("onRefreshDraftTable");
    }
    console.log("UpdateToLocalStorage")   
    autoSaveLocalTimeoutId = setTimeout(() => {
        autoSaveLocalSession(formDataToUpdate);
    }, 2*1000) //2 seconds
}

const autoSaveDraft = (formDataToUpdate) => {
    console.log("inAutoSave")
    let sendData = formDataToUpdate;
    let genreName = sendData.genres.map(data => ({"genreName":data}));
    let updateData = {
        draftData:sendData, 
        genreNameColors:genreName,
    }
    httpClient.post("/comicD/comic/drafts/update", updateData)
    .then((res) => { 
        emits('onRefreshDraftTable')
        console.log("success autosave");
        res.data.publishDate = moment(res.data.publishDate).format('YYYY-MM-DD');
        formData.value = res.data;
        console.log("response from autoSave",res.data);
        // console.log(res.data.draftId);
        //fetchData(res.data.draftId);
             
    })
    .catch ( err => {
        console.log(err)
        if (err.response.status == 403){
            Swal.fire({
                title:"please Login for Access!!",
                showCloseButton: true,
                showCancelButton:true,
                allowOutsideClick: false,
                confirmButtonText: "Login",
            }).then(res => {
                if(res.isConfirmed){
                counterStore.login()
                }else{
                    Swal.close();
                }
            })           
        };
    })
}

const autoSaveLocalSession = (newValue) => {
    let draftsData = JSON.parse(localStorage.getItem('draftsData'));
    const draftId = newValue.draftId;
    console.log("localStorage", draftId);
    console.log(newValue);
    const index = draftsData.findIndex((draft) => draft.draftId === draftId);
    if (index !== -1) {
        draftsData[index] = {
        ...draftsData[index], // Copy existing properties
        ...newValue, // Update with new data
        };
        const serializedData = JSON.stringify(draftsData);
        localStorage.setItem('draftsData', serializedData);
    }  
}


const handleGenreSelection = () => {
    Swal.fire({
        title:`Genre Selections`,
        html: `
          <span style:"color:lightGrey">Comic Title:</span>
          <br>
          ${formData.value.comicTitle}
          <div id="genreList"></div>`,
        showConfirmButton: false,
        showCancelButton: false,
        didOpen: () => {
          const container = document.getElementById('genreList');
          createApp(SelectedGenreNameTag,{
            params:paramsForOutSource.value,
            draftGenreSelectComplete: (genres) => {
                formData.value.genres = genres; 
                console.log("inGenreComplete", genres)  
            }
          }).mount(container);
          //How to give data through the newly created App
        }
    })
} 




const paramsForOutSource = ref({});
paramsForOutSource.value = {
    data:{
        draftData:formData.value,
        genreNameColors:formData.value.genres,
    },
    folder:"DraftComicCover"
}

// watch(()=>paramsForOutSource,(newValue)=>{
//     if(newValue){
//         console.log("paramsForOutSource:", newValue)
//     }
// })

const imagePreview = ref();
const handleImagePreview = (imageUrl) =>{
    if (imageUrl) {
        imagePreview.value.src = imageUrl;
        imagePreview.value.style.display = ''; 
    } else {
        imagePreview.value.src = '';
        imagePreview.value.style.display = 'none'; 
    }
}

const fetchData = (draftId) => {
    httpClient.get(`/comicD/comic/draft?draftId=${draftId}`)
    .then(res=>{
        res.data.publishDate = moment(res.data.publishDate).format('YYYY-MM-DD');
        if(res.data.comicCover!= null){
            handleImagePreview(res.data.comicCover)
        }else{
            handleImagePreview(null);
        }
        formData.value = res.data;
        
    })
    .catch( err => {
        console.log(err)
    })
}

const handleRenewTable = () => {
    emits("onRefreshDraftTable");
    console.log("in Addcomic Refresh Table~")
}


</script>

<style scoped>
.addColumnContainer{
    height:680px;
    border: 2px solid rgb(227, 226, 226);
    border-radius: 10px;
    background-color: rgb(221, 242, 250);
}
.firstRow{
    margin:10px 0 10px 0 !important;
}

.input-group{
    margin:0px 0 10px 0;
}

#comicDescription{
    height:100px;
}

.lowerGroup{
    width:400px;
}

.input-group-text{
    width:155px;
    color:rgb(140, 140, 140) !important;
}

.imagePack{
    position:relative;
    left:7%;

}
.imageFrame{
    position:absolute;
    width:288px;
    height:430px;
    border: 2px dashed lightgrey;
    border-radius: 5px;
    object-fit:contain;
}

img {
    position:absolute;
    width:288px;
    height:430px;
    border: 3px dashed lightgrey;
    border-radius: 10px;
    object-fit:contain;
    z-index:9;
}

.textForImage{
    position:absolute;
    top:200px;
    left:75px;
    color:rgb(141, 140, 140);
    z-index:8;
}

</style>