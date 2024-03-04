<!-- OrgComicShow.vue -->
<template>
  <div class="container-fluid">
    <!--Logo-->
    <div class="row row1">
      <div class="col-md-2 col-lg-2 d-md-block sidebar">
        <router-link to="/frontstage/home">
          <img id="logo-black" src="https://firebasestorage.googleapis.com/v0/b/remetest-e1cbe.appspot.com/o/Basic%2FLogo_Black.png?alt=media&token=8a00ea4e-0872-4569-aa92-7c3e825d0d90" alt="RemeLogo">
          <img id="logo-fantuan" src="https://firebasestorage.googleapis.com/v0/b/remetest-e1cbe.appspot.com/o/Basic%2F%E7%AE%A1%E7%90%86%E5%93%A1.png?alt=media&token=e510767f-e7a3-465e-8a72-4d34caf275b4" alt="RemeLogo">
        </router-link>
      </div>
      <!--outerSearch-->
      <main class="main-header col-md-10 col-lg-10 d-md-block">
        <Search />
      </main>
    </div>
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-2 col-lg-2 d-md-block sidebar">
        <Sidebar />
      </div>
      <!-- MainContent -->
      <main class="main-header2 col-md-10 col-lg-10 d-md-block">
        <br />
        <ag-grid-vue
          class="ag-theme-material"
          style="height:500px"
          :columnDefs="columnDefs"
          :rowData="orgcomic"
          @grid-ready="onGridReady"
          :defaultColDef="defaultColDef"
          :animateRoes="true"
        ></ag-grid-vue>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/backstage/basic/Sidebar.vue'
import Search from '@/components/backstage/orgComic/Search.vue'
import SaveButton from '@/components/backstage/comicD/SaveButton.vue'
import { ref, onMounted, defineEmits, defineProps, defineExpose } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import moment from 'moment';
import DOMPurify from 'dompurify';
import 'bootstrap-datepicker';


const columnDefs = [
  { field: 'comicId', width: 80, editable: false },
  { field: 'comicName',width: 180},
  { field: 'userId' ,width: 120},
  { field: 'commentContent',width: 200, headerName: 'Comment Content',cellRenderer: (params) => {
      return params.data.comments.join(', ');}}
];

const props = defineProps(['changedRows']);
const emit = defineEmits(['cell-edited', 'updateChangedRows']);
function edited(event) {
  let sanitizedValue = DOMPurify.sanitize(event.newValue);
  event.data[event.colDef.field] = sanitizedValue;
  event.api.refreshCells({ rowNodes: [event.node], columns: [event.colDef.field] });
  const updatedData = {
    comicId: event.data.comicId,
    [event.column.colId]: sanitizedValue,
  };  
  emit('cell-edited');
  emit('updateChangedRows', updatedData);
}

const defaultColDef = {
  sortable:true,
  filter:true,
  resizable:true,
  editable: true,
  cellClass: 'center-text',
  width:150,
  onCellValueChanged:edited,
}

let gridApi = null;
let gridColumnApi = null;
const sizeToFit = (isChecked)=>{
  if(isChecked && gridApi){
      gridApi.sizeColumnsToFit()
  }else {
      gridColumnApi.getAllColumns().forEach(column => {
          gridColumnApi.setColumnWidth(column, 150);
      });
  }
}

const onGridReady = (params)=>{
  gridApi = params.api;
  gridColumnApi = params.columnApi;
}

const orgcomic = ref([]);
const orgcomicbody = ref([]);


const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

onMounted(async () => {
  try {
    const orgcomicData = await fetchData('http://localhost:8080/remecomic/orgcomic/all');
    const orgcomiclikeData = await fetchData('http://localhost:8080/remecomic/comiclike/all');
    const orgcomiccommentData = await fetchData('http://localhost:8080/remecomic/orgcomiccomment/all');

    console.log(orgcomicData);
    console.log(orgcomiclikeData);
    console.log(orgcomiccommentData);

    orgcomic.value = orgcomicData.map((orgcomic) => {
      if (!orgcomic.comments) orgcomic.comments = 0;

      const correspondingcomiclike = orgcomiclikeData.find(
        (comiclike) => comiclike.comicId === orgcomic.comicId
      );

      if (correspondingcomiclike) {
        orgcomic.comicId = correspondingcomiclike.comicId;

      }

      const commentsForComic = orgcomiccommentData
        .filter((comment) => comment.comicId === orgcomic.comicId)
        .map((comment) => comment.commentContent);


      orgcomic.comments = commentsForComic;

      return orgcomic;
    });

  } catch (err) {
    console.error(err.message);
  }
});

defineExpose({sizeToFit});
</script>

<style scoped>
.row1{
  display:flex;
  align-items: end;
  margin:15px 20px 0px 0;
}

#logo-black{
  width:130px;
}
#logo-fantuan{
  width:90px;
} 

.sidebar-container{
  margin:0 0 0 15px;
}
.main-header{
  margin:30px 0px 0 0;
}

.main-header{
 display: flex;
 align-items: flex-end;
}
.date{
 position: relative;
}
.datepicker{
 border:0.8px solid lightgray;
 padding:5px;
 border-radius:5px;
}
.input-icon {
 position: absolute;
 left: 170px;
 top: 50%;
 transform: translateY(-50%);
} 
.input-icon-wrapper input {
 padding-left: 30px; 
}

</style>
