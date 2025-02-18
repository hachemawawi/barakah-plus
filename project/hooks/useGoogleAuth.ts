import { GoogleAuthProvider, signInWithCredential, signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../lib/firebase';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    responseType: 'id_token',
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { params } = response;
      const idToken = params.id_token;
      if (!idToken) {
        console.error('Error: Missing idToken from Google response.');
        return;
      }

      const signIn = async () => {
        try {
          const credential = GoogleAuthProvider.credential(idToken);
          const userCredential = await signInWithCredential(auth, credential);
          console.log('User signed in successfully:', userCredential.user);
        } catch (error) {
          console.error('Error signing in with Google:', error);
        }
      };

      signIn();
    }
  }, [response]);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    signIn: () => promptAsync(),
    logout,
    loading: !request,
  };
}