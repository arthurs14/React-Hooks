import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ onLoadIngredients }) => {
  const [ filter, setFilter ] = useState('');

  useEffect(() => {
    const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"` ;
    fetch('https://ingredient-list-34639-default-rtdb.firebaseio.com/ingredients.json' + query
    ).then(response => response.json()
    ).then(responseData => {
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount,
        });
      }
      onLoadIngredients(loadedIngredients);
    });
  }, [filter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            type="text"
            value={filter}
            onChange={ev => setFilter(ev.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
