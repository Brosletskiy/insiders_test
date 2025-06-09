import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Типізований dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Типізований selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
