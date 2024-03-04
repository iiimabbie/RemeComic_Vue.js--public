<template>
    <div>
        <h2 style="text-align: center;">Forum User</h2>
        <div style="height:40rem;overflow: auto;">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col" v-for="column in columnName">{{ column }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users">
                        <td v-for="column in columnName">{{ user[column] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref, watch, defineProps, defineEmits, nextTick } from 'vue';

const columnName = ['userId', 'name', 'reportBanExpire', 'postBanExpire', 'deletedPostsCount']

const axiosHelper = axios.create({
    withCredentials: true
})

const baseUrl = 'http://localhost:8080/remecomic'
const getUserUrl = '/forum/user'

const users = ref({})
axiosHelper.get(baseUrl + getUserUrl)
    .then((res) => {
        console.log('res', res.data)
        users.value = res.data
    }).catch((err) => {
        console.log('err', err)
    })
</script>

<style scoped></style>