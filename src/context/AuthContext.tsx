import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, PRESET_USERS } from '../types/auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  loginAsRole: (role: UserRole) => void;
  loginWithEmail: (email: string, role?: UserRole) => boolean;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const STORAGE_KEY_AUTH = 'wizerwaste_auth_session_v1';
const VALID_ROLES: UserRole[] = ['super_admin', 'federation_admin', 'donor', 'ngo_recipient', 'volunteer'];

function isValidUserProfile(user: any): user is UserProfile {
  return (
    user !== null &&
    typeof user === 'object' &&
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    VALID_ROLES.includes(user.role)
  );
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved === 'LOGGED_OUT') {
        return null;
      }
      if (saved) {
        const parsed = JSON.parse(saved);
        if (isValidUserProfile(parsed)) {
          return parsed;
        }
        // Purge invalid, corrupted, or tampered session role
        console.warn('Invalid role or corrupted profile in localStorage session; resetting to login.');
        localStorage.removeItem(STORAGE_KEY_AUTH);
        return null;
      }
    } catch (e) {
      console.warn('Could not parse auth session from localStorage');
    }
    // Default to Donor role for immediate exploration if first time visiting
    return PRESET_USERS.donor;
  });

  useEffect(() => {
    try {
      if (currentUser && isValidUserProfile(currentUser)) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
      } else {
        localStorage.setItem(STORAGE_KEY_AUTH, 'LOGGED_OUT');
      }
    } catch (e) {
      console.error('Failed to save auth session:', e);
    }
  }, [currentUser]);

  const loginAsRole = (role: UserRole) => {
    if (VALID_ROLES.includes(role) && PRESET_USERS[role]) {
      setCurrentUser(PRESET_USERS[role]);
    } else {
      console.warn(`Unrecognized role "${role}" rejected.`);
    }
  };

  const loginWithEmail = (email: string, role?: UserRole): boolean => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return false;
    const normalizedEmail = trimmedEmail.toLowerCase();

    // 1. Strict preset account lookup by email
    const foundPresetRole = (Object.keys(PRESET_USERS) as UserRole[]).find(
      r => PRESET_USERS[r].email.toLowerCase() === normalizedEmail
    );
    if (foundPresetRole) {
      setCurrentUser(PRESET_USERS[foundPresetRole]);
      return true;
    }

    // 2. Prevent arbitrary privilege escalation:
    // Administrative roles ('super_admin', 'federation_admin') can NEVER be claimed by arbitrary custom emails.
    const isRestrictedAdminRole = role === 'super_admin' || role === 'federation_admin';
    const assignedRole: UserRole =
      role && VALID_ROLES.includes(role) && !isRestrictedAdminRole ? role : 'donor';

    // 3. Authenticate custom stakeholder profile under verified non-admin role
    setCurrentUser({
      id: `usr_custom_${Date.now()}`,
      name: trimmedEmail.split('@')[0],
      email: trimmedEmail,
      role: assignedRole,
      organization: assignedRole === 'ngo_recipient'
        ? 'Community Relief Center (Simulated)'
        : assignedRole === 'volunteer'
        ? 'Independent Courier (Simulated)'
        : 'Community Partner Kitchen (Simulated)',
      region: 'Metro Bay District (Northern Sector)',
      avatarInitials: trimmedEmail.slice(0, 2).toUpperCase(),
      isVerified: true
    });
    return true;
  };

  const switchRole = (role: UserRole) => {
    if (VALID_ROLES.includes(role) && PRESET_USERS[role]) {
      setCurrentUser(PRESET_USERS[role]);
    } else {
      console.warn(`Attempted to switch to invalid role "${role}".`);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loginAsRole,
        loginWithEmail,
        switchRole,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
