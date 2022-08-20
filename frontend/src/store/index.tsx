import { configureStore } from "@reduxjs/toolkit";

import postReducer from './post.slice'

export * from './post.slice'

const store = configureStore({
    reducer: {
        posts: postReducer,
    }
})

export default store;