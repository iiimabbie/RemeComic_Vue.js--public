<template>
  <div class="main-header row">
    <!-- <div class="input-group col-md-3"> -->
      <input v-model="search" class="form-control" placeholder="search..." style="width: 600px;">
      <button @click="searchSubmit" class="btn btn-outline-secondary" type="button" style="width: 40px;">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      </button>
    </div>
  <!-- </div> -->
</template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  import httpClient from '@/main.js';

  const search = ref('');
  const props = defineProps(['search', 'searchSubmit']);
  const emit = defineEmits(['searchSubmit']);
  
const searchSubmit = () => {
if (search.value) {
  const url = `http://localhost:8080/remecomic/orgcomic/${search.value}`;
  httpClient.get(url)
    .then(response => {
      emit('searchSubmit', response.data);
    })
    .catch(error => console.error(error));
} else {    
  console.log(alert('Do not have this Id'));
}
}
  </script>