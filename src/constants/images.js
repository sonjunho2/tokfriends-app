// src/constants/images.js
// 이미지 경로를 한 군데서 관리하고 싶을 때 사용
export const LOGO = require('../../assets/logo.png');


// src/constants/images.js
import { Asset } from 'expo-asset';

// 기본 자산 경로
export const ASSETS = {
 // 앱 아이콘 및 스플래시
 icon: require('../../assets/icon.png'),
 splash: require('../../assets/splash.png'),
 
 // 로고 (현재는 HeaderLogo 컴포넌트로 텍스트 처리)
 // logo: require('../../assets/logo.png'), // 로고 이미지 추가 시 주석 해제
 
 // Placeholder 이미지
 placeholderAvatar: 'https://via.placeholder.com/150/FF4B6E/FFFFFF?text=User',
 placeholderImage: 'https://via.placeholder.com/400x300/F7F8FA/9CA3AF?text=Image',
};

// 더미 프로필 이미지 안전 로드
export const getDummyUserImage = (index) => {
 try {
   // 1~8번 유저 이미지 시도
   const images = {
     1: require('../../assets/dummy/user1.jpg'),
     2: require('../../assets/dummy/user2.jpg'),
     3: require('../../assets/dummy/user3.jpg'),
     4: require('../../assets/dummy/user4.jpg'),
     5: require('../../assets/dummy/user5.jpg'),
     6: require('../../assets/dummy/user6.jpg'),
     7: require('../../assets/dummy/user7.jpg'),
     8: require('../../assets/dummy/user8.jpg'),
   };
   
   return images[index] || null;
 } catch (error) {
   // 이미지가 없으면 null 반환 (Avatar 컴포넌트가 이니셜로 대체)
   console.log(`Dummy user image ${index} not found, using fallback`);
   return null;
 }
};

// 이미지 프리로드 함수
export const preloadImages = async () => {
 const imageAssets = [
   ASSETS.icon,
   ASSETS.splash,
 ];
 
 // 더미 이미지들도 시도 (있는 것만 로드)
 for (let i = 1; i <= 8; i++) {
   const dummyImage = getDummyUserImage(i);
   if (dummyImage) {
     imageAssets.push(dummyImage);
   }
 }
 
 try {
   const imagePromises = imageAssets.map(image => {
     if (typeof image === 'string') {
       return Image.prefetch(image);
     } else {
       return Asset.fromModule(image).downloadAsync();
     }
   });
   
   await Promise.all(imagePromises);
   console.log('Images preloaded successfully');
 } catch (error) {
   console.log('Error preloading images:', error);
 }
};

// 이미지 소스 헬퍼 함수
export const getImageSource = (source) => {
 if (!source) return null;
 
 // 로컬 require() 이미지인 경우
 if (typeof source === 'number') {
   return source;
 }
 
 // URI 문자열인 경우
 if (typeof source === 'string') {
   return { uri: source };
 }
 
 // 이미 객체 형태인 경우
 return source;
};

export default {
 ASSETS,
 getDummyUserImage,
 preloadImages,
 getImageSource,
};