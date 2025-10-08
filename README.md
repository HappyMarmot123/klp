# Klp 앱 MVP

Expo, React Native, Firebase를 사용한 모던한 커뮤니티 앱입니다.

## 📱 프로젝트 개요

Klp는 사용자들이 자유롭게 글을 작성하고 소통할 수 있는 커뮤니티 플랫폼입니다.
아름다운 그라데이션 배경과 부드러운 애니메이션으로 사용자 경험을 향상시킨 모바일 앱입니다.

## ✨ 주요 기능

- **사용자 인증**: Firebase Auth를 통한 이메일/비밀번호 로그인 및 회원가입
- **게시글 관리**: 글 작성, 조회, 수정, 삭제 기능
- **이미지 업로드**: 게시글에 여러 이미지 첨부 가능
- **댓글 시스템**: 게시글에 댓글 작성 및 조회
- **페이지네이션**: 효율적인 게시글 목록 관리
- **실시간 새로고침**: Pull-to-refresh 기능
- **반응형 UI**: 다양한 화면 크기에 최적화된 디자인

## 🛠 기술 스택

### Frontend

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Yup
- **Animation**: React Native Reanimated
- **UI Components**: Custom animated components

### Backend & Services

- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Real-time**: Firestore real-time listeners

### Development Tools

- **Package Manager**: npm
- **Build Tool**: Expo CLI
- **Code Quality**: TypeScript strict mode

## 📁 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   └── CommentSection.tsx
├── presentation/         # UI 프레젠테이션 레이어
│   └── components/
│       ├── layout/       # 레이아웃 컴포넌트
│       │   ├── GradientBackground.tsx
│       │   ├── ImageCarousel.tsx
│       │   └── ImageModal.tsx
│       └── ui/           # UI 컴포넌트
│           ├── AnimatedButton.tsx
│           ├── AnimatedListItem.tsx
│           ├── AnimatedLoadingSpinner.tsx
│           ├── AnimatedModal.tsx
│           └── AnimatedView.tsx
├── screens/              # 화면 컴포넌트
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── PostDetailScreen.tsx
│   └── CreatePostScreen.tsx
├── services/             # 비즈니스 로직 및 API
│   ├── authService.ts
│   ├── imageService.ts
│   └── postService.ts
├── shared/               # 공유 유틸리티
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── validationSchemas.ts
└── types/                # 타입 정의
    └── index.ts
```

## 📱 주요 화면

### 1. 로그인/회원가입

- Firebase Auth를 통한 이메일 인증
- 폼 유효성 검사 (Yup 스키마)
- 그라데이션 배경과 애니메이션 효과

### 2. 홈 화면

- 게시글 목록 표시
- 페이지네이션 지원
- Pull-to-refresh 기능
- 글쓰기 및 로그아웃 버튼

### 3. 게시글 작성

- 제목, 내용 입력
- 이미지 다중 업로드
- Firebase Storage 연동

### 4. 게시글 상세

- 전체 내용 표시
- 댓글 시스템
- 이미지 캐러셀

## 🎨 디자인 특징

- **그라데이션 배경**: 아름다운 색상 그라데이션
- **글래스모피즘**: 반투명 효과와 블러 처리
- **부드러운 애니메이션**: React Native Reanimated 활용
- **다크 테마**: 눈에 편한 다크 모드 디자인
- **반응형 레이아웃**: 다양한 화면 크기 지원
