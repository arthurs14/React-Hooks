import React from 'react';

import './IngredientList.css';

// wrapping in React.memo will wait for a full change instead of waiting on something that changes
const IngredientList = props => {
  console.log('RENDERING INGREDIENT LIST');
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map(ig => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
