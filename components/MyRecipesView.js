import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RecipeCard from './RecipeCard';

export default function MyRecipesView({
  recipes,
  onSelectRecipe,
  onToggleFavorite,
  onAddNewRecipe,
  onEditRecipe,
  onDeleteRecipe,
}) {
  const myRecipes = recipes.filter((r) => r.isUserRecipe);

  return (
    <View style={styles.container}>
      {/* Top Banner to Add New Recipe */}
      <TouchableOpacity style={styles.addCard} onPress={onAddNewRecipe} activeOpacity={0.85}>
        <View style={styles.addCardIconCircle}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </View>
        <View style={styles.addCardContent}>
          <Text style={styles.addCardTitle}>Create New Recipe</Text>
          <Text style={styles.addCardSubtitle}>
            Add your custom recipe with ingredients, steps, and photos
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#FF6B6B" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>My Custom Recipes</Text>
        <Text style={styles.countText}>{myRecipes.length} created</Text>
      </View>

      {myRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="restaurant-outline" size={56} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No Personal Recipes Yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap "Create New Recipe" above to add your first secret family dish!
          </Text>
        </View>
      ) : (
        <FlatList
          data={myRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => onSelectRecipe(item)}
              onToggleFavorite={onToggleFavorite}
              onEdit={onEditRecipe}
              onDelete={onDeleteRecipe}
              showEditControls={true}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1.5,
    borderColor: '#FFC0C0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  addCardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addCardContent: {
    flex: 1,
  },
  addCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF6B6B',
  },
  addCardSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  countText: {
    fontSize: 13,
    color: '#777777',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#555555',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
    marginTop: 6,
  },
});
