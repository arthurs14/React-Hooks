import React, { useReducer, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currIngredients, action.ingredient];
    case 'DELETE':
      return currIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...httpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.error };
    case 'CLEAR':
      return { ...httpState, error: null };
    default:
      throw new Error('Should not be reached!');
  }
};

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });
  // const [ingredients, setIngredients] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    //setLoading(true);
    dispatchHttp({ type: 'SEND' });

    fetch('https://ingredient-list-34639-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      // setLoading(false);
      dispatchHttp({ type: 'RESPONSE' })

      return response.json();
    }).then(responseData => {
      // setIngredients(prevIngredients => [
      //     ...prevIngredients, 
      //     { id: responseData.name, ...ingredient },
      // ]);
      dispatch({
        type: 'ADD', 
        ingredient: { id: responseData.name, ...ingredient },
      });
    });
  }, []);

  const removeIngredientHandler = useCallback((id) => {
    // setLoading(true);
    dispatchHttp({ type: 'SEND' });

    fetch(`https://ingredient-list-34639-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE',
    }).then(response => {
      // setLoading(false);
      dispatchHttp({ type: 'RESPONSE' });

      // setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id));
      dispatch({
        type: 'DELETE',
        id: id, 
      });
    }).catch(error => {
      // setError(error.message);
      dispatchHttp({ type: 'ERROR', error: error.message  });
    });
  }, []);

  const clearError = useCallback(() => {
    // setError(null);
    // setLoading(false);

    dispatchHttp({ type: 'CLEAR' });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList 
          ingredients={ingredients} 
          onRemoveItem={removeIngredientHandler} />
    );
  }, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
