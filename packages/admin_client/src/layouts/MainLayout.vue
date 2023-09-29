<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Model Keep </q-toolbar-title>

        <div>Bienvenue</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container v-if="currentState === 'authenticated'">
      <router-view />
    </q-page-container>
    <q-page-container v-else>
      <q-btn
        href="https://modelkeep-dev.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=7f4ndfnbq6mn6gu4a5egbqcvrp&response_type=code&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2F"
        >Se Connecter</q-btn
      >
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useAuthStore } from 'src/stores/authentication';
import { defineComponent, onMounted, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
// import { useRouter } from 'vue-router';

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink,
  },

  setup() {
    // const router = useRouter();
    const auth = useAuthStore();
    const leftDrawerOpen = ref(false);

    const authenticate = async (code: string | null) => {
      try {
        if (code) {
          await auth.authenticate(code);
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        // Optionally, add user notification here
      }
    };

    onMounted(async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      await authenticate(code);
      urlParams.delete('code');
      window.history.replaceState({}, '', `?${urlParams.toString()}`);
    });

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },

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
      return state;
    },
  },
});
</script>
