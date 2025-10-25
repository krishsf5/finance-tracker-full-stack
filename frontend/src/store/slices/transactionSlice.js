import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionsAPI } from '../../services/api';

// Initial state
const initialState = {
  transactions: [],
  currentTransaction: null,
  stats: null,
  categoryBreakdown: [],
  trends: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  },
};

// Async thunks
export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.getTransactions(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch transactions'
      );
    }
  }
);

export const getTransaction = createAsyncThunk(
  'transactions/getTransaction',
  async (id, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.getTransaction(id);
      return response.data.data.transaction;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch transaction'
      );
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.createTransaction(data);
      return response.data.data.transaction;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create transaction'
      );
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.updateTransaction(id, data);
      return response.data.data.transaction;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update transaction'
      );
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await transactionsAPI.deleteTransaction(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete transaction'
      );
    }
  }
);

export const getTransactionStats = createAsyncThunk(
  'transactions/getStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.getStats(params);
      return response.data.data.summary;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch transaction stats'
      );
    }
  }
);

export const getCategoryBreakdown = createAsyncThunk(
  'transactions/getCategoryBreakdown',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.getCategoryBreakdown(params);
      return response.data.data.categories;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category breakdown'
      );
    }
  }
);

export const getTrends = createAsyncThunk(
  'transactions/getTrends',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.getTrends(params);
      return response.data.data.trends;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch trends'
      );
    }
  }
);

// Transaction slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder => {
    builder
      // Get Transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data.transactions;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
          limit: action.payload.limit || 10,
        };
        state.error = null;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Transaction
      .addCase(getTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
        state.error = null;
      })
      .addCase(getTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Transaction
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        if (state.currentTransaction && state.currentTransaction._id === action.payload._id) {
          state.currentTransaction = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(t => t._id !== action.payload);
        if (state.currentTransaction && state.currentTransaction._id === action.payload) {
          state.currentTransaction = null;
        }
        state.error = null;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Stats
      .addCase(getTransactionStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(getTransactionStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Category Breakdown
      .addCase(getCategoryBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryBreakdown = action.payload;
        state.error = null;
      })
      .addCase(getCategoryBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Trends
      .addCase(getTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload;
        state.error = null;
      })
      .addCase(getTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }),
});

export const { clearError, clearCurrentTransaction, setLoading } = transactionSlice.actions;
export default transactionSlice.reducer;
