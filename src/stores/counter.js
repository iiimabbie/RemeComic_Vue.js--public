import { ref, onMounted, computed } from "vue";
import { defineStore } from "pinia";
import httpClient from "@/main.js";
import genreColor from "@/assets/comicD/genreColor.json";

export const useCounterStore = defineStore("counter", () => {
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);
    const genresWithColor = ref(genreColor);

    const login = () => {
        window.location.href = "http://localhost:8080/remecomic/googleLogin";
    };
    const logout = () => {
        httpClient
            .get("/userA/logout")
            .then(() => {
                window.location.reload();
                localStorage.removeItem("userId");
                localStorage.removeItem("userName");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    // const currentUrl = window.location.href;
    // localStorage.setItem('preLoginUrl', currentUrl);
    // .then(() => {
    //     Swal.fire({
    //         title: 'Please wait...',
    //         html: 'Logging you in...',
    //         allowOutsideClick: false,
    //         didOpen: () => {
    //             Swal.showLoading();
    //         }
    //     });
    //     if (preLoginUrl) {
    //         window.location.href = preLoginUrl;
    //     } else {
    //         window.location.href = 'http://localhost:5173/remecomic/frontstage/home';
    //     }

    // }).
    // catch(err => {
    //     console.log(err)
    //     Swal.fire({
    //         title: 'Error',
    //         text: 'An error occurred during login',
    //         icon: 'error'
    //     });
    // })

    // 不能用??  跟天恩上課的時候一樣。
    // 拿userSession, 可以拿到的有 : userId/userName/userEmail/userPhoto
    const sessionUser = () => {
        httpClient
            .get("/user/getSession")
            .then(function (response) {
                console.log(response);
                console.log("response.data.name", response.data.userName);
                return response.data;
            })
            .catch(function (err) {
                console.log(err);
                return err.response.data;
            });
    };

    function increment() {
        count.value++;
    }

    return {
        count,
        doubleCount,
        increment,
        genresWithColor,
        login,
        logout,
        sessionUser,
    };
});
