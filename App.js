import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import RecipeCard from './components/RecipeCard';
import RecipeDetailModal from './components/RecipeDetailModal';
import AddEditRecipeModal from './components/AddEditRecipeModal';
import FavoritesView from './components/FavoritesView';
import MyRecipesView from './components/MyRecipesView';

import { INITIAL_RECIPES } from './data/initialRecipes';

const STORAGE_KEY = '@foodie_user_recipes_v2';

export default function App() {
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'favorites' | 'my_recipes'
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);

  // Load recipes from AsyncStorage on mount
  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecipes(parsed);
        }
      }
    } catch (e) {
      console.log('Error loading saved recipes:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const persistRecipes = async (newRecipes) => {
    setRecipes(newRecipes);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecipes));
    } catch (e) {
      console.log('Error persisting recipes:', e);
    }
  };

  // Favorite toggle function
  const handleToggleFavorite = (recipeId) => {
    const updated = recipes.map((rec) => {
      if (rec.id === recipeId) {
        return { ...rec, isFavorite: !rec.isFavorite };
      }
      return rec;
    });
    persistRecipes(updated);

    // Update selected recipe if modal is open
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  // Add / Edit Recipe Save handler
  const handleSaveRecipe = (recipeData) => {
    const existingIndex = recipes.findIndex((r) => r.id === recipeData.id);
    let updated;
    if (existingIndex >= 0) {
      // Edit existing
      updated = [...recipes];
      updated[existingIndex] = recipeData;
    } else {
      // Add new
      updated = [recipeData, ...recipes];
    }
    persistRecipes(updated);

    // Switch view to My Recipes or My Food category so user immediately sees their recipe
    if (activeTab === 'feed' && selectedCategory !== 'my_food') {
      setSelectedCategory('my_food');
    }
  };

  // Delete Recipe handler
  const handleDeleteRecipe = (recipeId) => {
    const updated = recipes.filter((r) => r.id !== recipeId);
    persistRecipes(updated);
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setDetailModalVisible(false);
      setSelectedRecipe(null);
    }
  };

  const handleOpenAddRecipe = () => {
    setRecipeToEdit(null);
    setAddModalVisible(true);
  };

  const handleOpenEditRecipe = (recipe) => {
    setRecipeToEdit(recipe);
    setAddModalVisible(true);
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setDetailModalVisible(true);
  };

  // Filter recipes based on tab, category, and search keyword
  const getFilteredRecipes = () => {
    let list = [...recipes];

    // Filter by search keyword
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(kw) ||
          r.category.toLowerCase().includes(kw) ||
          (r.ingredients && r.ingredients.some((i) => i.toLowerCase().includes(kw)))
      );
    }

    // Filter by selected category chip in Feed view
    if (selectedCategory === 'my_food') {
      list = list.filter((r) => r.isUserRecipe || r.category === 'My Food');
    } else if (selectedCategory !== 'all') {
      list = list.filter((r) => r.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    return list;
  };

  const filteredRecipes = getFilteredRecipes();
  const favoritesCount = recipes.filter((r) => r.isFavorite).length;
  const myRecipesCount = recipes.filter((r) => r.isUserRecipe).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header with App Logo, Search Bar, and Tabs */}
      <Header
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favoritesCount}
        myRecipesCount={myRecipesCount}
      />

      {/* Content Rendering based on Active Tab */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading Foodie Recipes...</Text>
        </View>
      ) : activeTab === 'favorites' ? (
        <FavoritesView
          recipes={recipes}
          onSelectRecipe={handleSelectRecipe}
          onToggleFavorite={handleToggleFavorite}
          onGoToExplore={() => {
            setActiveTab('feed');
            setSelectedCategory('all');
          }}
        />
      ) : activeTab === 'my_recipes' ? (
        <MyRecipesView
          recipes={recipes}
          onSelectRecipe={handleSelectRecipe}
          onToggleFavorite={handleToggleFavorite}
          onAddNewRecipe={handleOpenAddRecipe}
          onEditRecipe={handleOpenEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
        />
      ) : (
        /* Main Explore / Feed View */
        <View style={styles.feedContainer}>
          {/* Categories Horizontal Bar with 10+ categories and My Food */}
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddNewRecipe={handleOpenAddRecipe}
          />

          {/* Banner if My Food category is selected */}
          {selectedCategory === 'my_food' && (
            <View style={styles.myFoodHeaderBox}>
              <View style={styles.myFoodHeaderRow}>
                <Ionicons name="restaurant" size={20} color="#FF6B6B" />
                <Text style={styles.myFoodHeaderTitle}>My Personal Food Collection</Text>
              </View>
              <TouchableOpacity style={styles.myFoodAddBtn} onPress={handleOpenAddRecipe}>
                <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                <Text style={styles.myFoodAddBtnText}>Add New Recipe</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Main Feed Recipe List */}
          {filteredRecipes.length === 0 ? (
            <View style={styles.emptyFeed}>
              <Ionicons name="search-outline" size={48} color="#CCCCCC" />
              <Text style={styles.emptyFeedTitle}>No recipes found</Text>
              <Text style={styles.emptyFeedSubtitle}>
                Try selecting another category or clear your search query.
              </Text>
              <TouchableOpacity
                style={styles.resetFilterBtn}
                onPress={() => {
                  setSelectedCategory('all');
                  setSearchKeyword('');
                }}
              >
                <Text style={styles.resetFilterBtnText}>Show All Recipes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredRecipes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <RecipeCard
                  recipe={item}
                  onPress={() => handleSelectRecipe(item)}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={handleOpenEditRecipe}
                  onDelete={handleDeleteRecipe}
                  showEditControls={item.isUserRecipe}
                />
              )}
              contentContainerStyle={styles.listPadding}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}

      {/* Detail Recipe View Modal */}
      <RecipeDetailModal
        visible={detailModalVisible}
        recipe={selectedRecipe}
        onClose={() => setDetailModalVisible(false)}
        onToggleFavorite={handleToggleFavorite}
        onEdit={handleOpenEditRecipe}
        onDelete={handleDeleteRecipe}
      />

      {/* Add / Edit Recipe Modal */}
      <AddEditRecipeModal
        visible={addModalVisible}
        recipeToEdit={recipeToEdit}
        onClose={() => setAddModalVisible(false)}
        onSave={handleSaveRecipe}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  feedContainer: {
    flex: 1,
  },
  myFoodHeaderBox: {
    backgroundColor: '#FFF0F0',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  myFoodHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myFoodHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
    marginLeft: 6,
  },
  myFoodAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  myFoodAddBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyFeed: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyFeedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444444',
    marginTop: 12,
  },
  emptyFeedSubtitle: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  resetFilterBtn: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
  },
  resetFilterBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
  },
});
