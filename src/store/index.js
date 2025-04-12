/**
 * تنظیمات پایه مدیریت وضعیت
 * 
 * در پیاده‌سازی واقعی، می‌توان از Redux یا Context API استفاده کرد
 */

import React, { createContext, useContext, useReducer } from 'react';

// ایجاد context
const StoreContext = createContext();

// ایجاد provider
export const StoreProvider = ({ children, initialState, reducer }) => (
  <StoreContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StoreContext.Provider>
);

// هوک برای دسترسی به store
export const useStore = () => useContext(StoreContext);
