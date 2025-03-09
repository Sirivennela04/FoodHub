import express from 'express';
import mongoose from 'mongoose';
import { RecipeModel } from "../models/Recipe.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Browse all recipes
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all recipes');
        const result = await RecipeModel.find({}).sort({ _id: -1 });
        console.log(`Found ${result.length} recipes`);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ message: "Error fetching recipes", error: err.message });
    }
});

// Save a recipe
router.post('/save/:recipeId', verifyToken, async (req, res) => {
    try {
        const { recipeId } = req.params;
        const username = req.user.username;
        console.log('Save recipe request:', { recipeId, username });

        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }

        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const recipe = await RecipeModel.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        user.savedRecipes.push(recipeId);
        await user.save();
        res.status(200).json({ message: "Recipe saved successfully" });
    } catch (err) {
        console.error('Error saving recipe:', err);
        res.status(500).json({ message: "Error saving recipe", error: err.message });
    }
});

// Unsave a recipe
router.delete('/save/:recipeId', verifyToken, async (req, res) => {
    try {
        const { recipeId } = req.params;
        const username = req.user.username;
        console.log('Unsave recipe request:', { recipeId, username });

        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            console.log('Invalid recipe ID format:', recipeId);
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }

        const user = await UserModel.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(404).json({ message: "User not found" });
        }

        user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
        await user.save();
        console.log('Recipe unsaved successfully:', recipeId);

        res.status(200).json({ message: "Recipe removed from saved recipes" });
    } catch (err) {
        console.error('Error removing saved recipe:', err);
        res.status(500).json({ message: "Error removing recipe", error: err.message });
    }
});

// Get saved recipes
router.get('/saved', verifyToken, async (req, res) => {
    try {
        const username = req.user.username;
        console.log('Fetching saved recipes for user:', username);

        const user = await UserModel.findOne({ username }).populate('savedRecipes');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log('User found:', user);

        res.status(200).json(user.savedRecipes);
    } catch (err) {
        console.error('Error fetching saved recipes:', err);
        res.status(500).json({ message: "Error fetching saved recipes", error: err.message });
    }
});

// Create new recipe
router.post('/', verifyToken, async (req, res) => {
    try {
        console.log('Creating new recipe. User:', req.user);
        console.log('Recipe data:', req.body);

        const { name, ingredients, instructions, imageUrl, cookingTime, cuisine } = req.body;

        const requiredFields = ['name', 'ingredients', 'instructions', 'imageUrl', 'cookingTime'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.log('Missing required fields:', missingFields);
            return res.status(400).json({ 
                message: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        const recipe = new RecipeModel({
            name,
            ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(i => i.trim()),
            instructions,
            imageUrl,
            cookingTime: parseInt(cookingTime) || 0,
            cuisine: cuisine || 'Not specified',
            userOwner: req.user.username
        });

        console.log('Saving recipe:', recipe);
        const result = await recipe.save();
        console.log('Recipe saved successfully:', result);

        res.status(201).json(result);
    } catch (err) {
        console.error('Error creating recipe:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation error", 
                errors: Object.values(err.errors).map(e => e.message) 
            });
        }
        res.status(500).json({ message: "Error creating recipe", error: err.message });
    }
});

// Get user's recipes
router.get('/userRecipes/:username', async (req, res) => {
    try {
        const recipes = await RecipeModel.find({ userOwner: req.params.username });
        res.json(recipes);
    } catch (err) {
        console.error('Error fetching user recipes:', err);
        res.status(500).json({ message: "Error fetching recipes", error: err.message });
    }
});

// Get a recipe by ID
router.get("/:recipeId", async(req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }

        const result = await RecipeModel.findById(req.params.recipeId);
        if (!result) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching recipe:', err);
        res.status(500).json({ message: "Error fetching recipe", error: err.message });
    }
});

// Delete a recipe
router.delete('/:recipeId', async (req, res) => {
    try {
        const { recipeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }

        const recipe = await RecipeModel.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        await RecipeModel.findByIdAndDelete(recipeId);
        res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (err) {
        console.error('Error deleting recipe:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export { router as recipeRouter };
