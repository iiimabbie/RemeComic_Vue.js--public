<template>
    <div>
    <ag-grid-vue 
            class="ag-theme-material"
            style="height:100vh"        
            :gridOptions="gridOptions" 
            :rowData="draftsForRows"
            @grid-ready="onGridReady"
            :defaultColDef="defaultColDef"
            :animateRows="true">
        </ag-grid-vue>
        <div class="pageButtonConatiner" v-if="hasData" >
            <button 
            :class= "{selectedButton: currentPage == page, pageButton: currentPage !== page} " 
            v-for="page in pages" 
            :key="page" 
            @click="handlePageClick(page)">
                {{ page }}
            </button>
        </div>
    </div>
</template>

<script setup>
import {ref, watch, onMounted, defineProps} from 'vue'
import httpClient from '@/main.js'
import { AgGridVue } from 'ag-grid-vue3';
import Swal from 'sweetalert2'
import moment from 'moment'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import UnlockAndDuplicateDraft from './UnlockAndDuplicateDraft.vue';
const props = defineProps(['isRefreshDraftTable'])
const emits = defineEmits(['getAddFormData'])
const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

const handleRefreshTable = () => {
    fetchData(1);
    console.log("in Refresh Table");
}

watch(() => props.isRefreshDraftTable, (newValue) => {
    if(newValue){
        handleRefreshTable();
    }
}, { immediate: true})



const gridApi = ref();
const gridColumnApi = ref();
const onGridReady = (params) => {
    gridApi.value = params.api;
    gridColumnApi.value = params.columnApi;
}

const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    cellClass: 'center-text',
    fontSize:40,
}


const draftsForRows = ref([])
const gridOptions = ({
    columnDefs:[
        {headerName:" ", field:"publishDate",
        width:60,
        sortable: false,
        filter: false,
            cellRenderer: params => {
                let threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;
                let publishDate = new Date(params.data.publishDate)
                let dot = document.createElement('button'); 
                   dot.id = "notification";
                   dot.style.width = "12px";
                   dot.style.height = "12px";
                   dot.style.border = 0;
                   dot.style.borderRadius = "6px";

                if(params.data.isPublished){
                   dot.style.backgroundColor = "rgba(148, 204, 149, 0.8)";
                   return dot; 
                }else if(publishDate.getTime() - currentDate.getTime() < threeDaysInMilliseconds){
                   dot.style.backgroundColor = "crimson";
                   return dot; 
                }else{
                   dot.style.backgroundColor = "lightgrey";
                   return dot;
                }    
        }},
        {headerName:" ", width:62,
        cellRenderer: params => {
            return `<input type="checkbox"> `
        }},
        {field:"comicTitle", width:200,
        cellStyle: params => {
        if (params.data.isPublished != 0) {
            return { color: 'lightgray' };
        } else {
            return null; // Default style
        }
    },
        onCellClicked: event => {
            //console.log(event.data);
            let sendData={draftId:event.data.draftId}
            if(event.data.isPublished == 0){
                sendData["isReadOnly"] = false;
                emits('onAddFormData', sendData)
            }else if(event.data.isPublished == 1){
                sendData["isReadOnly"] = true;
                emits('onAddFormData', sendData)
            }
            
        }
        },
        {headerName:"Modify", 
        field:"modificationTime", width:130,
        cellStyle: params => {
            if (params.data.isPublished != 0) {
                return { color: 'lightgray' };
            } else {
                return null; // Default style
            }}
        },
        {headerName:"", field:"isPublished", 
        width:70,filter:false,
        cellClass: 'center-text',
        cellRenderer: UnlockAndDuplicateDraft,
        }
    ],
    context:{onRefreshTable:handleRefreshTable}
})

const pages = ref({});
const fetchData = (pageNum) => {
    return httpClient.post(`/comicD/comic/drafts?p=${pageNum}`, )
    .then(res => {
        return {drafts: res.data.drafts, pageUtil: res.data.pageUtil}
        
    })
    .then(({drafts, pageUtil})=>{
        drafts.forEach(data => {
            let sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
            let modificationDate = new Date(data.modificationTime);
            modificationDate.setHours(0, 0, 0, 0);

            if(modificationDate.getTime() === currentDate.getTime()){
                data.modificationTime = moment(data.modificationTime).format('LT') ;
            }else if (currentDate.getTime() - modificationDate.getTime() < sevenDaysInMilliseconds){
                data.modificationTime = moment(modificationDate).startOf('day').fromNow();  

            }else{
                data.modificationTime= moment(modificationDate).format("MMM Do YYYY"); ;
            } 
            data.publishDate = moment(data.publishDate).format("YYYY-MM-DD");

            draftsForRows.value = drafts
            let serializedData = JSON.stringify(drafts);
            localStorage.setItem("draftsData", serializedData);   
        })
        pages.value = pageUtil[0].totalPages   
            
    })
    .then(()=>{
          hasData.value = true;
    })
    .catch(err =>{
        console.log(err)
        return null;
    })
}

const hasData = ref(false);
const currentPage =ref(null);
const handlePageClick = (page) => {
    currentPage.value = page;
    fetchData(page);
}

onMounted( async ()=>{
    fetchData(1);
    
})

</script>

<style scoped>
.ag-theme-material{
    --ag-row-hover-color:rgba(181, 232, 249, 0.6);
    --ag-material-primary-color:rgba(85, 70, 247, 1);

}
/* .disable-cell{
    color:lightgray;
} */
.pageButtonConatiner{
    position: relative;
    top:-30%;
    left:40%;
    right:20%;

}
.pageButton{
    width:24px;
    height:24px;
    text-align: center;
    vertical-align: center;
    margin:0 0 0px 5px;
    border:0px;
    color:darkgrey;
    font-size:18px;
    background:transparent;
}

.pageButton:hover{
    background-color:rgb(93, 180, 238);
    transform: scale(1.2);
    color:white;
    border-radius:15px;
    box-shadow: 0 0 2px rgba(113, 254, 254, 0.431);
}

.selectedButton{
    width:30px;
    height:30px;
    text-align: center;
    vertical-align: center;
    background-color:rgb(93, 180, 238);
    color:white;
    font-size:20px;
    border-radius:15px;
    box-shadow: 0 0 2px rgba(113, 254, 254, 0.431);
    border:0px;
}

</style>