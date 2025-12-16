import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { toast } from 'react-hot-toast';

export const getAllArticles = createAsyncThunk(
  'articles/getAllArticles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/articles');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const response = await api.post('/articles', articleData);
      return response.data.article;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const likeArticle = createAsyncThunk(
  'articles/likeArticle',
  async (articleId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/articles/${articleId}/like`);
      return { articleId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const commentArticle = createAsyncThunk(
  'articles/commentArticle',
  async ({ articleId, text }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/articles/${articleId}/comment`, { text });
      return { articleId, comment: response.data.comment };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  articles: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GetAllArticles
      .addCase(getAllArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload;
      })
      .addCase(getAllArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      // Create
      .addCase(createArticle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles.unshift(action.payload);
        toast.success('Article published!');
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.status = 'failed';
        toast.error(action.payload.message || 'Failed to post article');
      })
      // Like
      .addCase(likeArticle.fulfilled, (state, action) => {
        const { articleId, article } = action.payload;
        const existingArticle = state.articles.find(a => a._id === articleId);
        if (existingArticle) {
          existingArticle.likeCount = article.likeCount;
          existingArticle.likedBy = article.likedBy;
        }
      })
      // Comment
      .addCase(commentArticle.fulfilled, (state, action) => {
        const { articleId, comment } = action.payload;
        const existingArticle = state.articles.find(a => a._id === articleId);
        if (existingArticle) {
          existingArticle.comments.push(comment);
        }
        toast.success('Comment added!');
      });
  },
});

export const {
  likeArticleRealtime,
  addCommentRealtime,
  addNewPost,resetArticles,
} = articleSlice.actions;
export default articleSlice.reducer;
