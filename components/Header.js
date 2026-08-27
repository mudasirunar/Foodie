import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ searchKeyword, setSearchKeyword, activeTab, setActiveTab, favoritesCount, myRecipesCount }) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="restaurant" size={24} color="#FF6B6B" />
          </View>
          <View>
            <Text style={styles.logoTitle}>Foodie</Text>
            <Text style={styles.logoSubtitle}>Discover & Cook Delicious Recipes</Text>
          </View>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes, ingredients..."
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          placeholderTextColor="#999"
        />
        {searchKeyword.length > 0 && (
          <TouchableOpacity onPress={() => setSearchKeyword('')}>
            <Ionicons name="close-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => setActiveTab('feed')}
        >
          <Ionicons name="compass-outline" size={18} color={activeTab === 'feed' ? '#FF6B6B' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Ionicons name="heart-outline" size={18} color={activeTab === 'favorites' ? '#FF6B6B' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>Favorites ({favoritesCount})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'my_recipes' && styles.activeTab]}
          onPress={() => setActiveTab('my_recipes')}
        >
          <Ionicons name="journal-outline" size={18} color={activeTab === 'my_recipes' ? '#FF6B6B' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'my_recipes' && styles.activeTabText]}>My Recipes ({myRecipesCount})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  logoSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: -2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#FFF0F0',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#FF6B6B',
  },
});
