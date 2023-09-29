import { defineStore } from 'pinia';
import { ref, computed, Ref } from 'vue';
import { getAuthObjectFromAuthCode } from 'src/api/auth';
import { User } from 'models';

export type AuthObject = {
  id_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

export const useAuthStore = defineStore('auth', () => {
  const expires_at = ref(
    Number(localStorage.getItem('expires_at')) || Date.now()
  );
  const isExpired = computed(() => expires_at.value < Date.now());
  const id_token = ref(
    isExpired.value ? '' : localStorage.getItem('id_token') ?? ''
  );
  const access_token = ref(
    isExpired.value ? '' : localStorage.getItem('access_token') ?? ''
  );
  const refresh_token = ref(
    isExpired.value ? '' : localStorage.getItem('refresh_token') ?? ''
  );
  const token_type = ref(
    isExpired.value ? '' : localStorage.getItem('token_type') ?? 'Bearer'
  );
  const user = ref(
    null as null | User
  );

  const isAuthenticated = computed(() => id_token.value !== '');

  if (isAuthenticated.value && !isExpired.value && !) {
  }

  async function loginUser(): Promise<User> {

    return new Promise<User>(() => {});
  }

  async function authenticate(authCode: string) {
    const authObject = await getAuthObjectFromAuthCode(authCode);
    if (
      !authObject.access_token ||
      !authObject.id_token ||
      !authObject.refresh_token ||
      !authObject.expires_in ||
      !authObject.token_type ||
      authObject.token_type !== 'Bearer'
    )
      return false;

    id_token.value = authObject.id_token;
    localStorage.setItem('id_token', authObject.id_token);
    access_token.value = authObject.access_token;
    localStorage.setItem('access_token', authObject.access_token);
    refresh_token.value = authObject.refresh_token;
    localStorage.setItem('refresh_token', authObject.refresh_token);
    expires_at.value = Date.now() + authObject.expires_in * 1000;
    localStorage.setItem('expires_at', expires_at.value.toString());
  }

  return {
    id_token,
    access_token,
    refresh_token,
    expires_at,
    token_type,
    isAuthenticated,
    isExpired,
    user,
    loginUser,
    authenticate,
  };
});
