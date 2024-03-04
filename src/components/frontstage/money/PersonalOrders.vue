<script setup>
import {defineProps, onMounted, ref} from 'vue';
import moment from "moment";
import httpClient from "@/main";

const props = defineProps(['orderId', 'accountId', 'episodeId', 'orderDate', 'dueDate', 'price']);
const comicTitle = ref('')
const comicId = ref('');
const episodeCover = ref('');
const episodeNum = ref('');

// Fetch Data

onMounted(() => {
  getSimpleEpisodeById(props.episodeId);
})

/**
 * 時間格式轉成 YYYY/MM/DD HH:mm:ss
 * @param dateString
 * @returns {string}
 */
const formatDate = (dateString) => {
  // console.log(dateString);
  const date = moment(dateString);

  return date.format('YYYY/MM/DD HH:mm:ss');
};

/**
 * 取得comicTitle, episodeCover
 * @param episodeId
 * @returns {Promise<void>}
 */
async function getSimpleEpisodeById(episodeId) {
  const url = `/money/orders/ComicTitle/findByEpisode?episodeId=${episodeId}`;

  const url2 = `/comicD/simpleepisode?episodeId=${episodeId}`;

  try {
    const response = await httpClient.get(url);
    comicTitle.value = response.data.comicTitle;
    comicId.value = response.data.comicId;

    const response2 = await httpClient.get(url2);
    episodeCover.value = response2.data.episodeCover;
    episodeNum.value = response2.data.episodeNum;
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <div class="cards">

    <div class="card">
      <router-link :to="'/frontstage/comicD/comicRead/' + comicId">
        <img :src="episodeCover" alt=""/>
        <div class="card-info">
          <h2>{{ comicTitle }}: </h2>
          <h3>Episode: {{ episodeNum }}</h3>
          <h3>Price: {{ price }}&#128181</h3>
          <h6>OrderDate: {{ formatDate(orderDate) }}</h6>
          <h6>Expired: {{ formatDate(dueDate) }}</h6>
        </div>
      </router-link>
    </div>

  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h1 {
  color: #ddad4a;
  font-weight: 800;
  font-size: 3rem;
  opacity: 0.8;
}

h2,
p {
  color: #5475ce;
  font-weight: 700;
  opacity: 0.8;
}

h3 {
  color: #426696;
  font-weight: 600;
  opacity: 0.8;
}

main {
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background: linear-gradient(to right top, #191919, #000000);
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass {
  background: white;
  min-height: 80vh;
  width: 60%;
  background: linear-gradient(to right bottom,
  rgba(255, 255, 255, 0.7),
  rgba(255, 255, 255, 0.3));
  border-radius: 2rem;
  z-index: 2;
  backdrop-filter: blur(2rem);
  display: flex;
}

.circle1,
.circle2 {
  background: white;
  background: linear-gradient(to right bottom,
  rgba(255, 255, 255, 0.8),
  rgba(255, 255, 255, 0.3));
  height: 20rem;
  width: 20rem;
  position: absolute;
  border-radius: 50%;
}

.circle1 {
  top: 5%;
  right: 15%;
}

.circle2 {
  bottom: 5%;
  left: 10%;
}

.dashboard {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
  background: linear-gradient(to right bottom,
  rgba(255, 255, 255, 0.7),
  rgba(255, 255, 255, 0.3));
  border-radius: 2rem;
}

.link {
  display: flex;
  margin: 2rem 0rem;
  padding: 1rem 5rem;
  align-items: center;
}

.link a {
  cursor: pointer;
  transition: 0.2s all;
  display: inline-flex;
  text-decoration: none;
}

.link a:hover img {
  animation: pulse 2s infinite;
  transition: 0.2s;
  transform: scale(1.05);
}

.link a img {
  margin: 0 5px;
  max-width: 100%;
  height: auto;
  display: inline-block;
  vertical-align: middle;
}

.link a h2 {
  display: inline-block;
  vertical-align: middle;
}

.books {
  flex: 2;
}

.pro {
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  border-radius: 2rem;
  color: white;
  padding: 1rem;
  margin: 0 0.5em;
  position: relative;
}

.pro img {
  position: absolute;
  top: -10%;
  right: 10%;
}

.pro h2 {
  width: 45%;
  color: white;
  font-weight: 800;
}

/* BOOKS */
.status {
  margin-bottom: 3rem;
}

.status input {
  background: linear-gradient(to right bottom,
  rgba(255, 255, 255, 0.7),
  rgba(255, 255, 255, 0.3));
  border: none;
  width: 50%;
  padding: 0.5rem;
  border-radius: 2rem;
}

.books {
  margin: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.card {
  display: flex;
  flex-direction: row;
  background: linear-gradient(to left top,
  rgba(255, 255, 255, 0.8),
  rgba(255, 255, 255, 0.5));
  border-radius: 1rem;
  margin: 2rem 0rem;
  padding: 2rem;
  box-shadow: 6px 6px 20px rgba(122, 122, 122, 0.212);
//justify-content: space-between;
}

.card :hover {
  animation: pulse 2s infinite;
  transition: 0.2s;
  transform: scale(1.05);
}

.card img {
  max-width: 20%;
  height: auto;
}

.progress {
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  width: 100%;
  height: 25%;
  border-radius: 1rem;
  position: relative;
  overflow: hidden;
}

.progress::after {
  content: "";
  width: 100%;
  height: 100%;
  background: rgb(236, 236, 236);
  position: absolute;
  left: 60%;
}

.card-info {
  display: flex;
  flex-direction: column;
//justify-content: space-between; justify-content: center;
  text-align: left;
  margin-left: 10%;
}

.percentage {
  font-weight: bold;
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

a {
  cursor: pointer;
  transition: 0.2s all;
  display: inline-flex;
  text-decoration: none;
  color: black;
}
</style>