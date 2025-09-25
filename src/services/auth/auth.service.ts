import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  User,
  UserCredential
} from 'firebase/auth';
import { auth, setAuthPersistence } from '@/config/firebase';
import { RegisterCredentials } from './auth.types';

class AuthService {
  // Sign in with email and password
  async signInWithEmail(email: string, password: string, rememberMe: boolean = false): Promise<UserCredential> {
    await setAuthPersistence(rememberMe);
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Register new user with email and password
  async createAccount({ email, password, fullName }: RegisterCredentials): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update user profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: fullName
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);
    }

    return userCredential;
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return signInWithPopup(auth, provider);
  }

  // Sign out current user
  async signOut(): Promise<void> {
    return signOut(auth);
  }

  // Send password reset email
  async sendPasswordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Resend verification email
  async resendVerificationEmail(): Promise<void> {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  }

  // Update user profile
  async updateUserProfile(displayName?: string, photoURL?: string): Promise<void> {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, { displayName, photoURL });
    }
  }
}

export const authService = new AuthService();