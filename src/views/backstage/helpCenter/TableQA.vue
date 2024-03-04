<template>
    <div>
        <h2>
            Help And Support Center
        </h2>
        <!-- <Search/> -->
        <ag-grid-vue
            class="ag-theme-material"
            style="height:500px"
            :columnDefs="questionDefs"
            :rowData="questions"
            :defaultColDef="defaultColDef"
            :gridOptions="gridOptions"
        ></ag-grid-vue>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import httpClient from '@/main.js';
import DelBtn from '@/components/backstage/helpCenter/DelBtn.vue';
import UpdateBtn from '@/components/backstage/helpCenter/UpdateBtn.vue';
import Search from '@/components/backstage/helpCenter/Search.vue';

const handleDelBtnRefresh = () => {
    fetchData();
}

const handleUpdateBtnRefresh = () => {
    fetchData();
}

const getCategoryLabel = (params) => {
  const categoryId = params.value;
  switch (categoryId) {
    case 1:
      return 'Comic';
    case 2:
      return 'User';
    case 3:
      return 'Money';
    case 4:
      return 'Promotion';
    case 5:
      return 'Order';
    case 6:
      return 'Reading';
    default:
      return 'Unknown';
  }
};

const questionDefs = [
    {field:'helpId', width: 80},
    {field:'category',width: 120, valueFormatter: getCategoryLabel},
    {field:'question', width: 400},
    {field:'answer', width: 640},
    {field:'delete', width: 110, 
    cellRenderer: 'delBtn'
    },
    {field:'update', width: 120,
    cellRenderer: 'updateBtn'
    },

]

const gridOptions = {
    components: {
        delBtn : DelBtn,
        updateBtn : UpdateBtn,
    },
    context: {
        delBtnRefresh: handleDelBtnRefresh,
        updateBtnRefresh: handleUpdateBtnRefresh
    }
}

const defaultColDef = ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    width: 150,
})

const questions = ref([])

onMounted(() => {
    fetchData();
})

const fetchData = () => {
    httpClient.get('/helpcenter/allQuestion')
    .then(response => response.data)
    .then(data => { questions.value = data })
    .catch(error => console.log(error));
}



</script>

<style>

</style>