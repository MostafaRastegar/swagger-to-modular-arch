import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // تأخیر کوچک برای اطمینان از بارگذاری کامل
    const timer = setTimeout(() => {
      const existingUser = localStorage.getItem("user");

      if (!existingUser) {
        const newUser = {
          id: uuidv4(),
          name: `User_${Math.random().toString(36).substr(2, 9)}`,
          created: new Date().toISOString(),
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
      } else {
        setUser(JSON.parse(existingUser));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // تابع برای به‌روزرسانی اطلاعات کاربر
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // تابع برای خروج کاربر (در صورت نیاز)
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        logout,
        getCurrentUserId: () => user?.id,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// هوک برای استفاده در کامپوننت‌ها
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
