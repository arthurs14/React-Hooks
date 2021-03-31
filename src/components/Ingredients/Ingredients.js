import React, { useState, useReducer, useCallback } from 'react';

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
      throw new Error('Shouw not get there!');
  }
};

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  // const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const addIngredientHandler = ingredient => {
    setLoading(true);

    fetch('https://ingredient-list-34639-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setLoading(false);
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
  }

  const removeIngredientHandler = (id) => {
    setLoading(true);
    fetch(`https://ingredient-list-34639-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE',
    }).then(response => {
      setLoading(false);
      // setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id));
      dispatch({
        type: 'DELETE',
        id: id, 
      });
    }).catch(error => {
      setError(error.message);
    });
  };

  const clearError = () => {
    setError(null);
    setLoading(false);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList 
          ingredients={ingredients} 
          onRemoveItem={removeIngredientHandler} />
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
