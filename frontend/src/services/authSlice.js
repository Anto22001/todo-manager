import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const tokenFromStorage = localStorage.getItem("token");
const userFromToken = tokenFromStorage ? jwtDecode(tokenFromStorage) : null;

const initialState = {
    token: tokenFromStorage || null,
    user: userFromToken,
    isLogged: !!tokenFromStorage
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            const {token} = action.payload;
            localStorage.setItem("token", token);
            state.token = token;
            state.user = jwtDecode(token);
            state.isLogged = true;
        },
        logout: (state) => {
            localStorage.removeItem("token");
            state.token = null;
            state.user = null;
            state.isLogged = false;
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;