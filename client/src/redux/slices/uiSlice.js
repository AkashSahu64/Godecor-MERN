import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mobileMenuOpen: false,
  searchQuery: '',
  searchActive: false,
  isLoading: false,
  modalOpen: false,
  modalContent: null,
  modalType: null,
  theme: 'dark',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleSearchActive: (state) => {
      state.searchActive = !state.searchActive;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    openModal: (state, action) => {
      state.modalOpen = true;
      state.modalContent = action.payload.content;
      state.modalType = action.payload.type;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalContent = null;
      state.modalType = null;
    },
  },
});

export const {
  toggleMobileMenu,
  closeMobileMenu,
  setSearchQuery,
  toggleSearchActive,
  setIsLoading,
  openModal,
  closeModal,
} = uiSlice.actions;
export default uiSlice.reducer;