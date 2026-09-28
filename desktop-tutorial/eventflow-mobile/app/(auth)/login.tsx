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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const btnScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true, speed: 30 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.token) {
        router.replace('/(app)/dashboard');
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Background orbs */}
        <View style={styles.orb1} />
        <View style={styles.orb2} />

        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="calendar-star" size={32} color="#00D4AA" />
          </View>
          <Text style={styles.appName}>EventFlow</Text>
          <Text style={styles.tagline}>Gestion d'événements premium</Text>
        </View>

        {/* Glass Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bon retour 👋</Text>
          <Text style={styles.cardSubtitle}>Connectez-vous à votre espace</Text>

          {/* Email */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputRow, focusedField === 'email' && styles.inputRowFocused]}>
              <MaterialCommunityIcons name="email-outline" size={18} color={focusedField === 'email' ? '#00D4AA' : '#4A5568'} />
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                placeholderTextColor="#4A5568"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={[styles.inputRow, focusedField === 'password' && styles.inputRowFocused]}>
              <MaterialCommunityIcons name="lock-outline" size={18} color={focusedField === 'password' ? '#00D4AA' : '#4A5568'} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#4A5568"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#4A5568"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Button */}
          <Animated.View style={{ transform: [{ scale: btnScale }], marginTop: 8 }}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#0D1117" />
              ) : (
                <Text style={styles.buttonText}>Se connecter</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.linkBtn}>
            <Text style={styles.linkText}>Pas encore de compte ? </Text>
            <Text style={styles.linkAccent}>S'inscrire →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0D1117' },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 40,
  },
  orb1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(0,212,170,0.08)',
    top: -80,
    right: -80,
  },
  orb2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(99,102,241,0.06)',
    bottom: 40,
    left: -60,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(0,212,170,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0,212,170,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F0F6FC',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: 'rgba(22,27,34,0.85)',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F0F6FC',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 28,
  },
  fieldWrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8892A4',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  inputRowFocused: {
    borderColor: 'rgba(0,212,170,0.5)',
    backgroundColor: 'rgba(0,212,170,0.04)',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#F0F6FC',
  },
  button: {
    backgroundColor: '#00D4AA',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    color: '#0D1117',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  dividerText: {
    color: '#4A5568',
    fontSize: 13,
  },
  linkBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: '#8892A4',
    fontSize: 14,
  },
  linkAccent: {
    color: '#00D4AA',
    fontSize: 14,
    fontWeight: '600',
  },
});
