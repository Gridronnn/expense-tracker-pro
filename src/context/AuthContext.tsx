import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { apiClient, setAuthTokens, clearAuthTokens, getStoredAccessToken, ApiUser } from '../services/apiClient';

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void> | void;
  loginWithGoogle: () => Promise<boolean>;
  loginWithGithub: () => Promise<boolean>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const USER_STORAGE_KEY = 'aura_auth_user_v2';

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const buildProfileFromApiUser = (apiUser: ApiUser): UserProfile => {
    return {
      id: apiUser.id,
      name: apiUser.name || 'Account Holder',
      email: apiUser.email,
      avatarUrl: apiUser.profileImageUrl || '',
      tier: 'Pro Wealth',
      currency: apiUser.currency || 'USD',
      theme: 'light',
      soundEffects: true,
      biometricLock: false,
    };
  };

  const buildProfileFromSupabase = useCallback((sbUser: any): UserProfile => {
    const name =
      sbUser.user_metadata?.name ||
      sbUser.user_metadata?.full_name ||
      sbUser.email?.split('@')[0] ||
      'Account Holder';

    return {
      id: sbUser.id,
      name,
      email: sbUser.email || '',
      avatarUrl: '',
      tier: 'Pro Wealth',
      currency: 'USD',
      theme: 'light',
      soundEffects: true,
      biometricLock: false,
    };
  }, []);

  // Initialize and synchronize session
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const token = getStoredAccessToken();
      if (token) {
        try {
          const me = await apiClient.auth.getMe();
          if (isMounted && me) {
            const profile = buildProfileFromApiUser(me);
            setUser(profile);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Backend session token check failed, checking Supabase or cached user:', e);
        }
      }

      if (isSupabaseConfigured && supabase) {
        supabase.auth.getSession().then(({ data: { session }, error }) => {
          if (!isMounted) return;
          if (!error && session?.user) {
            const profile = buildProfileFromSupabase(session.user);
            setUser(profile);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [buildProfileFromSupabase]);

  // Sync user state changes to storage
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = async (emailInput: string, passwordInput: string): Promise<boolean> => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    // Try Spring Boot REST API first
    try {
      const authData = await apiClient.auth.login(cleanEmail, password);
      if (authData && authData.accessToken) {
        setAuthTokens({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
        });
        const profile = buildProfileFromApiUser(authData.user);
        setUser(profile);
        return true;
      }
    } catch (apiErr: any) {
      // If backend gave an explicit auth error message, throw it
      if (apiErr.message && !apiErr.message.includes('Failed to fetch')) {
        throw apiErr;
      }
      // If backend unreachable, try Supabase fallback if configured
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) throw error;
        if (data.user) {
          setUser(buildProfileFromSupabase(data.user));
          return true;
        }
      }
      throw apiErr;
    }
    return false;
  };

  const register = async (nameInput: string, emailInput: string, passwordInput: string): Promise<boolean> => {
    const cleanName = nameInput.trim();
    const cleanEmail = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!cleanName) {
      throw new Error('Please enter your full legal name.');
    }
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long for security.');
    }

    // Try Spring Boot REST API
    try {
      const authData = await apiClient.auth.register(cleanName, cleanEmail, password);
      if (authData && authData.accessToken) {
        setAuthTokens({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
        });
        const profile = buildProfileFromApiUser(authData.user);
        setUser(profile);
        return true;
      }
    } catch (apiErr: any) {
      if (apiErr.message && !apiErr.message.includes('Failed to fetch')) {
        throw apiErr;
      }
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { name: cleanName } },
        });
        if (error) throw error;
        if (data.user) {
          setUser(buildProfileFromSupabase(data.user));
          return true;
        }
      }
      throw apiErr;
    }
    return true;
  };

  const resetPassword = async (emailInput: string): Promise<boolean> => {
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      throw new Error('Please enter a valid email address to reset your password.');
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: window.location.origin,
      });
      if (error) throw new Error(error.message);
      return true;
    }
    return true;
  };

  const logout = async () => {
    clearAuthTokens();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out:', err);
      }
    }
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        throw new Error(`Google OAuth error: ${error.message}`);
      }
      return true;
    }

    // When OAuth credentials are not configured, reject without logging in
    throw new Error('Google sign-in is not configured. Please set up OAuth in your environment.');
  };

  const loginWithGithub = async (): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        throw new Error(`GitHub OAuth error: ${error.message}`);
      }
      return true;
    }

    // When OAuth credentials are not configured, reject without logging in
    throw new Error('GitHub sign-in is not configured. Please set up OAuth in your environment.');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        resetPassword,
        logout,
        loginWithGoogle,
        loginWithGithub,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
