<template>
  <button @click="goHelp" class="helpCenterButton">
    <font-awesome-icon class="helpCenterBar" :icon="['fas', 'circle-info']"/>
  </button>
</template>

<script setup>
import { useRouter } from "vue-router"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const router = useRouter();

const goHelp = () => {
router.push("/frontstage/help/home")
}
</script>

<style scoped>
.helpCenterBar{
font-size:18px;
color:white;
}
.bd0{
border: 0px;
background-color:transparent;
}
.helpCenterButton{
  border:0px;
  background-color:transparent;

}

</style>