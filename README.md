# Foodie - Recipe Application (React Native / Expo)

Welcome to **Foodie**, a comprehensive React Native & Expo recipe application designed for browsing recipes across multiple categories, favoriting dishes, creating personal custom recipes, and managing personal recipes with full Edit and Delete support.

GitHub Repository: [https://github.com/mudasirunar/Foodie.git](https://github.com/mudasirunar/Foodie.git)

---

## 🌟 Features Overview

1. **Snack Expo Compatibility**: Clean Expo structure (`App.js`, `package.json`, `app.json`) optimized for instant import on [Snack Expo](https://snack.expo.dev) or running via **Expo Go**.
2. **10+ Horizontal Recipe Categories**: Includes 11 categories (`All`, `Italian`, `Mexican`, `Asian`, `American`, `Desserts`, `Vegetarian`, `Seafood`, `Breakfast`, `Healthy`, `My Food`).
3. **Comprehensive Recipe Details**:
   - Ingredients list with interactive checkboxes
   - Step-by-step preparation instructions
   - Preparation time (e.g. 25 mins)
   - Number of servings (e.g. 4)
   - Calories count (e.g. 450 kcal)
   - Difficulty level badge (Easy, Medium, Hard)
4. **Category Filtering**: Selecting any category dynamically filters the recipe feed.
5. **Interactive Favoriting**: Heart icon on every recipe card and detail modal to toggle favorite state.
6. **Dedicated Favorites Section**: Displays all saved favorite recipes.
7. **"My Food" Category & Add New Recipe**: Includes "My Food" in the horizontal category bar and prominent "Add New Recipe" options.
8. **Add New Recipe Form**:
   - Recipe name
   - Image selector & image URL upload
   - Dynamic ingredients list input
   - Step-by-step instructions input
   - Prep time, servings, calories, and difficulty level
   - **Save Recipe** button
9. **"My Recipes" Management**: Displays user-created recipes with persistent storage (`AsyncStorage`).
10. **Full Detail View for Custom Recipes**: View complete details of personal recipes anytime.
11. **Functional Edit & Delete**: Functional **Edit** button (pre-fills form) and **Delete** button (with confirmation alert) for all user-added recipes.
12. **Functional Back Button**: Clear, accessible back buttons on both Detail View modals and Add/Edit form modals.

---

## 🚀 How to Import into Snack Expo

1. Open [Snack Expo](https://snack.expo.dev).
2. Click on **Import Git Repository**.
3. Enter the repository URL:
   `https://github.com/mudasirunar/Foodie.git`
4. Snack will automatically import and run the application in the Web / iOS / Android simulator or via Expo Go on your mobile device!

---

## 📱 Running Locally

```bash
# Navigate to Foodie folder
cd Foodie

# Install dependencies
npm install

# Start Expo dev server
npx expo start
```
