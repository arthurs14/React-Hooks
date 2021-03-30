import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
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
      setIngredients(prevIngredients => [
          ...prevIngredients, 
          { id: responseData.name, ...ingredient },
      ]);
    });
  }

  const removeIngredientHandler = (id) => {
    setLoading(true);
    fetch(`https://ingredient-list-34639-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE',
    }).then(response => {
      setLoading(false);
      setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id));
    });
  }

  return (
    <div className="App">
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
