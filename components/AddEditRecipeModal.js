import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../data/categories';

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
];

export default function AddEditRecipeModal({ visible, recipeToEdit, onClose, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('My Food');
  const [image, setImage] = useState(PRESET_IMAGES[0]);
  const [prepTime, setPrepTime] = useState('20 mins');
  const [servings, setServings] = useState('4');
  const [calories, setCalories] = useState('450 kcal');
  const [difficulty, setDifficulty] = useState('Medium');
  
  // Ingredients list array
  const [ingredients, setIngredients] = useState(['', '']);
  // Instructions list array
  const [instructions, setInstructions] = useState(['', '']);

  useEffect(() => {
    if (recipeToEdit) {
      setName(recipeToEdit.name || '');
      setCategory(recipeToEdit.category || 'My Food');
      setImage(recipeToEdit.image || PRESET_IMAGES[0]);
      setPrepTime(recipeToEdit.prepTime || '20 mins');
      setServings(String(recipeToEdit.servings || 4));
      setCalories(recipeToEdit.calories || '450 kcal');
      setDifficulty(recipeToEdit.difficulty || 'Medium');
      setIngredients(recipeToEdit.ingredients && recipeToEdit.ingredients.length > 0 ? [...recipeToEdit.ingredients] : ['', '']);
      setInstructions(recipeToEdit.instructions && recipeToEdit.instructions.length > 0 ? [...recipeToEdit.instructions] : ['', '']);
    } else {
      resetForm();
    }
  }, [recipeToEdit, visible]);

  const resetForm = () => {
    setName('');
    setCategory('My Food');
    setImage(PRESET_IMAGES[0]);
    setPrepTime('20 mins');
    setServings('4');
    setCalories('450 kcal');
    setDifficulty('Medium');
    setIngredients(['1 cup Flour', '2 Eggs', '1/2 tsp Salt']);
    setInstructions(['Mix dry ingredients in a bowl.', 'Whisk eggs and combine until smooth.', 'Cook on medium heat for 10 mins.']);
  };

  // Ingredient helpers
  const handleIngredientChange = (text, index) => {
    const updated = [...ingredients];
    updated[index] = text;
    setIngredients(updated);
  };
  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };
  const removeIngredientField = (index) => {
    if (ingredients.length <= 1) return;
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  // Instruction helpers
  const handleInstructionChange = (text, index) => {
    const updated = [...instructions];
    updated[index] = text;
    setInstructions(updated);
  };
  const addInstructionField = () => {
    setInstructions([...instructions, '']);
  };
  const removeInstructionField = (index) => {
    if (instructions.length <= 1) return;
    const updated = instructions.filter((_, i) => i !== index);
    setInstructions(updated);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a recipe name.');
      return;
    }

    const filteredIngredients = ingredients.map((i) => i.trim()).filter((i) => i.length > 0);
    if (filteredIngredients.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one ingredient.');
      return;
    }

    const filteredInstructions = instructions.map((i) => i.trim()).filter((i) => i.length > 0);
    if (filteredInstructions.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one instruction step.');
      return;
    }

    const recipeData = {
      id: recipeToEdit ? recipeToEdit.id : `user_rec_${Date.now()}`,
      name: name.trim(),
      category: category || 'My Food',
      image: image || PRESET_IMAGES[0],
      prepTime: prepTime.trim() || '20 mins',
      servings: parseInt(servings, 10) || 4,
      calories: calories.trim() || '450 kcal',
      difficulty: difficulty || 'Medium',
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      isFavorite: recipeToEdit ? recipeToEdit.isFavorite : false,
      isUserRecipe: true,
    };

    onSave(recipeData);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {recipeToEdit ? 'Edit Recipe' : 'Add New Recipe'}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Recipe Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipe Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Grandma's Apple Pie"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPicker}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryOption, category === cat.name && styles.categoryOptionSelected]}
                  onPress={() => setCategory(cat.name)}
                >
                  <Text style={[styles.categoryOptionText, category === cat.name && styles.categoryOptionTextSelected]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Image Selection / Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipe Image</Text>
            <Text style={styles.sublabel}>Select a preset image or enter image URL below:</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
              {PRESET_IMAGES.map((imgUrl, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.presetImageWrapper, image === imgUrl && styles.presetImageSelected]}
                  onPress={() => setImage(imgUrl)}
                >
                  <Image source={{ uri: imgUrl }} style={styles.presetImage} />
                  {image === imgUrl && (
                    <View style={styles.checkOverlay}>
                      <Ionicons name="checkmark-circle" size={22} color="#FF6B6B" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder="Or paste Image URL (https://...)"
              value={image}
              onChangeText={setImage}
            />
          </View>

          {/* Recipe Meta Details (Prep time, Servings, Calories, Difficulty) */}
          <View style={styles.rowTwo}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Prep Time</Text>
              <TextInput
                style={styles.input}
                placeholder="25 mins"
                value={prepTime}
                onChangeText={setPrepTime}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Servings</Text>
              <TextInput
                style={styles.input}
                placeholder="4"
                keyboardType="numeric"
                value={servings}
                onChangeText={setServings}
              />
            </View>
          </View>

          <View style={styles.rowTwo}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Calories</Text>
              <TextInput
                style={styles.input}
                placeholder="450 kcal"
                value={calories}
                onChangeText={setCalories}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.difficultyContainer}>
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <TouchableOpacity
                    key={diff}
                    style={[styles.diffChip, difficulty === diff && styles.diffChipSelected]}
                    onPress={() => setDifficulty(diff)}
                  >
                    <Text style={[styles.diffChipText, difficulty === diff && styles.diffChipTextSelected]}>
                      {diff}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Ingredients List Input */}
          <View style={styles.inputGroup}>
            <View style={styles.listHeaderRow}>
              <Text style={styles.label}>Ingredients List *</Text>
              <TouchableOpacity style={styles.addItemBtn} onPress={addIngredientField}>
                <Ionicons name="add" size={16} color="#FF6B6B" />
                <Text style={styles.addItemBtnText}>Add Ingredient</Text>
              </TouchableOpacity>
            </View>

            {ingredients.map((ing, idx) => (
              <View key={idx} style={styles.dynamicRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder={`Ingredient #${idx + 1}`}
                  value={ing}
                  onChangeText={(txt) => handleIngredientChange(txt, idx)}
                />
                {ingredients.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeRowBtn}
                    onPress={() => removeIngredientField(idx)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#F44336" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Step-by-Step Instructions Input */}
          <View style={styles.inputGroup}>
            <View style={styles.listHeaderRow}>
              <Text style={styles.label}>Step-by-Step Instructions *</Text>
              <TouchableOpacity style={styles.addItemBtn} onPress={addInstructionField}>
                <Ionicons name="add" size={16} color="#FF6B6B" />
                <Text style={styles.addItemBtnText}>Add Step</Text>
              </TouchableOpacity>
            </View>

            {instructions.map((inst, idx) => (
              <View key={idx} style={styles.dynamicRow}>
                <Text style={styles.stepBadge}>{idx + 1}</Text>
                <TextInput
                  style={[styles.input, { flex: 1, minHeight: 46 }]}
                  placeholder={`Step #${idx + 1} instructions`}
                  multiline
                  value={inst}
                  onChangeText={(txt) => handleInstructionChange(txt, idx)}
                />
                {instructions.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeRowBtn}
                    onPress={() => removeInstructionField(idx)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#F44336" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Save Recipe Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Recipe</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
  },
  sublabel: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A1A1A',
  },
  categoryPicker: {
    flexDirection: 'row',
  },
  categoryOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F2F5',
    marginRight: 8,
  },
  categoryOptionSelected: {
    backgroundColor: '#FF6B6B',
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  categoryOptionTextSelected: {
    color: '#FFFFFF',
  },
  presetScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  presetImageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetImageSelected: {
    borderColor: '#FF6B6B',
  },
  presetImage: {
    width: '100%',
    height: '100%',
  },
  checkOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  rowTwo: {
    flexDirection: 'row',
  },
  difficultyContainer: {
    flexDirection: 'row',
  },
  diffChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
    marginHorizontal: 2,
  },
  diffChipSelected: {
    backgroundColor: '#FF6B6B',
  },
  diffChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  diffChipTextSelected: {
    color: '#FFFFFF',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addItemBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B6B',
    marginLeft: 2,
  },
  dynamicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
    marginRight: 8,
  },
  removeRowBtn: {
    padding: 8,
    marginLeft: 4,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
});
