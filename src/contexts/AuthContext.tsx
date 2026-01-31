import React, { useEffect, useState, createContext, useContext } from 'react';
// ==========================================
// AUTHENTICATION CONTEXT
// ==========================================

import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User } from
'firebase/auth';
import { auth, isFirebaseConfigured, isAuthorizedAdmin } from '../lib/firebase';
import { clientService } from '../lib/firebaseServices';
import { AdminUser, Client, ClientSession } from '../types';
interface AuthContextType {
  // Admin auth
  adminUser: AdminUser | null;
  isAdminLoading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signOutAdmin: () => Promise<void>;
  // Client auth
  clientSession: ClientSession | null;
  isClientLoading: boolean;
  loginWithAccessCode: (accessCode: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  logoutClient: () => void;
  // General
  isFirebaseReady: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: {children: ReactNode;}) {
  // Admin state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  // Client state
  const [clientSession, setClientSession] = useState<ClientSession | null>(null);
  const [isClientLoading, setIsClientLoading] = useState(false);
  const isFirebaseReady = isFirebaseConfigured();
  // Listen to admin auth state changes
  useEffect(() => {
    if (!isFirebaseReady) {
      setIsAdminLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setAdminUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || undefined
        });
      } else {
        setAdminUser(null);
      }
      setIsAdminLoading(false);
    });
    return () => unsubscribe();
  }, [isFirebaseReady]);
  // Check for stored client session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('clientSession');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession) as ClientSession;
        setClientSession(session);
      } catch (e) {
        localStorage.removeItem('clientSession');
      }
    }
  }, []);
  // Admin sign in with Google
  const signInWithGoogle = async (): Promise<boolean> => {
    if (!isFirebaseReady) {
      console.warn('Firebase not configured');
      return false;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // Check if user is authorized admin
        if (!isAuthorizedAdmin(result.user.email)) {
          // Not authorized - sign out immediately
          await firebaseSignOut(auth);
          throw new Error('UNAUTHORIZED_ADMIN');
        }

        setAdminUser({
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || '',
          photoURL: result.user.photoURL || undefined
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.message === 'UNAUTHORIZED_ADMIN') {
        throw error;
      }
      return false;
    }
  };
  // Admin sign out
  const signOutAdmin = async (): Promise<void> => {
    if (!isFirebaseReady) return;
    try {
      await firebaseSignOut(auth);
      setAdminUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  // Client login with access code
  const loginWithAccessCode = async (
  accessCode: string)
  : Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!isFirebaseReady) {
      // For demo mode without Firebase, simulate success
      const mockClient: Client = {
        id: 'demo-client',
        accessCode,
        name: 'Demo Client',
        companyName: 'Demo Company',
        email: 'demo@example.com',
        phone: '+1 555-0000',
        status: 'Active',
        projectIds: ['demo-project'],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const session: ClientSession = {
        clientId: mockClient.id,
        accessCode,
        client: mockClient
      };
      setClientSession(session);
      localStorage.setItem('clientSession', JSON.stringify(session));
      return {
        success: true
      };
    }
    setIsClientLoading(true);
    try {
      const response = await clientService.getByAccessCode(
        accessCode.toUpperCase().trim()
      );
      if (response.success && response.data) {
        const session: ClientSession = {
          clientId: response.data.id,
          accessCode: response.data.accessCode,
          client: response.data
        };
        setClientSession(session);
        localStorage.setItem('clientSession', JSON.stringify(session));
        return {
          success: true
        };
      }
      return {
        success: false,
        error: response.error || 'Invalid access code'
      };
    } catch (error) {
      console.error('Access code login error:', error);
      return {
        success: false,
        error: 'Failed to verify access code'
      };
    } finally {
      setIsClientLoading(false);
    }
  };
  // Client logout
  const logoutClient = (): void => {
    setClientSession(null);
    localStorage.removeItem('clientSession');
  };
  const value: AuthContextType = {
    adminUser,
    isAdminLoading,
    signInWithGoogle,
    signOutAdmin,
    clientSession,
    isClientLoading,
    loginWithAccessCode,
    logoutClient,
    isFirebaseReady
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}