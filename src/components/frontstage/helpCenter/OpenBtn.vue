<template>
  <div class="accordion accordion-flush" id="accordionFlushExample">
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingOne">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-comic"
          aria-expanded="false"
          aria-controls="flush-collapseOne"
          @click="fetchData(1)"
        >
          Comic
        </button>
      </h2>
      <div
        id="flush-comic"
        class="accordion-collapse collapse"
        aria-labelledby="flush-headingOne"
        data-bs-parent="#accordionFlushExample"
      >
        <div class="accordion-body">
          <ul>
            <li
              class="accordion-body bottom-solid"
              v-for="(item, index) in data"
              :key="index"
            >
              <div>
                <p>Question: {{ item.question }}</p>
              </div>
              <div>
                <p>Answer: {{ item.answer }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingTwo">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-user"
          aria-expanded="false"
          aria-controls="flush-collapseTwo"
          @click="fetchData(2)"
        >
          User
        </button>
      </h2>
      <div
        id="flush-user"
        class="accordion-collapse collapse"
        aria-labelledby="flush-headingTwo"
        data-bs-parent="#accordionFlushExample"
      >
        <div class="accordion-body">
          <ul>
            <li
              class="accordion-body bottom-solid"
              v-for="(item, index) in data"
              :key="index"
            >
              <div>
                <p>Question: {{ item.question }}</p>
              </div>
              <div>
                <p>Answer: {{ item.answer }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingThree">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-money"
          aria-expanded="false"
          aria-controls="flush-collapseThree"
          @click="fetchData(3)"
        >
          Money
        </button>
      </h2>
      <div
        id="flush-money"
        class="accordion-collapse collapse"
        aria-labelledby="flush-headingThree"
        data-bs-parent="#accordionFlushExample"
      >
        <div class="accordion-body">
          <ul>
            <li
              class="accordion-body bottom-solid"
              v-for="(item, index) in data"
              :key="index"
            >
              <div>
                <p>Question: {{ item.question }}</p>
              </div>
              <div>
                <p>Answer: {{ item.answer }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingFour">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-promotion"
          aria-expanded="false"
          aria-controls="flush-collapseFour"
          @click="fetchData(4)"
        >
          Promotion
        </button>
      </h2>
      <div
        id="flush-promotion"
        class="accordion-collapse collapse"
        aria-labelledby="flush-headingFour"
        data-bs-parent="#accordionFlushExample"
      >
        <div class="accordion-body">
          <ul>
            <li
              class="accordion-body bottom-solid"
              v-for="(item, index) in data"
              :key="index"
            >
              <div>
                <p>Question: {{ item.question }}</p>
              </div>
              <div>
                <p>Answer: {{ item.answer }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingFive">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-order"
          aria-expanded="false"
          aria-controls="flush-collapseFive"
          @click="fetchData(5)"
        >
          Order
        </button>
      </h2>
      <div
        id="flush-order"
        class="accordion-collapse collapse"
        aria-labelledby="flush-headingFive"
        data-bs-parent="#accordionFlushExample"
      >
        <div class="accordion-body">
          <ul>
            <li
              class="accordion-body bottom-solid"
              v-for="(item, index) in data"
              :key="index"
            >
              <div>
                <p>Question: {{ item.question }}</p>
              </div>
              <div>
                <p>Answer: {{ item.answer }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingSix">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#flush-reading"
          aria-expanded="false"
          aria-controls="flush-collapseSix"
          @click="fetchData(6)"
        >
          Reading
        </button>
      </h2>
      <div
        id="flush-reading"
        class="accordion-collapse collapse"
        aria-labelledby="flush-headingSix"
        data-bs-parent="#accordionFlushExample"
      >
        <div class="accordion-body">
          <ul>
            <li
              class="accordion-body bottom-solid"
              v-for="(item, index) in data"
              :key="index"
            >
              <div>
                <p>Question: {{ item.question }}</p>
              </div>
              <div>
                <p>Answer: {{ item.answer }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import httpClient from "@/main.js";

const data = ref([]);

const fetchData = async (id) => {
  try {
    const response = await httpClient.get(
      `http://localhost:8080/remecomic/helpcenter/question/category/${id}`
    );
    data.value = response.data;
    // console.log(data.value[0].question);
    // console.log(data.value[0].answer);
  } catch (error) {
    console.error("error: ", error);
  }
};
</script>

<style scoped>
ul > li {
  color: white;
  margin: 5px 5% 5px 5px;
}

.indent-2 {
  text-indent: 2em;
}
.flex {
  display: flex;
}
.jcc {
  justify-content: center;
}
.jcfs {
  justify-content: flex-start;
}
li > div > p {
  color: black;
}
.bottom-solid:not(:last-child){
  border-bottom: 1px solid #DEE2E6;
}
</style>
