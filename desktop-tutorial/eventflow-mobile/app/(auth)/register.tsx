import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, Animated, KeyboardAvoidingView,
  Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'http://192.168.2.96:3000/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const btnScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true, speed: 30 }).start();
  const handlePressOut = () =>
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      if (response.data.success) {
        Alert.alert('Succès 🎉', 'Compte créé avec succès');
        router.replace('/(auth)/login');
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Nom complet', placeholder: 'Votre nom', icon: 'account-outline', value: name, setter: setName, type: 'default' },
    { key: 'email', label: 'Email', placeholder: 'votre@email.com', icon: 'email-outline', value: email, setter: setEmail, type: 'email-address' },
    { key: 'password', label: 'Mot de passe', placeholder: '••••••••', icon: 'lock-outline', value: password, setter: setPassword, secure: true },
    { key: 'confirm', label: 'Confirmer', placeholder: '••••••••', icon: 'lock-check-outline', value: confirmPassword, setter: setConfirmPassword, secure: true },
  ];

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.orb1} />
        <View style={styles.orb2} />

        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="calendar-star" size={32} color="#00D4AA" />
          </View>
          <Text style={styles.appName}>Créer un compte</Text>
          <Text style={styles.tagline}>Rejoignez la communauté EventFlow</Text>
        </View>

        <View style={styles.card}>
          {fields.map((field) => (
            <View key={field.key} style={styles.fieldWrapper}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={[styles.inputRow, focusedField === field.key && styles.inputRowFocused]}>
                <MaterialCommunityIcons
                  name={field.icon as any}
                  size={18}
                  color={focusedField === field.key ? '#00D4AA' : '#4A5568'}
                />
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor="#4A5568"
                  value={field.value}
                  onChangeText={field.setter}
                  keyboardType={(field as any).type || 'default'}
                  autoCapitalize="none"
                  secureTextEntry={field.secure && !showPassword}
                  editable={!loading}
                  onFocus={() => setFocusedField(field.key)}
                  onBlur={() => setFocusedField(null)}
                />
                {field.secure && (
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#4A5568"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          <Animated.View style={{ transform: [{ scale: btnScale }], marginTop: 8 }}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#0D1117" />
              ) : (
                <Text style={styles.buttonText}>Créer mon compte</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity onPress={() => router.back()} style={styles.linkBtn}>
            <Text style={styles.linkText}>Déjà inscrit ? </Text>
            <Text style={styles.linkAccent}>Se connecter →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D1117' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 40 },
  orb1: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(0,212,170,0.07)', top: -60, right: -80,
  },
  orb2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(99,102,241,0.06)', bottom: 40, left: -60,
  },
  logoSection: { alignItems: 'center', marginBottom: 36 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: 'rgba(0,212,170,0.12)',
    borderWidth: 1, borderColor: 'rgba(0,212,170,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  appName: { fontSize: 26, fontWeight: '800', color: '#F0F6FC', letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: '#4A5568', marginTop: 4 },
  card: {
    backgroundColor: 'rgba(22,27,34,0.85)', borderRadius: 24, padding: 28,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  fieldWrapper: { marginBottom: 16 },
  label: {
    fontSize: 12, fontWeight: '600', color: '#8892A4',
    letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14, paddingVertical: 14, gap: 10,
  },
  inputRowFocused: { borderColor: 'rgba(0,212,170,0.5)', backgroundColor: 'rgba(0,212,170,0.04)' },
  input: { flex: 1, fontSize: 15, color: '#F0F6FC' },
  button: {
    backgroundColor: '#00D4AA', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#0D1117', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 22, gap: 12 },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  dividerText: { color: '#4A5568', fontSize: 13 },
  linkBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  linkText: { color: '#8892A4', fontSize: 14 },
  linkAccent: { color: '#00D4AA', fontSize: 14, fontWeight: '600' },
});
