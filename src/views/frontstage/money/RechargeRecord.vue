<script setup>
import httpClient from "@/main";
import {onMounted, reactive, ref, watch} from "vue";
import Pagination from "@/components/backstage/money/Pagination.vue";
import Loading from "@/components/backstage/Basic/Loading.vue";
import {useLoading} from "vue-loading-overlay";
import PersonalRechargeRecord from "@/components/frontstage/money/PersonalRechargeRecord.vue";


const rechargeRecordList = ref([]);
const currentPageNum = ref(1);
const totalPages = ref(1);
const {loading, show} = useLoading();

// Fetch Data

onMounted(() => {
  getRechargeRecordByUserId();
})
async function getRechargeRecordByUserId() {
  const url = "/money/recharge/findUserByPage";

  const ajaxOptions = {
    params: {
      p: currentPageNum.value,
      userId: 1
    }
  }

  try {
    const response = await httpClient.get(url, ajaxOptions);

    console.log(response.data)

    rechargeRecordList.value = response.data.content;
    currentPageNum.value = response.data.pageable.pageNumber + 1;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.log(error);
  }
}

const updatePageList = (somePage) => {
  currentPageNum.value = somePage;
}

watch(currentPageNum, getRechargeRecordByUserId);

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
            <th>RechargeId</th>
            <th>AccountId</th>
            <th>RechargeAmount</th>
            <th>RechargeDate</th>
            <th>CoinType</th>
          </tr>
          </thead>

          <PersonalRechargeRecord
              v-for="rechargeRecord in rechargeRecordList"

              :key="rechargeRecord.rechargeId"
              :rechargeId="rechargeRecord.rechargeId"
              :accountId="rechargeRecord.accountId"
              :rechargeAmount="rechargeRecord.rechargeAmount"
              :rechargeDate="rechargeRecord.rechargeDate"
              :coinType="rechargeRecord.coinType"
          />
        </table>


        <Pagination
            @updateMsgList="updatePageList"
            :totalPages="totalPages"
            :currentPageNum="currentPageNum"
        />

      </div>

    </div>
  </main>

</template>

<style scoped>

</style>