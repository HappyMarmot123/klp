import * as yup from "yup";

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .required("이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다")
    .max(100, "이메일은 최대 100자까지 입력 가능합니다"),

  password: yup
    .string()
    .required("비밀번호를 입력해주세요")
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .max(50, "비밀번호는 최대 50자까지 입력 가능합니다")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])/,
      "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다"
    ),

  confirmPassword: yup
    .string()
    .required("비밀번호 확인을 입력해주세요")
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다"),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),

  password: yup
    .string()
    .required("비밀번호를 입력해주세요")
    .min(1, "비밀번호를 입력해주세요"),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
