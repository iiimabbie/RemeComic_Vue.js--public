<script setup>
import {onMounted, ref, watch} from "vue";
import CouponList from "@/components/backstage/money/CouponList.vue";
import httpClient from "@/main";
import Loading from "@/components/backstage/Basic/Loading.vue";
import {useLoading} from "vue-loading-overlay";
import TypeWriter from "@/components/backstage/Basic/TypeWriter.vue";
import Pagination from "@/components/backstage/money/Pagination.vue";

const couponList = ref([]);
const currentPageNum = ref(1);
const totalPages = ref(1);
const {loading, show} = useLoading();

// Fetch data method

onMounted(() => {
  showCouponContent();
})

/**
 * Get data from "Coupon" by "findAllByPage"
 * @returns {Promise<void>}
 */
async function showCouponContent() {
  const loader = show();
  // loading.value = true;
  const ajaxOptions = {
    params: {
      p: currentPageNum.value
    }
  }

  try {
    const response = await httpClient.get('/money/couponCodes/findAllByPage', ajaxOptions);

    couponList.value = response.data.content;
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

watch(currentPageNum, showCouponContent);

</script>

<template>
  <div class="container-fluid">
    <!--Logo-->
    <!--    <div class="row row1">-->
    <!--      <div class="col-md-2 col-lg-2 d-md-block sidebar">-->
    <!--        <router-link to="/frontstage/home">-->
    <!--          <img id='logo-black'-->
    <!--               src="https://firebasestorage.googleapis.com/v0/b/remetest-e1cbe.appspot.com/o/Basic%2FLogo_Black.png?alt=media&token=8a00ea4e-0872-4569-aa92-7c3e825d0d90"-->
    <!--               alt="RemeLogo">-->
    <!--          <img id='logo-fantuan'-->
    <!--               src="https://firebasestorage.googleapis.com/v0/b/remetest-e1cbe.appspot.com/o/Basic%2F%E7%AE%A1%E7%90%86%E5%93%A1.png?alt=media&token=e510767f-e7a3-465e-8a72-4d34caf275b4"-->
    <!--               alt="RemeLogo">-->
    <!--        </router-link>-->
    <!--      </div>-->

    <!--    </div>-->

    <div class="row">
      <!-- Sidebar -->
      <!--      <div class="col-md-2 col-lg-2 d-md-block sidebar">-->
      <!--        <Sidebar/>-->
      <!--      </div>-->
      <!-- MainContent -->
      <main class="main-header2 col-md-10 col-lg-10 d-md-block">
        <div class="container">

          <!--This is typewriter animation-->
          <TypeWriter
              :string1="'Coupon Records'"
              :string2="'優惠券記錄'"
              :string3="'Enregistrements De Coupons'"
          />

          <!--This is loading animation-->
          <Loading
              :loading="loading"
          />

          <div v-if="!loading">
            <table class="table table-hover">
              <thead>
              <tr>
<!--                <th>UserId</th>-->
                <th>Username</th>
<!--                <th>PromotionId</th>-->
                <th>PromotionName</th>
                <th>CouponCode</th>
                <th>CouponCoin</th>
                <th>Start</th>
                <th>Expired</th>
                <th>IsUsed</th>
              </tr>
              </thead>

              <CouponList
                  v-for="coupon in couponList"

                  :key="coupon.couponId"
                  :couponId="coupon.couponId"
                  :userId="coupon.userId"
                  :promotionId="coupon.promotionId"
                  :couponCode="coupon.couponCode"
                  :couponCoin="coupon.couponCoin"
                  :start="coupon.start"
                  :expired="coupon.expired"
                  :isUsed="coupon.isUsed"
              />
            </table>

            <Pagination
                @updateMsgList="updatePageList"
                :totalPages="totalPages"
                :currentPageNum="currentPageNum"
            />

<!--            <div class="text-center">-->
<!--              <router-link to="/backstage/money/coupon/add" class="btn btn-success">-->
<!--                Create New Coupon-->
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