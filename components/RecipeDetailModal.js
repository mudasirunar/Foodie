import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RecipeDetailModal({ visible, recipe, onClose, onToggleFavorite, onEdit, onDelete }) {
  const [checkedIngredients, setCheckedIngredients] = useState({});

  if (!recipe) return null;

  const toggleIngredientCheck = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        {/* Floating Back Button & Header Controls */}
        <View style={styles.topHeaderBar}>
          <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.favoriteCircle}
              onPress={() => onToggleFavorite(recipe.id)}
            >
              <Ionicons
                name={recipe.isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={recipe.isFavorite ? '#FF4D4D' : '#333333'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Hero Recipe Image */}
          <View style={styles.heroImageContainer}>
            <Image
              source={{ uri: recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80' }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{recipe.category}</Text>
            </View>
          </View>

          <View style={styles.contentBody}>
            {/* Title & Favorite Row */}
            <View style={styles.titleRow}>
              <Text style={styles.recipeTitle}>{recipe.name}</Text>
            </View>

            {/* Quick Stat Cards: Prep Time, Servings, Calories, Difficulty */}
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Ionicons name="time-outline" size={22} color="#FF6B6B" />
                <Text style={styles.statLabel}>Prep Time</Text>
                <Text style={styles.statValue}>{recipe.prepTime || '20 mins'}</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="people-outline" size={22} color="#4ECDC4" />
                <Text style={styles.statLabel}>Servings</Text>
                <Text style={styles.statValue}>{recipe.servings || 4}</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="flame-outline" size={22} color="#FF9F43" />
                <Text style={styles.statLabel}>Calories</Text>
                <Text style={styles.statValue}>{recipe.calories || '450 kcal'}</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="fitness-outline" size={22} color={getDifficultyColor(recipe.difficulty)} />
                <Text style={styles.statLabel}>Difficulty</Text>
                <Text style={[styles.statValue, { color: getDifficultyColor(recipe.difficulty) }]}>
                  {recipe.difficulty || 'Easy'}
                </Text>
              </View>
            </View>

            {/* Action Bar for User Recipes */}
            {recipe.isUserRecipe && (
              <View style={styles.userActionsRow}>
                <TouchableOpacity
                  style={[styles.userActionBtn, styles.editActionBtn]}
                  onPress={() => {
                    onClose();
                    onEdit && onEdit(recipe);
                  }}
                >
                  <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.userActionBtnText}>Edit Recipe</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.userActionBtn, styles.deleteActionBtn]}
                  onPress={() => {
                    onClose();
                    onDelete && onDelete(recipe.id);
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.userActionBtnText}>Delete Recipe</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Ingredients Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="basket-outline" size={20} color="#FF6B6B" />
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <Text style={styles.ingredientCount}>
                  ({recipe.ingredients ? recipe.ingredients.length : 0} items)
                </Text>
              </View>

              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((item, idx) => {
                  const isChecked = checkedIngredients[idx];
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={styles.ingredientRow}
                      onPress={() => toggleIngredientCheck(idx)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isChecked ? 'checkbox' : 'square-outline'}
                        size={22}
                        color={isChecked ? '#4CAF50' : '#888888'}
                      />
                      <Text style={[styles.ingredientText, isChecked && styles.ingredientTextChecked]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={styles.emptyText}>No ingredients specified.</Text>
              )}
            </View>

            {/* Instructions Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="list-outline" size={20} color="#FF6B6B" />
                <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>
              </View>

              {recipe.instructions && recipe.instructions.length > 0 ? (
                recipe.instructions.map((step, idx) => (
                  <View key={idx} style={styles.instructionStep}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{step}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No instructions specified.</Text>
              )}
            </View>

            {/* Functional Footer Back Button */}
            <TouchableOpacity style={styles.footerBackButton} onPress={onClose}>
              <Ionicons name="arrow-back-circle" size={22} color="#FFFFFF" />
              <Text style={styles.footerBackButtonText}>Back to Recipes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 6,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  heroImageContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  categoryTag: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  contentBody: {
    padding: 20,
  },
  titleRow: {
    marginBottom: 16,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#777777',
    marginTop: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222222',
    marginTop: 2,
  },
  userActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 12,
  },
  editActionBtn: {
    backgroundColor: '#2196F3',
  },
  deleteActionBtn: {
    backgroundColor: '#F44336',
  },
  userActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  ingredientCount: {
    fontSize: 13,
    color: '#888888',
    marginLeft: 6,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  ingredientText: {
    fontSize: 15,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '800',
  },
  instructionText: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 22,
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
  },
  footerBackButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 30,
  },
  footerBackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
