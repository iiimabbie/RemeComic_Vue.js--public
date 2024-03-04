<template>
  <div class="container-fluid">
    <!--Logo-->
    <div class="row row1">
      <div class="col-md-2 col-lg-2 d-md-block sidebar">
        <router-link to="/frontstage/home">
          <img id='logo-black' :src="logoBlack.url" :alt="logoBlack.imageTitle">
          <img id='logo-fantuan' :src="superAdministrator.url" :alt="superAdministrator.imageTitle">
        </router-link>
      </div>
    </div>
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-2 col-lg-2 d-md-block sidebar">
        <Sidebar @optionSelected="handleOptionLinks" />
      </div>
      <!-- MainContent -->
      <main class="main-header2 col-md-10 col-lg-10 d-md-block main" v-if="showComicDAsHome">
        <ComicDQuery />
      </main>
      <main v-else>
        <!-- <router-view class="mainContainer"></router-view> -->
        <component :is="currentDisplay" ref="mainDisplay" />
      </main>
    </div>
  </div>
</template>
   
<script setup>
import Sidebar from '@/components/backstage/basic/Sidebar.vue'
import ComicDQuery from '@/views/backstage/comicD/ComicDQuery.vue'
import Images from '@/assets/Images.json'
import { ref, onMounted } from 'vue';
import 'bootstrap-datepicker';
import $ from 'jquery';

const logoBlack = Images.find(image => image.imageId == 2);
const superAdministrator = Images.find(image => image.imageId == 7);

onMounted(() => {
  $('.datepicker').datepicker({
    autoclose: true,
    todayHighlight: true
  });
});

const showComicDAsHome = ref(true);
const currentDisplay = ref(null);
const handleOptionLinks = (mainDisplay) => {
  showComicDAsHome.value = false;
  currentDisplay.value = mainDisplay;
}

</script>
   
   
<style scoped>
.container-fluid {
  height: 90vh;
  padding: 10px 20px;
}

.row1 {
  display: flex;
  align-items: end;
  /* margin: 10px 20px 0px 0; */
}

#logo-black {
  width: 130px;
}

#logo-fantuan {
  width: 90px;
}

.sidebar-container {
  margin: 0 0 0 15px;
}

main {
  position: absolute;
  left: 18%;
  width: 80%;
}


.main-header {
  display: flex;
  margin: 30px 0px 0 0;
  align-items: flex-end;
}
</style>
   