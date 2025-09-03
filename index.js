// index.js
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
export default App; // ★ Snack이 필요로 하는 default export
