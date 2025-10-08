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
import { loginSchema, LoginFormData } from "../shared/utils/validationSchemas";

export default function LoginScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const getErrorMessage = (error: any) => {
    const errorCode = error.code;
    switch (errorCode) {
      case "auth/invalid-credential":
        return "올바른 이메일과 비밀번호를 입력해주세요.";
      case "auth/user-not-found":
        return "존재하지 않는 이메일입니다.";
      case "auth/wrong-password":
        return "비밀번호가 올바르지 않습니다.";
      case "auth/invalid-email":
        return "올바른 이메일 형식이 아닙니다.";
      case "auth/user-disabled":
        return "비활성화된 계정입니다.";
      case "auth/too-many-requests":
        return "너무 많은 시도로 인해 일시적으로 차단되었습니다.";
      case "auth/network-request-failed":
        return "네트워크 연결을 확인해주세요.";
      default:
        return "다시 시도하세요.";
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await AuthService.login(data.email, data.password);
      navigation.replace("Home");
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      Alert.alert("로그인 실패", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>로그인</Text>

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
                    placeholder="비밀번호"
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
                {loading ? "로그인 중..." : "로그인"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={handleRegister}
            >
              <Text style={styles.linkText}>계정이 없으신가요? 회원가입</Text>
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
