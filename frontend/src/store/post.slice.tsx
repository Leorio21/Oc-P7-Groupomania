import { configureStore, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { PostsList } from '../../../backend/interface/Post'

const postSlice = createSlice({
    name: 'post',
    initialState: [],
    reducers: {
        addPosts: (state:PostsList, action) => {
            state.push(action.payload)
        }
    }
})

export const { addPosts } = postSlice.actions

export default postSlice.reducer;