import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.id && !payload.username) {
                    console.log('Found old token format, clearing localStorage...');
                    localStorage.clear();
                    navigate('/login');
                }
            } catch (err) {
                console.error('Error checking token:', err);
                localStorage.clear();
                navigate('/login');
            }
        }
    }, [navigate]);

    const fetchRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching recipes...');
            const response = await fetch('https://food-hub-server-git-main-sirivennelas-projects-9dbaf9e3.vercel.app/recipes');
            const data = await response.json();
            console.log('Recipes fetched:', data);
            setRecipes(data);
        } catch (err) {
            console.error('Error fetching recipes:', err);
            setError(err.message || 'Failed to fetch recipes');
        } finally {
            setLoading(false);
        }
    }, []);

    const addRecipe = useCallback(async (recipe) => {
        try {
            setError(null);
            console.log('Starting to add recipe:', recipe);
            
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            console.log('Auth token present:', !!token);
            console.log('Username from storage:', username);
            
            if (!token || !username) {
                console.log('Missing auth data, redirecting to login...');
                localStorage.clear();
                navigate('/login');
                return null;
            }

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (!payload.username) {
                    console.log('Invalid token format, redirecting to login...');
                    localStorage.clear();
                    navigate('/login');
                    return null;
                }
            } catch (err) {
                console.error('Error verifying token:', err);
                localStorage.clear();
                navigate('/login');
                return null;
            }

            const recipeData = {
                ...recipe,
                ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
                cookingTime: parseInt(recipe.cookingTime) || 0
            };
            console.log('Making API request to create recipe with data:', recipeData);
            console.log('Using authorization token:', token);

            const response = await fetch('https://food-hub-server-git-main-sirivennelas-projects-9dbaf9e3.vercel.app/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(recipeData)
            });

            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.log('Authentication failed, redirecting to login...');
                    localStorage.clear();
                    navigate('/login');
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
            }
            
            const data = JSON.parse(responseText);
            console.log('Recipe creation response:', data);
            console.log('Recipe added successfully:', data);
            
            setRecipes(prevRecipes => [...prevRecipes, data]);
            return data;
        } catch (err) {
            console.error('Error adding recipe:', err);
            const errorMessage = err.message || 'Failed to add recipe';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }, [navigate]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    return (
        <RecipeContext.Provider value={{ 
            recipes, 
            setRecipes, 
            addRecipe, 
            loading, 
            error,
            fetchRecipes 
        }}>
            {children}
        </RecipeContext.Provider>
    );
};