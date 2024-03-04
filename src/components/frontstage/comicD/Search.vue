<template>
    <button class="searchButton" type="button">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
    </button>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

</script>

<style scoped>
.searchButton{
    color:white;
    font-size:18px;
    background-color:transparent ;
    border: none;
    width:20px;

}
</style>