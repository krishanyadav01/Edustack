import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import { authApi } from '@/features/api/authApi';
import { courseApi } from '@/features/api/courseApi';
import { coursePurchaseApi } from '@/features/api/coursePurchaseApi';
import { courseProgressApi } from '@/features/api/courseProgressApi';
import { messageApi } from '@/features/api/messageApi';
import { superAdminApi } from '@/features/api/superAdminApi';

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [coursePurchaseApi.reducerPath]: coursePurchaseApi.reducer, // Add the coursePurchaseApi here
  [courseProgressApi.reducerPath]:courseProgressApi.reducer ,
  [messageApi.reducerPath]:messageApi.reducer,
  [superAdminApi.reducerPath]:superAdminApi.reducer,
  auth: authReducer,
});

export default rootReducer;
