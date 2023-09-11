// Notification
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

// Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
