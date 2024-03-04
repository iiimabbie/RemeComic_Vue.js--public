import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useGenreStore = defineStore({
  id: 'genre',
  state: () => ({
    selectedGenre: [2],
  }),
  getters: {
    getSelectedGenre: (state) => state.selectedGenre.filter(data => data)
  },
  actions: {
    setSelectedGenre(genres) {
      this.selectedGenre = genres;
      this.trigger = true;
      console.log("inManager", this.selectedGenre)
    },

  }
});
