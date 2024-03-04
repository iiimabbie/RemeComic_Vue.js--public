<script setup>
import Sidebar from '@/components/backstage/basic/Sidebar.vue'
import {onMounted, ref} from "vue";
import httpClient from "@/main.js";
import {useLoading} from "vue-loading-overlay";
import Swal from "sweetalert2";

const promotionId = ref(null);
const couponCode = ref('');
const couponCoin = ref('');
const start = ref('');
const expired = ref('');
const {loading, show} = useLoading();
const promoList = ref([]);

// Fetch Data
onMounted(() => {
  loadAllPromo();
})

async function createCoupon() {
  const loader = show();

  const url = '/money/couponCodes/createForAll';

  try {
    await httpClient.post(url, {
      "promotionId": promotionId.value,
      "couponCode": couponCode.value,
      "couponCoin": couponCoin.value,
      "start": start.value,
      "expired": expired.value
    });

    loader.hide();

    await Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Coupons Created Successfully'
    });

    console.log('Coupons Created Successfully');
  } catch (err) {
    loader.hide();

    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error Creating Coupons'
    });

    console.error('Error Creating Coupons:', err.message);
  } finally {
    loader.hide();

    clearInput();
  }
}

function demo() {
  const answerInput1 = document.querySelector('[name=couponCode]');
  const answerInput2 = document.querySelector('[name=couponCoin]');
  const answerInput3 = document.querySelector('[name=StartDate]');
  const answerInput4 = document.querySelector('[name=EndDate]');

  const answer1 = 'codeStar';
  const answer2 = '100';
  const answer3 = '2023-12-28T01:00';
  const answer4 = '2024-01-04T01:00';

  if (answerInput1) {
    answerInput1.value = answer1;
    couponCode.value = answer1
  }

  if (answerInput2) {
    answerInput2.value = answer2;
    couponCoin.value = answer2;
  }

  if (answerInput3) {
    answerInput3.value = answer3;
    start.value = answer3;
  }

  if (answerInput4) {
    answerInput4.value = answer4;
    expired.value = answer4;
  }
}

async function loadAllPromo() {
  const url = '/money/promotion/findAll';

  try {
    const response = await httpClient.get(url);

    promoList.value = response.data;
    console.log(promoList.value);
  } catch (err) {
    console.error(err);
  }
}

function clearInput() {
  promotionId.value = null;
  couponCode.value = '';
  couponCoin.value = '';
  start.value = '';
  expired.value = '';
}

</script>

<template>
  <div class="container-fluid">

    <div class="row">

      <!-- MainContent -->
      <main class="main-header2 col-md-10 col-lg-10 d-md-block">

        <!-- PromoSelection -->
        <div class="mb-3">
          <label for="promoDropdown" class="form-label">Selection：</label>
          <select v-model="promotionId" name="promo" class="form-select">
            <option v-for="promo in promoList"
                    :key="promo.promotionId"
                    :value="promo.promotionId">
              {{ promo.promotionName }}
            </option>
          </select>
        </div>

        <!-- CouponCode -->
        <div class="mb-3">
          <label for="couponCode" class="form-label">CouponCode：</label>
          <input type="text" v-model.trim="couponCode" name="couponCode" class="form-control">
        </div>

        <!-- CouponCoin -->
        <div class="mb-3">
          <label for="couponCoin" class="form-label">CouponCoin：</label>
          <input type="text" v-model.trim="couponCoin" name="couponCoin" class="form-control">
        </div>

        <!-- StartDate -->
        <div class="mb-3">
          <label for="StartDate" class="form-label">StartDate：</label>
          <input type="datetime-local" v-model="start" name="StartDate" class="form-control">
        </div>

        <!-- EndDate -->
        <div class="mb-3">
          <label for="EndDate" class="form-label">EndDate：</label>
          <input type="datetime-local" v-model="expired" name="EndDate" class="form-control">
        </div>

        <!-- Submit -->
        <div>
          <button @click="createCoupon()"><span>Submit</span></button>
        </div>
        <br/>
        <div>
          <button @click="demo()"><span>Demo</span></button>
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