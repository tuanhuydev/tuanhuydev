// Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Form
export type SelectOptionType = {
  label: string;
  value: any;
};
