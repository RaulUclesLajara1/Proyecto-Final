// Estado inicial y reducer básico para la aplicación

export function initialStore() {
  return {
    user: null,
    token: null,
    loading: false,
    errors: null,
  };
}

// Reducer mínimo que maneja algunas acciones comunes
export default function storeReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: !!action.payload };
    case 'SET_ERROR':
      return { ...state, errors: action.payload, loading: false };
    case 'RESET':
      return initialStore();
    default:
      return state;
  }
}
