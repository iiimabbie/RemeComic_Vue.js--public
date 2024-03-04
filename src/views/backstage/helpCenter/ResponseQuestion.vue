<template>
  <div>
    <div v-show="isShow">
      <h2>Response Question</h2>
      <ag-grid-vue
        class="ag-theme-material"
        style="height: 500px"
        :columnDefs="reportDefs"
        :rowData="reports"
        :defaultColDef="defaultColDef"
        :gridOptions="gridOptions"
      ></ag-grid-vue>
    </div>
    <div v-show="!isShow" v-if="report">
      <h2>Response Report (No. {{ report.reportId }})</h2>
      <br />
      <!-- 問題 -->
      <div class="border">
        <div class="flex c30">
          <h3>
            <span>[{{ getReportCategory(report) }}]</span>
            {{ report.reportTitle }}
          </h3>
          <p class="fz24">{{ report.reportCurrentDate }}</p>
        </div>
        <p class="bold-text">
          User: <span class="normal-text">{{ report.userName }}</span
          ><span class="normal-text">({{ report.userId }})</span>
        </p>
        <p class="bold-text">
          Report Time:
          <span class="normal-text">{{
            toDisplayFormat(report.reportDate)
          }}</span>
        </p>
        <p class="bold-text">
          Report Content:
          <span class="normal-text">{{ report.reportContent }}</span>
        </p>
        <img
          class="w-max"
          :src="base64ToImage(report.reportPhoto)"
          alt="Photo"
        />
      </div>
      <br />
      <!-- 回覆 -->
      <div>
        <div class="mb-3">
          <label for="inputContent" class="form-label">Response Content: </label>
          <textarea
            type="text"
            class="form-control"
            id="inputContent"
            style="height: 100px"
          />
        </div>
      </div>
      <div class="flex c30">
        <button
          type="submit"
          class="btn btn-outline-primary"
        >
          Submit
        </button>
        <button
          type="button"
          class="btn btn-outline-primary"
          @click="cancelToList"
        >
          Cancel
        </button>
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import httpClient from "@/main.js";
import ResponseBtn from "@/components/backstage/helpCenter/ResponseBtn.vue";

const report = ref(null);
const reports = ref([]);
const isShow = ref(true);

onMounted(() => {
  fetchData();
});

const toDisplayFormat = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(dateString)
  );

  const [datePart, timePart] = formattedDate.split(", "); // 分割日期和時間部分
  const [month, day, year] = datePart.split("/"); // 分割月、日、年

  return `${year}/${month.padStart(2, "0")}/${day.padStart(
    2,
    "0"
  )} ${timePart}`;
};

const getCategoryLabel = (params) => {
  const categoryId = parseInt(params.value, 10);
  // console.log("categoryId: " + categoryId)
  switch (categoryId) {
    case 1:
      return "Comic";
    case 2:
      return "User";
    case 3:
      return "Money";
    case 4:
      return "Promotion";
    case 5:
      return "Order";
    case 6:
      return "Reading";
    default:
      return "Unknown";
  }
};

const getReportCategory = (report) => {
  const categoryId = parseInt(report.category, 10);
  switch (categoryId) {
    case 1:
      return "Comic";
    case 2:
      return "User";
    case 3:
      return "Money";
    case 4:
      return "Promotion";
    case 5:
      return "Order";
    case 6:
      return "Reading";
    default:
      return "Unknown";
  }
};

const getStatusLabel = (params) => {
  const statusId = params.value;
  switch (statusId) {
    case 1:
      return "Not Processed";
    case 2:
      return "Processed";
    case 3:
      return "Closed";
    default:
      return "Unknown";
  }
};

const reportDefs = [
  { field: "reportId", width: 80 },
  { field: "response", width: 110, cellRenderer: "responseBtn" },
  { field: "userId", width: 80 },
  { field: "userName", width: 140 },
  { field: "category", width: 120, valueFormatter: getCategoryLabel },
  { field: "reportTitle", width: 200 },
  { field: "reportContent", width: 350 },
  { field: "reportCurrentDate" },
  { field: "reportDate" },
  { field: "reportStatus", valueFormatter: getStatusLabel },
  { field: "reportPhoto" },
];

// 表單與report資料切換
const handleResponseBtn = (reportId) => {
  isShow.value = !isShow.value;
  changeData(reportId);
};

const cancelToList = () => {
  isShow.value = !isShow.value;
};

// 表單資料
const fetchData = () => {
  httpClient
    .get("/helpcenter/allReport")
    .then((response) => response.data)
    .then((data) => {
      (reports.value = data), console.log(reports.value);
    })
    .catch((error) => console.log(error));
};

// report資料
const changeData = async (id) => {
  await httpClient
    .get(`/helpcenter/report/${id}`)
    .then((response) => {
      report.value = response.data;
    })
    .catch((error) => console.log(error));
};

//report資料內圖片轉換
const base64ToImage = (base64String) => {
  return `data:image/jpeg;base64, ${base64String}`;
};

const gridOptions = {
  components: {
    responseBtn: ResponseBtn,
  },
  context: {
    responseBtn: handleResponseBtn,
  },
};

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  editable: true,
  width: 150,
};
</script>

<style scoped>
.border {
  border: 1px solid #000;
  border-radius: 20px;
  padding: 20px;
}
.bold-text {
  font-weight: bold;
  font-size: 20px;
}
.fz24 {
  font-size: 24px;
}
.normal-text {
  font-weight: normal;
  font-size: 16px;
}
.flex {
  display: flex;
}
.pd-right {
  padding-right: 20px;
}
.c30 {
  column-gap: 50px;
}
.w-max {
  max-width: 1300px;
}
</style>
