import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { addTaskRequest } from '../../redux/slices/tasksSlice';
import { validateTask, ValidationErrors, formatAmountInput } from '../../constants/validations';
import { AppDispatch } from '../../redux/store';
import { STRINGS } from '../../constants/strings';
import { styles } from './CreateTaskScreen.styles';

interface TaskForm {
  title: string;
  amount: string;
}

export const CreateTaskScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<TaskForm>({
    title: '',
    amount: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleAmountChange = (text: string) => {
    const formatted = formatAmountInput(text);
    setFormData({ ...formData, amount: formatted });
  };

  const handleSave = async () => {
    const validationErrors = validateTask(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) {
      setErrors({ amount: 'Please enter a valid number' });
      return;
    }

    // Check internet
    const netState = await NetInfo.fetch();
    const isOnline = netState.isConnected && netState.isInternetReachable;

    dispatch(
      addTaskRequest({
        title: formData.title.trim(),
        amount,
      })
    );

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>{STRINGS.FORM.TITLE_LABEL}</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={formData.title}
              onChangeText={text => setFormData({ ...formData, title: text })}
              placeholder={STRINGS.FORM.TITLE_PLACEHOLDER}
              placeholderTextColor="#999"
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{STRINGS.FORM.AMOUNT_LABEL}</Text>
            <TextInput
              style={[styles.input, errors.amount && styles.inputError]}
              value={formData.amount}
              onChangeText={handleAmountChange}
              placeholder={STRINGS.FORM.AMOUNT_PLACEHOLDER}
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              maxLength={4}
            />
            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{STRINGS.BUTTONS.CREATE_TASK}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
