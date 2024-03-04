<script setup xmlns:https="http://www.w3.org/1999/xhtml">
import httpClient from "@/main";
import {onMounted, reactive, ref, watch} from "vue";
import Pagination from "@/components/backstage/money/Pagination.vue";
import {useLoading} from "vue-loading-overlay";
import MyFavorite from "@/components/frontstage/money/MyFavorite.vue";
import Logo from "@/components/frontstage/basic/Logo.vue";
import FrontstageHeader from "@/components/frontstage/basic/FrontstageHeader.vue";


const userId = ref('')
const favoriteList = ref([]);
const currentPageNum = ref(1);
const totalPages = ref(1);
const {loading, show} = useLoading();
const storedUserId = localStorage.getItem("userId");
const username = ref('');
const userPhoto = ref('');

// Fetch Data

onMounted(() => {
  userId.value = localStorage.getItem("userId");
  getFavoriteByUserId();
})

async function getFavoriteByUserId() {
  const url = "/comicD/comicRating/findByPage";

  const ajaxOptions = {
    params: {
      p: currentPageNum.value,
      userId: userId.value
    }
  }

  try {
    const response = await httpClient.get(url, ajaxOptions);

    favoriteList.value = response.data.content;
    currentPageNum.value = response.data.pageable.pageNumber + 1;
    totalPages.value = response.data.totalPages;

    await findSpecificUserProperty();
  } catch (error) {
    console.log(error);
  }
}

const updatePageList = (somePage) => {
  currentPageNum.value = somePage;
}

watch(currentPageNum, getFavoriteByUserId);

async function findSpecificUserProperty() {
  const url = `/user/simpleuser/${userId.value}`;

  try {
    const response = await httpClient.get(url);

    username.value = response.data.name;
    userPhoto.value = response.data.userPhoto;
  } catch (error) {
    console.log(error);
  }
}

</script>

<template>
<!--  <div class="frontpageContainer">-->
<!--    <div class="row row1">-->
<!--      <Logo class="logo"/>-->
<!--    </div>-->
<!--  </div>-->

  <FrontstageHeader/>
  <body>
  <main>
    <section class="glass">
      <div class="dashboard">
        <div class="user">
           <img :src=userPhoto alt=""/>
          <h3>{{username}}</h3>
        </div>
        <div class="links">
          <div class="link">
            <a href="http://localhost:5173/frontstage/money/orders/">
              <img
                  src="https://firebasestorage.googleapis.com/v0/b/reme-a3b5c.appspot.com/o/flaticon%2Fshopping-bag.png?alt=media&token=b5a3d8e2-22df-4f5b-9df6-3356191097c3"
                  alt=""/>
              <h2>Orders</h2>
            </a>
          </div>
          <div class="link">
            <a href="http://localhost:5173/frontstage/money/myBooks/">
              <img
                  src="https://firebasestorage.googleapis.com/v0/b/reme-a3b5c.appspot.com/o/flaticon%2Flover.png?alt=media&token=ad9a4147-c846-42fe-8fa6-b6ccca270f65"
                  alt=""/>
              <h2>Favorite</h2>
            </a>
          </div>
        </div>
      </div>

      <div class="books">
        <div class="status">
          <h1>My Books</h1>
        </div>
        <MyFavorite
            v-for="favorite in favoriteList"

            :key="favorite.ratingComicId"
            :ratingComicId="favorite.ratingComicId"
            :userId="favorite.userId"
            :comicId="favorite.comicId"
            :like="favorite.like"
            :ratingDate="favorite.ratingDate"
        />

        <Pagination
            @updateMsgList="updatePageList"
            :totalPages="totalPages"
            :currentPageNum="currentPageNum"
        />
      </div>

    </section>
  </main>
  </body>

</template>

<style scoped>
.frontpageContainer {
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80px;
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

.user img {
  object-fit: contain;
  height: 200px;
  width: 200px;
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
  max-width: 20%;
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
  background: linear-gradient(to left top,
  rgba(255, 255, 255, 0.8),
  rgba(255, 255, 255, 0.5));
  border-radius: 1rem;
  margin: 2rem 0rem;
  padding: 2rem;
  box-shadow: 6px 6px 20px rgba(122, 122, 122, 0.212);
  justify-content: space-between;
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
  justify-content: space-between;
}

.percentage {
  font-weight: bold;
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

</style>