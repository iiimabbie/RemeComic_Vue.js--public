<script setup xmlns="http://www.w3.org/1999/html">
import {onMounted, ref} from "vue";
import moment from "moment";
import httpClient from "@/main";
import {useLoading} from "vue-loading-overlay";
import Swal from "sweetalert2";

const comicId = ref(null);
const promotionName = ref('');
const promotionDesc = ref('');
const startDate = ref('');
const endDate = ref('');
const {loading, show} = useLoading();
const comicList = ref([]);

// Fetch Data
onMounted(() => {
  loadAllComic();
})

async function createPromo() {
  const loader = show();

  const url = '/money/promotion/create?comicId=' + comicId.value;

  console.log(comicId.value)
  console.log(promotionName.value)
  try {
    await httpClient.post(url, {
      "promotionName": promotionName.value,
      "promotionDesc": promotionDesc.value,
      "startDate": startDate.value,
      "endDate": endDate.value
    });

    loader.hide();

    await Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Promotion created successfully'
    });

    console.log('Promotion created successfully');
  } catch (err) {
    loader.hide();

    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error creating promotion'
    });

    console.error('Error creating promotion:', err.message);
  } finally {
    loader.hide();

    clearInput();
  }
}

function demo() {
  const answerInput1 = document.querySelector('[name=promotionName]');
  const answerInput2 = document.querySelector('[name=Description]');
  const answerInput3 = document.querySelector('[name=StartDate]');
  const answerInput4 = document.querySelector('[name=EndDate]');

  const answer1 = '"Star of Devotion" Reader Appreciation Event';
  const answer2 = 'Welcome to the "Star of Devotion" Reader Appreciation Event! In this event' +
      ', we express our gratitude to all the avid readers of "Beloved by the Male Lead\'s Nephew."';
  const answer3 = '2023-12-28T01:00';
  const answer4 = '2024-01-28T01:00';

  if (answerInput1) {
    answerInput1.value = answer1;
    promotionName.value = answer1
  }

  if (answerInput2) {
    answerInput2.value = answer2;
    promotionDesc.value = answer2;
  }

  if (answerInput3) {
    answerInput3.value = answer3;
    startDate.value = answer3;
  }

  if (answerInput4) {
    answerInput4.value = answer4;
    endDate.value = answer4;
  }
}

async function loadAllComic() {
  const url = '/comicD/simplecomics';

  try {
    const response = await httpClient.get(url);

    comicList.value = response.data;
    console.log(comicList.value);
  } catch (err) {
    console.error(err);
  }
}

function convertToCustomFormat(dateTimeString) {
  return moment(dateTimeString).format('YYYY/MM/DD HH:mm:ss');
}

function clearInput() {
  comicId.value = null;
  promotionName.value = '';
  promotionDesc.value = '';
  startDate.value = '';
  endDate.value = '';
}
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

        <!-- ComicSelection -->
        <div class="mb-3">
          <label for="comicDropdown" class="form-label">Selection：</label>
          <select v-model="comicId" name="comic" class="form-select">
            <option v-for="comic in comicList"
                    :key="comic.comicId"
                    :value="comic.comicId">
              {{ comic.comicTitle }}
            </option>
          </select>
        </div>

        <!-- PromotionName -->
        <div class="mb-3">
          <label for="promotionName" class="form-label">PromotionName：</label>
          <input type="text" v-model.trim="promotionName" name="promotionName" class="form-control">
        </div>

        <!-- PromotionDesc -->
        <div class="mb-3">
          <label for="Description" class="form-label">Description：</label>
          <textarea v-model="promotionDesc" name="Description" class="form-control" rows="4"></textarea>
        </div>

        <!-- StartDate -->
        <div class="mb-3">
          <label for="StartDate" class="form-label">StartDate：</label>
          <input type="datetime-local" v-model="startDate" name="StartDate" class="form-control">
        </div>

        <!-- EndDate -->
        <div class="mb-3">
          <label for="EndDate" class="form-label">EndDate：</label>
          <input type="datetime-local" v-model="endDate" name="EndDate" class="form-control">
        </div>

        <!-- Submit -->
        <div>
          <button @click="createPromo()"><span>Submit</span></button>
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