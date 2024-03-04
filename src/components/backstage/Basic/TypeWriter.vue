<script setup>
import Typewriter from 'typewriter-effect/dist/core';
import { ref, onMounted, defineProps } from 'vue';

const props = defineProps(['string1', 'string2', 'string3']);

const typewriterTarget = ref(null);

onMounted(() => {
  typeWriter();
});

function typeWriter() {
  const typewriter = new Typewriter(typewriterTarget.value, {
    loop: true
  });

  console.log(props.string1);
  typewriter
      .typeString(props.string1)
      .pauseFor(1000)
      .deleteAll()
      .typeString(props.string2)
      .pauseFor(1000)
      .deleteAll()
      .typeString(props.string3)
      .pauseFor(1000)
      .start();
}
</script>

<template>
  <h1 class="text-center" ref="typewriterTarget"></h1>
</template>

<style scoped>

</style>