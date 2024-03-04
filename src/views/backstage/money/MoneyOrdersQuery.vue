<script setup>
import {onMounted, ref, watch} from "vue";
import OrderList from "@/components/backstage/money/OrderList.vue";
import httpClient from "@/main";
import Loading from "@/components/backstage/Basic/Loading.vue";
import {useLoading} from "vue-loading-overlay";
import TypeWriter from "@/components/backstage/Basic/TypeWriter.vue";
import Pagination from "@/components/backstage/money/Pagination.vue";

const orderList = ref([]);
const currentPageNum = ref(1);
const totalPages = ref(1);
const {loading, show} = useLoading();


// Fetch data method

onMounted(() => {
  showOrdersContent();
})

/**
 * Get data from "Order" by "findAllByPage"
 * @returns {Promise<void>}
 */
async function showOrdersContent() {
  const loader = show();

  const ajaxOptions = {
    params: {
      p: currentPageNum.value
    }
  }

  try {
    const response = await httpClient.get('/money/orders/findAllByPage', ajaxOptions);
    console.log(response);

    orderList.value = response.data.content;
    console.log(orderList.value)

    currentPageNum.value = response.data.pageable.pageNumber + 1;
    totalPages.value = response.data.totalPages;
  } catch (err) {
    console.log(err);
  } finally {
    loader.hide();
  }
}

const updatePageList = (somePage) => {
  currentPageNum.value = somePage;
}

watch(currentPageNum, showOrdersContent);

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
              :string1="'Order Records'"
              :string2="'訂單記錄'"
              :string3="'Enregistrements De Commandes'"
          />

          <!--This is loading animation-->
          <Loading
              :loading="loading"
          />

          <div v-if="!loading">

            <table class="table table-hover">
              <thead>
              <tr>
                <th>OrderId</th>
                <th>Username</th>
                <th>ComicTitle</th>
                <th>OrderDate</th>
                <th>DueDate</th>
                <th>Price</th>
              </tr>
              </thead>
              <OrderList
                  v-for="order in orderList"

                  :key="order.orderId"
                  :orderId="order.orderId"
                  :accountId="order.accountId"
                  :episodeId="order.episodeId"
                  :orderDate="order.orderDate"
                  :dueDate="order.dueDate"
                  :price="order.price"
              />
            </table>
            <Pagination
                @updateMsgList="updatePageList"
                :totalPages="totalPages"
                :currentPageNum="currentPageNum"
            />

            <div class="text-center">
            </div>
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