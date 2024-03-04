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
                    <tr v-for="post in posts">
                        <td v-for="column in columnName">{{ post[column] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref, watch, defineProps, defineEmits, nextTick } from 'vue';

const columnName = ['postId', 'postContent', 'postTime', 'publicStatus', 'verifyHidden']

const axiosHelper = axios.create({
    withCredentials: true
})

const baseUrl = 'http://localhost:8080/remecomic'
const getDataUrl = '/post/verify/result'

const posts = ref({})
axiosHelper.get(baseUrl + getDataUrl)
    .then((res) => {
        console.log('res', res.data)
        posts.value = res.data
    }).catch((err) => {
        console.log('err', err)
    })
</script>

<style scoped></style>