import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: "wishlist",

    initialState: {
        items: [],
        total: 0,
    },

    reducers: {

        setWishlist: (state, action) => {

            state.items = action.payload;
            state.total = action.payload.length;

        },

        addWishlist: (state, action) => {

            const exists = state.items.find(
                item => item.productId === action.payload.productId
            );

            if (!exists) {

                state.items.unshift(action.payload);
                state.total++;

            }

        },

        removeWishlist: (state, action) => {

            state.items = state.items.filter(
                item => item.productId !== action.payload
            );

            state.total = state.items.length;

        },

        clearWishlist: (state) => {

            state.items = [];
            state.total = 0;

        },

    },

});

export const {
    setWishlist,
    addWishlist,
    removeWishlist,
    clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;