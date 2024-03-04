<template>
  <div>
    <button @click="topBtn()" id="topBtn" title="Go to top">Top</button>
  </div>
</template>

<script setup>

function topBtn() {
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

</script>

<style scoped>
#topBtn {
  /* display: none; Hidden by default */
  position: fixed; /* Fixed/sticky position */
  bottom: 20px; /* Place the button at the bottom of the page */
  right: 30px; /* Place the button 30px from the right */
  z-index: 99; /* Make sure it does not overlap */
  border: none; /* Remove borders */
  outline: none; /* Remove outline */
  background-color: white; /* Set a background color */
  color: black; /* Text color */
  cursor: pointer; /* Add a mouse pointer on hover */
  padding: 15px; /* Some padding */
  border-radius: 50%; /* Rounded corners */
  font-size: 18px; /* Increase font size */
}

#topBtn:hover {
  background-color: gray; /* Add a dark-grey background on hover */
}
</style>