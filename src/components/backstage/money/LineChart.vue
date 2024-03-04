<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

const props = defineProps(["labels", "data"]);
const chart = ref(null);

onMounted(() => {
    initChart();
});

function initChart() {
    const ctx = chart.value.getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: props.labels,
            datasets: [
                {
                    label: "Orders' Dataset",
                    data: props.data,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                },
            ],
        },
    });
}
</script>

<template>
    <div>
        <canvas ref="chart"></canvas>
    </div>
</template>

<style scoped></style>
