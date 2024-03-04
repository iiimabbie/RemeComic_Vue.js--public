<template>
  <div class="frontpageContainer">
    <Header class="header"/> 
    <table class="sideBar">
      <tr>
        <td>
          <router-link to="/frontstage/orgcomic/orgaddinfo" class="routerLink">
            <label style="float: left">AddOrgComicInfo</label>
          </router-link>
        </td>
        <td>
          <router-link to="/frontstage/orgcomic/orgaddbody" class="routerLink">
            <label style="float: right">AddOrgComicBody</label>
          </router-link>  
        </td>
      </tr>
    </table>
    <div class="comicDisplayContainer">
      <div v-if="!dataLoaded" class="white">Loading...</div>
      <table class="comicDisplay" v-else-if="coverData.length > 0">
        <tr v-for="coverItem in coverData" :key="coverItem.comicId" @click="navigateToBodyPage(coverItem)">
          <td>
            <router-link :to="{ name: 'orgshowcomicbody', params: { comicId: coverItem.comicId } }">
              <img :src="coverItem.orgComicCover" alt="coverImage" style="margin-bottom: 50px;"/>
            </router-link> 
          </td>
          <td class="comicInfo">
            <label>{{ coverItem.comicName  }}</label>
            <br>
            <br>
            <p><label>Genre: </label> {{ mapGenre(coverItem.genreid) }}</p>
            <br>
            <h1>Introduction:</h1>
            <p>{{ coverItem.introduction }}</p>
          </td>
        </tr>
        <button @click="scrollToTop" v-show="showButton" id="myBtn" title="Go to top" style="
          display: none;
          position: fixed;
          bottom: 20px;
          right: 30px;
          z-index: 1000;
          border: none;
          outline: none;
          background-color: transparent;
          color: transparent;
          cursor: pointer;
          padding: 0;
          border-left: 30px solid transparent;
          border-right: 30px solid transparent;
          border-bottom: 52.0px solid red; 
          border-radius: 0;
          font-size: 0;
          line-height: 0;
        "></button>
      </table>
      <div v-else>
        No Data
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import axios from 'axios';
import Header from "@/components/frontstage/basic/FrontstageHeader.vue";
import { useRouter } from 'vue-router';

const coverData = ref([]);
const bodyData = ref([]);
const route = useRouter();
const showButton = ref(false);
const dataLoaded = ref(false);


const mapGenre = (genreId) => {
  const genreMap = {
    "1": "romance",
    "2": "action",
    "3": "comedy",
    "4": "thriller",
    "5": "life",
    "6": "drama",
    "7": "fantasy",
    "9": "TeenageGirl",
    "15": "adventure"
  };
  return genreMap[genreId] || "Unknown Genre";
};


const fetchBackendData = async () => {
  try {
    dataLoaded.value = true;

    const coverResponse = await axios.get('http://localhost:8080/remecomic/orgcomic/all');

    const imageLoadingPromises = coverResponse.data.map((comic) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = comic.orgComicCover;
        img.onload = () => {
          if (comic.verify === 1 || comic.verify === 3) {
            coverData.value.push(comic);
          }
          resolve();
        };
      });
    });

    await Promise.all(imageLoadingPromises);

    console.log('All images loaded.');

    console.log('Before sorting:', coverData.value.map(item => item.comicId));

    coverData.value.sort((a, b) => a.comicId - b.comicId);

    await nextTick();

    console.log('After sorting:', coverData.value.map(item => item.comicId));

    dataLoaded.value = false;

  } catch (error) {
    console.error('Error fetching backend data:', error);
  }
};

const navigateToBodyPage = async (coverItem) => {
  const correspondingBodyItem = bodyData.value.find(bodyItem => bodyItem.comicId.toString() === coverItem.comicId.toString());

  if (correspondingBodyItem) {
    correspondingBodyItem.show = true;
    await route.push({ name: 'orgshowcomicbody', params: { comicId: correspondingBodyItem.comicId } });
  } 
};

const scrollFunction = () => {
  console.log('showButton:', showButton.value);
  showButton.value = window.scrollY > 20;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  fetchBackendData();
  window.addEventListener('scroll', scrollFunction);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollFunction);
});
</script>

<style scoped>
.frontpageContainer {
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  width:100vw;
  height:100vh;
}
.header{
  position:fixed;
  z-index:9;
}
.sideBar{
  position:absolute;
  top:10%;
  left:3%;
  z-index:19;
  width:30vw;
}
.sideBar tr{
  height:80px;
  font-size:30px;
  color:rgb(148, 198, 249);
}
.routerLink{
  text-decoration: none; 
  color:rgb(137, 214, 240);
}
.routerLink label:hover{
  transform:scale(1.2);
  color:rgb(110, 162, 235);
  cursor:pointer;
}
.comicDisplayContainer{
  position:absolute;
  top:20%;
  width:100vw;
  overflow-x:hidden;
  background-color: black;
}
.comicDisplayContainer td{
  vertical-align: top;
  padding: 0 0 0 20px;
}
.comicDisplay img{
  margin:0 0 0 50px;
  width:20vw;
}
.comicInfo label{
  font-size:45px;
}
.comicInfo{
  color:white;
  font-size:30px;
}
.genreLabel {
  font-size: 35px;
}
.myBtn {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 30px; 
  z-index: 1000; 
  border: none; 
  outline: none; 
  background-color: red; 
  color: white; 
  cursor: pointer; 
  padding: 15px; 
  border-radius: 10px; 
  font-size: 18px; 
}

.myBtn:hover {
  background-color: #555; 
}
</style>
