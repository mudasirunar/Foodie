import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../data/categories';

export default function CategoryBar({ selectedCategory, onSelectCategory, onAddNewRecipe }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity style={styles.addRecipeBtn} onPress={onAddNewRecipe}>
          <Ionicons name="add-circle" size={18} color="#FF6B6B" />
          <Text style={styles.addRecipeText}>Add New Recipe</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          const isMyFood = category.id === 'my_food';

          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                isSelected && styles.selectedChip,
                isMyFood && styles.myFoodChip,
                isMyFood && isSelected && styles.selectedMyFoodChip,
              ]}
              onPress={() => onSelectCategory(category.id)}
            >
              <Ionicons
                name={category.icon}
                size={18}
                color={isSelected ? '#FFFFFF' : isMyFood ? '#FF6B6B' : '#555555'}
                style={styles.chipIcon}
              />
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.selectedChipText,
                  isMyFood && !isSelected && styles.myFoodChipText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
  },
  addRecipeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  addRecipeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 4,
  },
  scrollContainer: {
    paddingHorizontal: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  selectedChip: {
    backgroundColor: '#FF6B6B',
  },
  myFoodChip: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFC0C0',
  },
  selectedMyFoodChip: {
    backgroundColor: '#E64A19',
    borderColor: '#E64A19',
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  myFoodChipText: {
    color: '#FF6B6B',
  },
});
