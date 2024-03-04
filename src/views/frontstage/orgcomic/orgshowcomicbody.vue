
<template>
  <div class="frontpageContainer">
    <Header />
        <div v-if="selectedBodyItem">
        <img :src="selectedBodyItem.comicBodyPhoto" alt="Comic Body Image" width="900" />       
        </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Header from "@/components/frontstage/basic/FrontstageHeader.vue";
import { useRoute } from 'vue-router';

const bodyData = ref([]);
const route = useRoute();
const props = defineProps(['comicId']);
const selectedBodyItem = ref(null); 



const fetchBodyData = async () => {
  try {
    const comicId = useRoute().params.comicId;

    // 確保 comicId 有效
    if (!comicId) {
      console.error('Invalid comicId:', comicId);
      return;
    }

    const bodyResponse = await axios.get(`http://localhost:8080/remecomic/comicbody/${comicId}`);
    
    // 檢查是否成功獲取漫畫正文
    if (bodyResponse.status === 200) {
      console.log('Selected Body Item:', bodyResponse.data);
      selectedBodyItem.value = bodyResponse.data;
    } else {
      console.error('Failed to fetch body data. Status:', bodyResponse.status);
    }
  } catch (error) {
    console.error('Error fetching body data:', error.message);
  }
};

onMounted(() => {
  fetchBodyData();
});
</script>


<style scoped>
.frontpageContainer {
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 2000px;
}
.white
{
color: rgb(255, 255, 255);
}
.row {
  width: 800px;
}

.row1 {
  width: 100%;
  position: fixed;
}

.logo {
  position: absolute;
  margin: 8px 0 0 5px;
}

.promo {
  position: absolute;
  top: 33px;
  left: 130px;
}

.promo::-webkit-scrollbar {
  display: none;
}

.searchButton {
  position: absolute;
  top: 32.5px;
  left: 36%;
}

.myComicBar {
  position: absolute;
  top: 36px;
  left: 38%;
}

.forumBar {
  position: absolute;
  top: 25px;
  left: 90%;
}

.helpCenterBar {
  position: absolute;
  top: 36px;
  left: 43.6%;
}

.userBar {
  position: absolute;
  top: 35px;
  left: 46%;
}

.row4 {
  position: absolute;
  top: 100px;
}

.comicArrange {
  z-index: 0;
}

.orderBy {
  position: absolute;
  top: 40%;
  left: 9%;
  z-index: 3;
}

.genre {
  position: fixed;
  top: 0px;
  z-index: 1;
}

.horizontalNavBar {
  position: fixed;
  top: 30%;
  right: 0%;
}

.borderLine {
  background-color: white;
  width: 100%;
  height: 1.6px;
  position: fixed;
  top: 400px;
}

.img {
  width: 200px;
height: 200px;
}
</style>
