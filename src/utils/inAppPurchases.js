import { Platform } from 'react-native';

export const IAP_UNAVAILABLE_MESSAGE = '현재 환경에서는 인앱 결제를 사용할 수 없습니다.';

export const isIapAvailable = Platform.OS !== 'web';

const createUnavailableIap = () => ({
  connectAsync: async () => ({ responseCode: 0 }),
  disconnectAsync: async () => {},
  getProductsAsync: async () => ({ responseCode: 0, results: [] }),
  requestPurchaseAsync: async () => {
    const error = new Error(IAP_UNAVAILABLE_MESSAGE);
    error.code = 'E_IAP_UNAVAILABLE';
    throw error;
  },
  finishTransactionAsync: async () => {},
  setPurchaseListener: () => ({ remove: () => {} }),
  IAPResponseCode: {
    OK: 0,
    USER_CANCELED: 1,
  },
  InAppPurchaseState: {
    PURCHASED: 1,
  },
});

const InAppPurchases = isIapAvailable ? require('expo-in-app-purchases') : createUnavailableIap();

export default InAppPurchases;
