// global/services/authService.ts
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export const registerUser = async (email: string, password: string, name: string) => {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  return userCredential.user;
};
