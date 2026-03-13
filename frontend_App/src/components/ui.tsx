import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  style?: StyleProp<ViewStyle>;
};

export function AppButton({ title, onPress, disabled, variant = "primary", style }: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "ghost" && styles.buttonGhost,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "primary" && styles.buttonTextPrimary,
          variant !== "primary" && styles.buttonTextSecondary,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

type AppInputProps = TextInputProps & {
  label: string;
};

export function AppInput({ label, ...props }: AppInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor="#94a3b8"
        style={[styles.input, props.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#2563eb",
  },
  buttonSecondary: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    borderWidth: 1,
  },
  buttonGhost: {
    backgroundColor: "transparent",
    borderColor: "#cbd5e1",
    borderWidth: 1,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  buttonTextPrimary: {
    color: "#ffffff",
  },
  buttonTextSecondary: {
    color: "#1e293b",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    color: "#334155",
    fontWeight: "600",
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: "#0f172a",
  },
});
