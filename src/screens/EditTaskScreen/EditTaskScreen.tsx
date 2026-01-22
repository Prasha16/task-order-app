import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { updateTaskRequest } from '../../redux/slices/tasksSlice';
import { validateTask, formatAmountInput } from '../../constants/validations';
import { AppDispatch, RootState } from '../../redux/store';
import { SyncStatus } from '../../types/Task';
import { ROUTES } from '../../navigation/routes';
import { STRINGS } from '../../constants/strings';
import { styles } from './EditTaskScreen.styles';

export const EditTaskScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const taskId = route.params?.taskId;
  const task = useSelector((state: RootState) =>
    state.tasks.items.find(t => t.id === taskId)
  );

  const isSynced = task?.syncStatus === SyncStatus.SYNCED;

  const [formData, setFormData] = useState({
    title: task?.title || '',
    amount: task?.amount?.toString() || '',
  });

  const [errors, setErrors] = useState({});

  const handleAmountChange = (text: string) => {
    const formatted = formatAmountInput(text);
    setFormData({ ...formData, amount: formatted });
  };

  const handleSave = () => {
    if (isSynced) {
      Alert.alert(STRINGS.ALERTS.CANNOT_EDIT_TITLE, STRINGS.ALERTS.CANNOT_EDIT_MESSAGE);
      return;
    }

    const validationErrors = validateTask(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    dispatch(
      updateTaskRequest({
        id: taskId,
        data: {
          title: formData.title.trim(),
          amount: Number(formData.amount),
        },
      })
    );
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isSynced && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>{STRINGS.ALERTS.SYNCED_WARNING}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>{STRINGS.FORM.TITLE_LABEL}</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError, isSynced && styles.disabledInput]}
              value={formData.title}
              onChangeText={text => setFormData({ ...formData, title: text })}
              placeholder={STRINGS.FORM.TITLE_PLACEHOLDER}
              placeholderTextColor="#999"
              editable={!isSynced}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{STRINGS.FORM.AMOUNT_LABEL}</Text>
            <TextInput
              style={[styles.input, errors.amount && styles.inputError, isSynced && styles.disabledInput]}
              value={formData.amount}
              onChangeText={handleAmountChange}
              placeholder={STRINGS.FORM.AMOUNT_PLACEHOLDER}
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              editable={!isSynced}
              maxLength={4}
            />
            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isSynced && styles.disabledButton]}
            onPress={handleSave}
            disabled={isSynced}
          >
            <Text style={styles.saveButtonText}>{STRINGS.BUTTONS.UPDATE_TASK}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
