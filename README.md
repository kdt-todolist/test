# 📋 할 일 관리 웹 애플리케이션 (📝 WTD)

![1](https://github.com/user-attachments/assets/4e62eb66-69f5-4cc3-9c42-3074967d0548)

# [🚪 데모 사이트 방문하기](https://what-to-do-chi.vercel.app/)

## 프로젝트 개요 📚

이 프로젝트는 React, Node.js, Express를 사용하여 개발된 할 일 관리 웹 애플리케이션입니다. 사용자는 할 일(📋 Task)과 세부 할 일(🗂 SubTask)을 추가, 수정, 삭제할 수 있으며, 드래그 앤 드롭 기능을 통해 순서를 변경할 수 있습니다.
또한 매일 반복되는 할 일에 대해서는 간단한 루틴 기능을 이용하여 손쉽게 관리할 수 있습니다.

## 주요 기능 🚀

1. **할 일(Task) 관리**
   - 새로운 할 일(➕ Task)을 추가할 수 있습니다.
   - 할 일을 클릭하여 ✍️ 제목을 수정할 수 있으며, 필요시 삭제(🗑)할 수 있습니다.
   - 할 일은 체크박스를 통해 ✅ 대시보드에 노출 상태로 바꿀 수 있습니다.
   - 할 일의 순서는 Task 카드의 상단부를 ↔️ 드래그 앤 드롭하여 쉽게 조정할 수 있습니다.

2. **세부 할 일(SubTask) 관리**
   - 각 할 일(Task) 내에 세부 할 일(🔖 SubTask)을 추가할 수 있습니다.
   - 세부 할 일의 제목을 ✏️ 수정하거나 삭제할 수 있습니다.
   - 세부 할 일의 순서도 ↕️ 드래그 앤 드롭을 통해 조정할 수 있습니다.
   - 완료한 할 일은 체크박스를 통해 완료 상태로 ✅ 변경할 수 있으며, 필요시 삭제(🗑)할 수 있습니다.
   - 완료된 힐 일은 보관함에 보관되며, 🔽토글을 통해 다시 볼 수 있습니다.

3. **루틴 관리**
   - 매일 반복되는 할 일을 루틴으로 추가하여 관리할 수 있습니다.
   - 매일 00시에 할 일의 상태가 초기화 됩니다.
     - ✳ 지나간 할 일은 다시 볼 수 없습니다.

### 📖 사용 방법

- 회원가입 없이도 로컬 스토리지를 이용하여 기본적인 할 일 관리 기능을 사용할 수 있습니다. 사용자는 새로운 할 일을 추가하거나 기존 할 일을 수정, 삭제하면서 자신의 일정을 보다 효율적으로 관리할 수 있습니다.
- 회원가입 후 로그인하여 루틴을 추가하고 관리할 수 있습니다.

## 프로젝트 구조 🏗️

```
/todo-front
  ├── /public        # 정적 파일들이 위치한 폴더
  ├── /src           # 주요 소스 코드가 위치한 폴더
  │     ├── /api     # 백엔드와의 통신을 위한 API 호출  로직이 위치한 폴더
  │     │      ├── api.js
  │     ├── /components        # 재사용 가능한 UI 컴포넌트들이 위치한 폴더
  │     │      ├── /Auth       # 로그인과 회원가입 관련 컴포넌트들이 위치한 폴더
  │     │      │     └── LoginForm.jsx
  │     │      ├── /Common     # 공통적으로 사용되는 컴포넌트들이 위치한 폴더 (버튼, 모달, 입력 필드 등).
  │     │      │     ├── Button.jsx
  │     │      │     ├── InputCheck.jsx
  │     │      │     ├── InputField.jsx
  │     │      │     ├── Modal.jsx
  │     │      │     └── Drawer.jsx
  │     │      ├── /Task      # 할 일 관리와 관련된 컴포넌트들이 위치한 폴더
  │     │      │     ├── TaskCard.jsx
  │     │      │     ├── TaskDashboard.jsx
  │     │      │     └── TaskDrawer.jsx
  │     ├── /contexts        # 전역 상태 관리를 위한 컨텍스트가 위치한 폴더
  │     │     ├── TaskContext.js
  │     ├── /pages           # 각 페이지 컴포넌트들이 위치한 폴더
  │     │     ├── TaskPage.jsx
  │     ├── App.jsx          # 애플리케이션의 루트 컴포넌트
  │     ├── index.js
  │     └── styles.css
  ├── .env
  ├── package.json
  ├── package-lock.json
  └── README.md

```

### 주요 폴더 및 파일 설명 📂

- `/src/components`
  - `Auth`
    - `LoginForm.jsx`: 로그인 폼 컴포넌트.
  - `Common`
    - `Button.jsx`: 버튼 컴포넌트.
    - `InputCheck.jsx`: 공통 입력 체크 컴포넌트.
    - `InputField.jsx`: 공통 입력 필드 컴포넌트.
    - `Modal.jsx`: 공통 모달 컴포넌트.
    - `Drawer.jsx`: 공통 드로어(서랍) 컴포넌트.
  - `Task`
    - `TaskCard.jsx`: 새로운 SubTask를 추가하거나 SubTask 목록을 표시하는 개별 Task 카드 컴포넌트.
    - `TaskDrawer.jsx`: 새로운 Task를 추가하거나 Task 목록을 표시하는 드로어 컴포넌트.
    - `TaskDashboard.jsx`: 전체 Task 대시보드. Task와 SubTask를 Card 형태로 보여준다.
- `/contexts`
  - `TaskContext.js`: Task 상태 관리를 위한 Context.
- `/api`
  - `api.js`: 백엔드와의 HTTP 통신을 담당하는 파일. 이 파일에서는 백엔드 API 호출을 관리하며, 각 컴포넌트에서 공통적으로 사용할 수 있도록 API 함수를 정의.

    `예`: Task 추가, 삭제, 수정 등의 API 호출 함수 (axios나 fetch를 사용).
- `/src/App.jsx` 및 `/src/index.js`
  - `App.jsx`: 최상위 앱 컴포넌트로 전체 라우팅을 담당하며, 주요 컴포넌트들을 구성합니다.
  - `index.js`: 애플리케이션의 진입 파일로, ReactDOM.render를 사용해 앱을 렌더링합니다.

### 프로젝트 요구 사항 ⚙️

- **Node.js (v14 이상)**: 애플리케이션을 실행하기 위한 자바스크립트 런타임 환경입니다.
- **npm**: 패키지 관리를 위한 도구입니다.

### 설치 및 실행 방법 💻

1. **프로젝트 클론**
   ```bash
   git clone `https://github.com/kdt-todolist/todo-front.git)`
   cd todo-front
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   - `.env` 파일을 생성하고 백엔드 API URL 등을 설정합니다.

4. **개발 서버 실행**
   ```bash
   npm start
   ```
   - 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 사용된 기술 스택 🛠️

- **프론트엔드**: React, JavaScript, Tailwind CSS
- **상태 관리**: React Context API
- **드래그 앤 드롭**: react-beautiful-dnd
- **백엔드 통신**: Axios

## 팀원 및 역할 👥

### 김정현 🔗 [CodingKirby](https://github.com/CodingKirby)
- Readme.md 작성
- **백엔드 연동 및 API 관리**
 - Axios를 사용한 백엔드와의 통신 기능 개발 및 Context를 통해 상태 관리, API 통신 오류 처리 및 데이터 유지 관리.
### 윤혜원 🔗 [hyenee99](https://github.com/hyenee99)
- **Task 관리 컴포넌트 개발**
 - 할 일(Task) 및 세부 할 일(SubTask) UI와 관련된 작업, 사용자가 쉽게 할 일을 추가하고 수정할 수 있는 기능 개발.
### 김재영 🔗 [jae-yon](https://github.com/jae-yon)
- Figma 작성 및 UI 디자인
- **공통 컴포넌트 개발**
 - 로그인/회원가입 모달 및 버튼, 입력 필드 등 공통 UI 컴포넌트 개발.
### 김바울 🔗 [freepaul-kor](https://github.com/freepaul-kor)
- **컴포넌트 배치 및 드래그 앤 드롭 기능 구현**
 - 각 컴포넌트 배치와 `react-beautiful-dnd`를 사용해 Task 및 SubTask의 순서 변경 기능 개발, 드래그 앤 드롭 UX 최적화.
