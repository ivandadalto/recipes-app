import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ContextRecipes from '../context/ContextRecipes';
import { saveDoneRecipesLocalStorage,
  saveRecipeInProgressLocalStorage } from '../service/LocalStorage';
import IngredientProgress from './IngredientsProgress';
import shareIcon from '../images/shareIcon.svg';

const copy = require('clipboard-copy');

export default function DrinksInProgress() {
  const history = useHistory();
  const [drink, setDrink] = useState({});
  const [message, setMessage] = useState(false);
  const { disabledBtnFinalizar } = useContext(ContextRecipes);
  const location = useLocation();
  const locationSplit = location.pathname.split('/');
  const sharePathname = location.pathname.split('/in-progress')[0];
  const id = locationSplit[2];

  const fetchAPI = async () => {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
    const response = await fetch(url);
    const results = await response.json();
    setDrink(results.drinks[0]);
  };

  const filterRecipeDone = () => {
    const recipeDone = JSON.parse(localStorage.getItem('inProgressRecipes'));
    delete recipeDone.drinks[id];
    saveRecipeInProgressLocalStorage(recipeDone);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const inDate = new Date();

  const saveLocalStorage = {
    id: drink.idDrink,
    type: 'drink',
    nationality: drink.strArea,
    category: drink.strCategory,
    alcoholicOrNot: drink.strAlcoholic,
    name: drink.strDrink,
    image: drink.strDrinkThumb,
    doneDate: inDate.toISOString(),
    tags: ((drink.strTags !== null && drink.strTags) ? drink.strTags.split(',') : []),
  };

  const handleBtnFinalizar = () => {
    const doneRecipe = JSON.parse(localStorage.getItem('doneRecipes') || '[]');
    saveDoneRecipesLocalStorage([...doneRecipe, saveLocalStorage]);
    filterRecipeDone();
    history.push('/done-recipes');
  };

  const buttonShare = async () => {
    if (!message) {
      setMessage(true);
      const url = `http://localhost:3000${sharePathname}`;
      const messageSaved = await copy(url);
      return messageSaved;
    }
    setMessage(false);
  };

  const favoriteButton = () => {
    const favorite = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    let newFavorite = [];
    newFavorite = {
      id: drink.idDrink,
      type: 'drink',
      nationality: drink.strArea,
      category: drink.strCategory,
      alcoholicOrNot: drink.strAlcoholic,
      name: drink.strDrink,
      image: drink.strDrinkThumb };
    localStorage.setItem('favoriteRecipes', JSON.stringify([...favorite, newFavorite]));
  };
  return (
    <div>
      <div>
        <img
          data-testid="recipe-photo"
          src={ drink.strDrinkThumb }
          alt={ drink.strMeal }
        />
        <h2 data-testid="recipe-title">{drink.strDrink}</h2>
        <button
          type="button"
          data-testid="share-btn"
          onClick={ buttonShare }
        >
          <img src={ shareIcon } alt="icone" />

        </button>
        {message && <p>Link copied!</p>}
        <button
          type="button"
          data-testid="favorite-btn"
          onClick={ favoriteButton }
        >
          Favoritar

        </button>

        <p data-testid="recipe-category">{drink.strCategory}</p>
        <p data-testid="instructions">{drink.strInstructions}</p>
      </div>
      <IngredientProgress recipeType={ drink } />
      <button
        type="button"
        className="finish-button"
        data-testid="finish-recipe-btn"
        disabled={ disabledBtnFinalizar }
        onClick={ handleBtnFinalizar }
      >
        Finalizar

      </button>

    </div>
  );
}
