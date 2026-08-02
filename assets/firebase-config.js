const firebaseConfig = {
  apiKey: 'AIzaSyAAJlq7ybQzTQzYvnGn7C_JEPIFsBcRev4',
  authDomain: 'myportfolio-82282.firebaseapp.com',
  projectId: 'myportfolio-82282',
  storageBucket: 'myportfolio-82282.firebasestorage.app',
  messagingSenderId: '967654597340',
  appId: '1:967654597340:web:ae77f7195de00ba9d24a19'
};
window.firebaseConfigured = !!firebaseConfig.apiKey;
if (window.firebaseConfigured) firebase.initializeApp(firebaseConfig);
