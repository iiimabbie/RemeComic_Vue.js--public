<script setup>
import httpClient from "@/main";
import {onMounted, reactive, ref, watch} from "vue";
import Pagination from "@/components/backstage/money/Pagination.vue";
import Loading from "@/components/backstage/Basic/Loading.vue";
import {useLoading} from "vue-loading-overlay";
import PersonalRechargeRecord from "@/components/frontstage/money/PersonalRechargeRecord.vue";
import MyFavorite from "@/components/frontstage/money/MyFavorite.vue";


const favoriteList = ref([]);
const currentPageNum = ref(1);
const totalPages = ref(1);
const {loading, show} = useLoading();

// Fetch Data

onMounted(() => {
  getFavoriteByUserId();
})

async function getFavoriteByUserId() {
  const url = "/comicD/comicRating/findByPage";

  const ajaxOptions = {
    params: {
      p: currentPageNum.value,
      userId: 1
    }
  }

  try {
    const response = await httpClient.get(url, ajaxOptions);

    favoriteList.value = response.data.content;
    currentPageNum.value = response.data.pageable.pageNumber + 1;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.log(error);
  }
}

const updatePageList = (somePage) => {
  currentPageNum.value = somePage;
}

watch(currentPageNum, getFavoriteByUserId);

</script>

<template>
  <main class="main-header2 col-md-10 col-lg-10 d-md-block">
    <div class="container">

      <!--This is loading animation-->
      <Loading
          :loading="loading"
      />

      <div v-if="!loading">

        <table class="table table-hover">
          <thead>
          <tr>
            <th>ComicTitle</th>
            <th>comicCover</th>
          </tr>
          </thead>

          <MyFavorite
              v-for="favorite in favoriteList"

              :key="favorite.ratingComicId"
              :ratingComicId="favorite.ratingComicId"
              :userId="favorite.userId"
              :comicId="favorite.comicId"
              :like="favorite.like"
              :ratingDate="favorite.ratingDate"
          />
        </table>


<!--        <Pagination-->
<!--            @updateMsgList="updatePageList"-->
<!--            :totalPages="totalPages"-->
<!--            :currentPageNum="currentPageNum"-->
<!--        />-->

      </div>

    </div>
  </main>

</template>

<style scoped>

</style>