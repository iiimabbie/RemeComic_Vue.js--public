<template>
    <ul class="pagination d-flex justify-content-center">

        <li class="page-item">
            <button v-if="currentPageNum == 1" type="button" class="page-link"> 已經第一頁了 </button>
            <button v-else type="button" class="page-link" @click="goSomePage(currentPageNum-1)"> 上一頁 </button>
        </li>


        <li class="page-item" v-for=" pageNum in totalPages">
            <button v-if="currentPageNum == pageNum" type="button" class="page-link active"> {{ pageNum }} </button>
            <button v-else type="button" class="page-link" @click="goSomePage(pageNum)"> {{ pageNum }} </button>
        </li>
        

        <li class="page-item">
            <button v-if="currentPageNum == totalPages" type="button"  class="page-link"> 最後一頁了 </button>
            <button v-else type="button"  class="page-link"  @click="goSomePage(currentPageNum+1)"> 下一頁 </button>
        </li>
    </ul>
</template>

<script setup>
  defineProps(['totalPages','currentPageNum'])
  const emits = defineEmits(["updateMsgList"]);

  function goSomePage(somePage){
    // console.log('somePage' + somePage)
    // console.log('click!!!')
    emits('updateMsgList', somePage)
  }

</script>