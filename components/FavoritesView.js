import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RecipeCard from './RecipeCard';

export default function FavoritesView({
  recipes,
  onSelectRecipe,
  onToggleFavorite,
  onGoToExplore,
}) {
  const favoriteRecipes = recipes.filter((r) => r.isFavorite);

  if (favoriteRecipes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-dislike-outline" size={64} color="#DDD" />
        <Text style={styles.emptyTitle}>No Favorite Recipes Yet</Text>
        <Text style={styles.emptySubtitle}>
          Tap the heart icon on any recipe to save it here for quick access!
        </Text>
        <TouchableOpacity style={styles.exploreBtn} onPress={onGoToExplore}>
          <Text style={styles.exploreBtnText}>Browse Recipes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Saved Favorites</Text>
        <Text style={styles.countText}>{favoriteRecipes.length} recipes</Text>
      </View>

      <FlatList
        data={favoriteRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => onSelectRecipe(item)}
            onToggleFavorite={onToggleFavorite}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
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
    color: '#777',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#444',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreBtn: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
