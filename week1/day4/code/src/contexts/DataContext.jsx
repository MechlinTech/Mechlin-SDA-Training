import React, {
    createContext,
    useContext,
    useReducer,
    useCallback
} from 'react';

export const DataContext = createContext();
const initialState = {
    data: {},
    loading: false,
    error: null
};

const dataReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                data: {
                    ...state.data,
                    [action.key]: action.payload
                }
            };

        case 'FETCH_ERROR':
            return {
                ...state,
                loading: false,
                error: action.error
            };

        case 'CLEAR_CACHE':
            return {
                ...state,
                data: {}
            };

        default:
            return state;
    }
};

export const DataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(dataReducer, initialState);

    const fetchData = useCallback(async (key, fetchFunction) => {
        if (state.data[key]) {
            return state.data[key];
        }

        dispatch({ type: 'FETCH_START' });

        try {
            const result = await fetchFunction();

            dispatch({
                type: 'FETCH_SUCCESS',
                key,
                payload: result
            });

            return result;
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                error: error.message
            });

            throw error;
        }
    }, [state.data]);

    const clearCache = useCallback(() => {
        dispatch({ type: 'CLEAR_CACHE' });
    }, []);

    const value = {
        data: state.data,
        loading: state.loading,
        error: state.error,
        fetchData,
        clearCache
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);

    if (!context) {
        throw new Error(
            'useDataContext must be used inside DataProvider'
        );
    }

    return context;
};