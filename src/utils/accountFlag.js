// src/utils/accountFlag.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const HAS_ACCOUNT_KEY = 'HAS_ACCOUNT';

export async function markHasAccount() {
  try {
    await AsyncStorage.setItem(HAS_ACCOUNT_KEY, '1');
  } catch {}
}

export async function clearHasAccount() {
  try {
    await AsyncStorage.removeItem(HAS_ACCOUNT_KEY);
  } catch {}
}
