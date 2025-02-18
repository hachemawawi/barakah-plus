import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../lib/firebase/client';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      console.log('Google Response:', response);

      const { authentication } = response;
      if (!authentication || !authentication.idToken) {
        console.error('Error: Missing idToken from Google response.');
        return;
      }

      const signIn = async () => {
        const credential = GoogleAuthProvider.credential(authentication.idToken);
        signInWithCredential(auth, credential)
          .then((userCredential) => {
            console.log('User signed in successfully:', userCredential.user);
          })
          .catch((error) => {
            console.error('Error signing in with Google:', error);
          });
      };

      signIn();
    }
  }, [response]);

  return {
    signIn: () => promptAsync(),
    loading: !request,
  };
};