<template v-if="currentState === 'authenticated'">
  <q-page class="row items-center justify-evenly">
    BIENVENUE
    <q-icon v-if="currentState === 'authenticated'" name="fingerprint"></q-icon>
  </q-page>
</template>

<script lang="ts">
import { useAuthStore } from 'src/stores/authentication';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: {},
  computed: {
    isAuthenticated(): boolean {
      return useAuthStore().isAuthenticated;
    },
    isExpired(): boolean {
      return useAuthStore().isExpired;
    },
    currentState(): string {
      let state = 'unauthenticated';
      if (this.isAuthenticated) {
        state = this.isExpired ? 'expired' : 'authenticated';
      }
      console.log(state);
      return state;
    },
  },
});
</script>
