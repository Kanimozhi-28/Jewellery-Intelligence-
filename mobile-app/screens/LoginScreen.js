import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleLogin = async () => {
        const success = await login(username, password);
        if (!success) {
            setError('Invalid credentials');
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
                <Text style={styles.title}>DATA GOLD</Text>
                <Text style={styles.subtitle}>Salesman Portal</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Username"
                        placeholderTextColor={theme.colors.textSecondary}
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={theme.colors.textSecondary}
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotButton}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        padding: theme.spacing.l,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: theme.colors.primary,
        letterSpacing: 2,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: 18,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xl * 2,
    },
    inputContainer: {
        width: '100%',
        marginBottom: theme.spacing.l,
    },
    input: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: theme.spacing.m,
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: '#333',
        fontSize: 16,
    },
    button: {
        backgroundColor: theme.colors.primary,
        width: '100%',
        padding: theme.spacing.m,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    buttonText: {
        color: theme.colors.black,
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    error: {
        color: theme.colors.danger,
        marginBottom: theme.spacing.m,
    },
    forgotButton: {
        marginTop: theme.spacing.s,
    },
    forgotText: {
        color: theme.colors.textSecondary,
    }
});
