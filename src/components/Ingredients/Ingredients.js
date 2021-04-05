import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

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

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest, extra, identifier } = useHttp();

  // const [ingredients, setIngredients] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    if (!isLoading && !error && identifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: extra });
    } else if (!isLoading && !error && identifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...extra },
      });
    }
  }, [isLoading, data, extra, identifier, error]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      `https://ingredient-list-34639-default-rtdb.firebaseio.com/ingredients.json`,
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT',
    );
    //setLoading(true);
    // dispatchHttp({ type: 'SEND' });

    // fetch('https://ingredient-list-34639-default-rtdb.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    // }).then(response => {
    //   // setLoading(false);
    //   dispatchHttp({ type: 'RESPONSE' })

    //   return response.json();
    // }).then(responseData => {
    //   // setIngredients(prevIngredients => [
    //   //     ...prevIngredients, 
    //   //     { id: responseData.name, ...ingredient },
    //   // ]);
    //   dispatch({
    //     type: 'ADD', 
    //     ingredient: { id: responseData.name, ...ingredient },
    //   });
    // });
  }, [sendRequest]);

  const removeIngredientHandler = useCallback((id) => {
    // setLoading(true);
    // dispatchHttp({ type: 'SEND' });

    // fetch(`https://ingredient-list-34639-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
    //   method: 'DELETE',
    // }).then(response => {
    //   // setLoading(false);
    //   dispatchHttp({ type: 'RESPONSE' });

    //   // setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id));
    //   dispatch({
    //     type: 'DELETE',
    //     id: id, 
    //   });
    // }).catch(error => {
    //   // setError(error.message);
    //   dispatchHttp({ type: 'ERROR', error: error.message  });
    // });

    sendRequest(
      `https://ingredient-list-34639-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      'DELETE',
      null,
      id,
      'REMOVE_INGREDIENT',
    );
  }, [sendRequest]);

  const clearError = useCallback(() => {
    // setError(null);
    // setLoading(false);

    // dispatchHttp({ type: 'CLEAR' });
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
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
