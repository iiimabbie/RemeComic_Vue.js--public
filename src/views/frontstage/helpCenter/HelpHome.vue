<template>
  <div class="bg-local">
    <!-- header -->
    <Header />
    <br />
    <main class="bgc-black">
      <div class="container">
        <h1 class="white">Question & Answer</h1>
        <br />
        <div>
          <OpenBtn />
        </div>
      </div>
      <br />
      <br />
      <div class="flex container">
        <div class="flex1">
          <h1 class="white point inline-block bd" @click="goReport">Report Question</h1>
        </div>
        <div class="flex1">
          <h1 class="white point inline-block bd">Customer Support</h1>
        </div>
      </div>
      <TopBtn />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import OpenBtn from "@/components/frontstage/helpCenter/OpenBtn.vue";
import Header from "@/components/frontstage/basic/FrontstageHeader.vue";
import TopBtn from "@/components/frontstage/helpCenter/TopBtn.vue";
import { useCounterStore } from "@/stores/counter";

const router = useRouter();
const counterStore = useCounterStore();

const goReport = () => {
  if(localStorage.getItem("userId")){
    router.push('/frontstage/help/requestQuestion')
  }else{
    counterStore.login();
  }
}
</script>

<style scoped>
*{
box-sizing: border-box;
padding: 0;
max-width: 100%;
overflow-x: hidden;
}
h1{
  overflow: hidden;
}
.bg-local{
  min-height: 932px;
  background-color: #000;
}
.white {
  color: white;
}
.flex {
  display: flex;
  justify-content: center;
  align-content: center;
}
.flex1 {
  flex: 1;
  text-align: center;
  padding: 100px 0;
}
.point {
  cursor: pointer;
}
.inline-block{
  display: inline-block;
}
.bd{
  border: 1px solid #fff;
  border-radius: 10px;
  padding: 30px;
}
</style>