<template>
  <div>
    <Search />
    <br />
    <ag-grid-vue
      class="ag-theme-material"
      style="height: 800px"
      :columnDefs="orgshowDefs"
      :rowData="orgcomic"
      @grid-ready="onGridReady"
      :defaultColDef="defaultColDef"
      :gridOptions="gridOptions"
      :animateRoes="true"
    ></ag-grid-vue>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import DOMPurify from 'dompurify';
import axios from 'axios';
import Search from '@/components/backstage/orgComic/Search.vue'

const pollInterval = 1500;
let pollTimer;
let lastScrollPosition = 0;
const searchQuery = ref('');

const updateSearchResults = (query) => {
  searchQuery.value = query; // Assuming searchQuery is a ref variable
  fetchData();
}

const orgshowDefs = [
  { field: 'comicId', width: 120, editable: false },
  { field: 'comicName', width: 180 },
  { field: 'userId', width: 110 },
  { field: 'introduction', width: 210 },
  { field: 'orgPublishDate', width: 180 },
  { field: 'genreName', width: 150 },
  { field: 'orgComicCover', width: 170 },
  { field: 'comicBodyPhoto', width: 190 },
  { field: 'comicEpisode', width: 170 },
  { field: 'verify', width: 130 },
  { field: 'Delete', width: 130 , cellRenderer: () => '<button class="btn btn btn-danger">Delete</button>',},
];

const mapVerifyToStatus = (verifyValue) => {
  switch (verifyValue) {
    case 1:
      return 'Pass';
    case 2:
      return 'Fail';
    case 3:
      return 'Serial';
    case 4:
      return 'Unverify';
    default:
      return 'Unverify';
  }
};


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
  sortable: true,
  filter: true,
  resizable: true,
  editable: true,
  cellClass: 'center-text',
  width: 150,
  onCellValueChanged: edited,
};

let gridApi = null;

const onGridReady = (params) => {
  gridApi = params.api;
  
  startPolling();
  gridApi.addEventListener('firstDataRendered', () => {
    gridApi.ensureIndexVisible(Math.floor(lastScrollPosition / gridApi.getVerticalPixelRange().clientHeight));
  });
};

const orgcomic = ref([]);

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  try {
lastScrollPosition = gridApi.getVerticalPixelRange().top;
    const [orgcomicData, orgcomicbodyData, orgcomicGenreData] = await Promise.all([
      axios.get('http://localhost:8080/remecomic/orgcomic/all').then((response) => response.data),
      axios.get('http://localhost:8080/remecomic/comicbody/all').then((response) => response.data),
      axios.get('http://localhost:8080/remecomic/comicD/genres').then((response) => response.data),
    ]);

    const updatedOrgComicData = orgcomicData.map((orgcomic) => {
      const correspondingComicBody = orgcomicbodyData.find(
        (orgcomicbody) => orgcomicbody.comicId === orgcomic.comicId
      );


      
      const correspondingGenre = orgcomicGenreData.find((genre) => genre.genreId === orgcomic.genreid);

      return {
        ...orgcomic,
        comments: orgcomic.comments || 0,
        comicBodyPhoto: correspondingComicBody?.comicBodyPhoto,
        comicEpisode: correspondingComicBody?.comicEpisode,
        genreName: correspondingGenre?.genreName,
        verify: mapVerifyToStatus(orgcomic.verify),
      };
    });

    const rowCount = gridApi.getModel().getRowCount();
    const currentScrollPosition = gridApi.getVerticalPixelRange().top;

    gridApi.setRowData(updatedOrgComicData);

    // 在更新資料後，確保相對滾動位置
    const topRowNode = gridApi.getRenderedNodes().find((node) => node.rowTop >= currentScrollPosition);

    if (topRowNode) {
      gridApi.ensureNodeVisible(topRowNode, 'top');
    } else {
      // 如果 topRowNode 不存在，則滾動到最底部
      gridApi.ensureIndexVisible(rowCount - 1, 'bottom');
    }

    emit('updateChangedRows', updatedOrgComicData);
  } catch (err) {
    // console.error(err.message);
  }
};

const startPolling = () => {
  pollTimer = setInterval(() => {
    fetchData();
  }, pollInterval);
};

</script>

<style>

</style>