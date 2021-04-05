import { useReducer, useCallback } from 'react';

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null, data: null, extra: null, identifier: action.identifier };
    case 'RESPONSE':
      return { ...httpState, loading: false, data: action.responseData, extra: action.extra };
    case 'ERROR':
      return { loading: false, error: action.error };
    case 'CLEAR':
      return { ...httpState, error: null };
    default:
      throw new Error('Should not be reached!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(
    httpReducer, 
    { 
      loading: false, 
      error: null, 
      data: null, 
      extra: null, 
      identifier: null 
    }
  );

  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    dispatchHttp({ type: 'SEND', identifier: identifier });

    fetch (
      url,
      {
        method: method,
        body: body,
        header: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        return response.json;
      }).then(responseData => {
        dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra: extra });
      }).catch(error => {
        // setError(error.message);
        dispatchHttp({ type: 'ERROR', error: error.message  });
      });
  }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    extra: httpState.extra,
    identifier: httpState.identifier,
  };

};

export default useHttp;