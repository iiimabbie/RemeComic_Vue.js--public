<script setup>
import {ref} from "vue";
import httpClient from "@/main";

const userId = ref(1);
const rechargeAmount = ref(0);
const responseHtml = ref('');
const rechargeUrl = ref(`http://localhost:8080/remecomic/money/recharge?
userId=${userId.value}&rechargeAmount=${rechargeAmount.value}`);

const handleSubmitButtonClick = () => {
  window.open(`http://localhost:8080/remecomic/money/recharge?userId=${userId.value}&rechargeAmount=${rechargeAmount.value}`, '_blank');

}

// Fetch Data

async function rechargeTest() {
  const url = `/money/recharge?userId=${userId.value}`;

  try {
    const response = await httpClient.post(url, {
      "rechargeAmount": rechargeAmount.value
    });
  } catch (error) {
    console.log(error);
  }
}

</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <main class="main-header2 col-md-10 col-lg-10 d-md-block">

        <!-- Recharge -->
        <div class="mb-3">
          <label for="rechargeAmount" class="form-label">RechargeAmount：</label>
          <input type="text" v-model.trim="rechargeAmount" name="rechargeAmount" class="form-control">
          <button @click="handleSubmitButtonClick">
            <span>Submit</span>
          </button>
        </div>

        <!-- Submit -->
        <!--        <button @click="rechargeTest()" class="btn btn-primary"><span>Submit</span></button>-->
        <!--        <a :href=rechargeUrl>-->
        <!--          <span>Submit</span>-->
        <!--          {{rechargeAmount}}-->
        <!--        </a>-->

      </main>
    </div>

    <!--    <div v-if="responseHtml" v-html="responseHtml"></div>-->
  </div>

</template>

<style scoped>
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

button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background: #183153;
  font-family: "Montserrat", sans-serif;
  box-shadow: 0px 6px 24px 0px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: none;
}

button:after {
  content: " ";
  width: 0%;
  height: 100%;
  background: #FFD401;
  position: absolute;
  transition: all 0.4s ease-in-out;
  right: 0;
}

button:hover::after {
  right: auto;
  left: 0;
  width: 100%;
}

button span {
  text-align: center;
  text-decoration: none;
  width: 100%;
  padding: 3px 5px;
  color: #fff;
  font-size: 1.125em;
  font-weight: 700;
  letter-spacing: 0.3em;
  z-index: 20;
  transition: all 0.3s ease-in-out;
}

button:hover span {
  color: #183153;
  animation: scaleUp 0.3s ease-in-out;
}

@keyframes scaleUp {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}
</style>