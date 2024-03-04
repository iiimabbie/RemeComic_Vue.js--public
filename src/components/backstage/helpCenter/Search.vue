<template>
  <div class="mb-3">
        <form @submit.prevent="searchSubmit">
        <label for="search" class="form-label">Search</label>
        <input type="text" class="form-control" id="search" v-model="formData.question">
        <button type="submit" class="btn btn-outline-dark">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import httpClient from '@/main.js';

    const formData = ref({
        question: ''
    })

    const searchSubmit = () => {
        console.log(formData.value.question);
        httpClient.get(`http://localhost:8080/remecomic/helpcenter/question?q=${formData.value.question}`)
        .then(response => response.data)
        .catch(error => console.log(error))
    }
</script>

<style>

</style>