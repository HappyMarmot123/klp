import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthService } from "../services/authService";
import {
  registerSchema,
  RegisterFormData,
} from "../shared/utils/validationSchemas";

export default function RegisterScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });

  const getErrorMessage = (error: any) => {
    const errorCode = error.code;
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "이미 존재하는 이메일입니다.";
      case "auth/invalid-email":
        return "올바른 이메일 형식이 아닙니다.";
      case "auth/weak-password":
        return "비밀번호가 너무 약합니다.";
      case "auth/network-request-failed":
        return "네트워크 연결을 확인해주세요.";
      default:
        return "다시 시도하세요.";
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      const displayName = data.email.split("@")[0];
      await AuthService.register(data.email, data.password, displayName);
      Alert.alert("성공", "회원가입이 완료되었습니다.", [
        { text: "확인", onPress: () => navigation.replace("Home") },
      ]);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      Alert.alert("회원가입 실패", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>회원가입</Text>

            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.email && styles.inputErrorBackground,
                    ]}
                    placeholder="이메일"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.password && styles.inputErrorBackground,
                    ]}
                    placeholder="비밀번호 (영문, 숫자, 특수문자 포함 8자 이상)"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.confirmPassword && styles.inputErrorBackground,
                    ]}
                    placeholder="비밀번호 확인"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                )}
              />
            </View>

            {Object.keys(errors).length > 0 && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  입력란을 모두 올바르게 입력해주세요.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "가입 중..." : "회원가입"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={handleLogin}>
              <Text style={styles.linkText}>
                이미 계정이 있으신가요? 로그인
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    color: "#ffffff",
  },
  inputErrorBackground: {
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderColor: "rgba(255, 107, 107, 0.6)",
  },
  errorContainer: {
    backgroundColor: "rgba(255, 68, 68, 0.2)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ff4444",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    padding: 16,
  },
  linkText: {
    color: "#87ceeb",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
});
