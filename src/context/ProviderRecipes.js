import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ContextRecipes from './ContextRecipes';

export default function ProviderRecipes({ children }) {
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState(false);
  const [requestMeal, setRequestMeal] = useState([]);
  const [requestDrink, setRequestDrink] = useState([]);
  const [recipesData, setRecipesData] = useState([]);

  const value = useMemo(() => ({
    recipesData,
    search,
    title,
    setTitle,
    setSearch,
    requestDrink,
    requestMeal,
    setRequestDrink,
    setRequestMeal,
    setRecipesData,

  }), [recipesData, title, setTitle, search,
    setSearch, requestDrink, requestMeal, setRecipesData]);

  return (
    <ContextRecipes.Provider value={ value }>{ children }</ContextRecipes.Provider>
  );
}

ProviderRecipes.propTypes = {
  children: PropTypes.node.isRequired,
};
