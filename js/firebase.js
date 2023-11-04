// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAc5-EZKvqFAh7xGhWtH2c4TOE4IOcffiM',
  authDomain: 'kv-web-1.firebaseapp.com',
  projectId: 'kv-web-1',
  storageBucket: 'kv-web-1.appspot.com',
  messagingSenderId: '1019463984409',
  appId: '1:1019463984409:web:5e2dd5b7be44db09ddd188',
  measurementId: 'G-KGZNTJJY3E',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

console.log('firebase loaded!');

const storage = getStorage(app);

// -----------------

const btn = document.getElementById('upload-btn');
const fileInput = document.getElementById('upload-file');

btn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('input', (e) => {
  const file = fileInput.files[0];

  if (file) {
    const uploadRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(uploadRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = Math.floor(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log('Upload is ' + progress + '% done');
        console.log(snapshot);
        switch (snapshot.state) {
          case 'paused':
            btn.style.backgroundColor = `gray`;
            btn.innerText = 'uploading paused!';
            console.log('Upload is paused');
            break;
          case 'running':
            btn.style.backgroundColor = `lightgreen`;
            btn.innerText = 'Uploading...';
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        btn.style.backgroundColor = `lightred`;
        btn.innerText = `upload failed`;

        setTimeout(() => {
          btn.innerText = 'Upload here';
        }, 1000);
        console.error(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
        btn.innerText = 'Uploaded';
        btn.style.backgroundColor = `green`;

        setTimeout(() => {
          btn.style.backgroundColor = `pink`;
          btn.innerText = 'Upload here';
        }, 1000);
      }
    );
  } else {
    alert('please upload a photo before uploading!');
  }
});
