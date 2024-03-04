<template>
    <div>
        <h2 style="text-align: center;">Reports</h2>
        <div style="height:40rem;overflow: auto;">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col" v-for="column in columnName">{{ column }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="report in reports">
                        <td v-for="column in columnName">{{ report[column] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref, watch, defineProps, defineEmits, nextTick } from 'vue';

const columnName = ['reportId', 'postId', 'reportUserId', 'reportUserName', 'reportTime', 'reasonId', 'reasonContent', 'verifyId', 'verifyStatus']

const axiosHelper = axios.create({
    withCredentials: true
})

const baseUrl = 'http://localhost:8080/remecomic'
const getDataUrl = '/report/table/show'

const reports = ref({})
axiosHelper.get(baseUrl + getDataUrl)
    .then((res) => {
        console.log('res', res.data)
        reports.value = res.data
    }).catch((err) => {
        console.log('err', err)
    })
</script>

<style scoped></style>