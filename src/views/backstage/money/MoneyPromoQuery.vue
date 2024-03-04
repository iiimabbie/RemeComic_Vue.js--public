<script setup>
import {onMounted, ref, watch} from "vue";
import PromotionList from "@/components/backstage/money/PromotionList.vue";
import httpClient from "@/main";
import Loading from "@/components/backstage/Basic/Loading.vue";
import {useLoading} from "vue-loading-overlay";
import TypeWriter from "@/components/backstage/Basic/TypeWriter.vue";
import Pagination from "@/components/backstage/money/Pagination.vue";

const promotionList = ref([]);
const currentPageNum = ref(1);
const totalPages = ref(1);
const {loading, show} = useLoading();
// const loading = ref(false)
const status = ref(0);

// Fetch data method

onMounted(() => {
  showPromotionContent();
})

/**
 * Get data from "Promotion" by "findAllByPage"
 * @returns {Promise<void>}
 */
async function showPromotionContent() {
  const loader = show();

              
  const ajaxOptions = {
    params: {
      p: currentPageNum.value
    }
  }

  try {
    const response = await httpClient.get('/money/promotion/findAllByPage', ajaxOptions);
    console.log(response);

    // response.data.content.forEach(promotion => {
    //   console.log(promotion.startDate);
    // });

    promotionList.value = response.data.content;
    console.log(promotionList.value)

    currentPageNum.value = response.data.pageable.pageNumber + 1;
    totalPages.value = response.data.totalPages;
  } catch (err) {
    console.log(err);
  } finally {
    loader.hide();
    // loading.value = false;
  }
}

const updatePageList = (somePage) => {
  currentPageNum.value = somePage;
}

watch(currentPageNum, showPromotionContent);

const renewPage = (something) => {
  status.value += something;
}

watch(status, showPromotionContent)

</script>

<template>
  <div class="container-fluid">

    <div class="row">
      <!-- MainContent -->
      <main class="main-header2 col-md-10 col-lg-10 d-md-block">
        <div class="container">

          <!--This is typewriter animation-->
          <TypeWriter
              :string1="'Promotion Records'"
              :string2="'活動記錄'"
              :string3="'Dossiers De Promotion'"
          />

          <!--This is loading animation-->
          <Loading
              :loading="loading"
          />

          <div v-if="!loading">

            <table class="table table-hover">
              <thead>
              <tr>
<!--                <th>PromotionId</th>-->
                <th>PromotionName</th>
                <th>PromotionDescription</th>
                <th>PromotionStartDate</th>
                <th>PromotionEndDate</th>
                <th>Actions</th>
              </tr>
              </thead>

              <PromotionList
                  v-for="promotion in promotionList"

                  :key="promotion.promotionId"
                  :promotionId="promotion.promotionId"
                  :promotionName="promotion.promotionName"
                  :promotionDesc="promotion.promotionDesc"
                  :promotionStartDate="promotion.startDate"
                  :promotionEndDate="promotion.endDate"

                  @updateByEditOrDelete="renewPage"
              />
            </table>
<!--            <PromotionList-->
<!--                v-for="promotion in promotionList"-->

<!--                :key="promotion.promotionId"-->
<!--                :promotionId="promotion.promotionId"-->
<!--                :promotionName="promotion.promotionName"-->
<!--                :promotionDesc="promotion.promotionDesc"-->
<!--                :promotionStartDate="promotion.startDate"-->
<!--                :promotionEndDate="promotion.endDate"-->
<!--            />-->

            <Pagination
                @updateMsgList="updatePageList"
                :totalPages="totalPages"
                :currentPageNum="currentPageNum"
            />

<!--            <div class="text-center">-->
<!--              <router-link to="/backstage/money/promotion/add" class="btn btn-success">-->
<!--                Create New Promotion-->
<!--              </router-link>-->
<!--            </div>-->
          </div>

        </div>
      </main>

    </div>

  </div>
</template>

<style scoped>
.row1 {
  display: flex;
  align-items: end;
  margin: 15px 20px 0px 0;
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

.main-header {
  margin: 30px 0px 0 0;
}

.main-header {
  display: flex;
  align-items: flex-end;
}

.input-icon {
  position: absolute;
  left: 170px;
  top: 50%;
  transform: translateY(-50%);
}

.input-icon-wrapper input {
  padding-left: 30px;
}

.main-header2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  max-width: 1000px;
  width: 100%;
}
</style>