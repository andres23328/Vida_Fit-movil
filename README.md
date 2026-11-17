# 📱 Vida Fit Pro — Aplicación Móvil de Gestión Fitness con IA y Machine Learning

![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-52-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.3-764ABC?logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase&logoColor=black)
![Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-1.5_Pro-4285F4?logo=googlegemini&logoColor=white)

Aplicación móvil multiplataforma (**Android / iOS**) desarrollada con **React Native, Expo y TypeScript**, respaldada por un servidor **Node.js / Express**. Integra seguimiento biométrico, analítica gráfica de progreso, gestión de membresías con facturación PDF y códigos QR, chatbot de soporte entrenable, recomendaciones nutricionales con **Google Gemini AI** y rutinas personalizadas mediante **Machine Learning (K-Means y Random Forest)**.

---

## ✨ Características Principales

- **Onboarding Biométrico y Personalización (18 pasos):** Flujo guiado que recopila objetivos físicos, género, lugar de entrenamiento, historial de ejercicio, intensidad, horarios preferidos y métricas corporales mediante estado global en **Redux Toolkit**.
- **Analítica de Rendimiento y Gráficas Interactivas:** Visualización de evolución de peso corporal, récords personales, distribución muscular y tiempos de entrenamiento utilizando **React Native Skia** y componentes gráficos personalizados.
- **Motor de Recomendación con Machine Learning:** Agrupamiento de perfiles de usuario mediante **K-Means** (`ml-kmeans`) y clasificación con **Random Forest** (`ml-random-forest`) sobre el dataset `megaGymDataset.csv` para sugerir ejercicios adaptados.
- **Asistente Nutricional con Google Gemini AI:** Endpoint dedicado (`/comida-bebidas`) conectado a la API `@google/generative-ai` (`gemini-1.5-pro`) que genera recomendaciones saludables según preferencias y restricciones alimentarias.
- **Chatbot Híbrido con Aprendizaje Dinámico:** Módulo de conversación (`/chat`) con procesamiento de lenguaje natural (`natural`, `compromise`, `sentiment`) capaz de aprender nuevas respuestas mediante comandos (`aprender|`).
- **Gestión de Membresías y Facturación Automatizada:** Generación de facturas en PDF (`PDFKit`) con código QR único (`qrcode`) y envío automático al correo del cliente mediante `Nodemailer`.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnologías |
| :--- | :--- |
| **App Móvil** | React Native, Expo SDK 52, TypeScript, React Navigation (Stack, Drawer, Bottom Tabs), React Native Paper, React Native Skia |
| **Gestión de Estado** | Redux Toolkit (14 slices modulares) & Context API (Auth y Dark Mode) |
| **Autenticación y Nube** | Firebase Authentication, Google Sign-In, Cloud Firestore |
| **Backend & IA** | Node.js, Express.js, `@google/generative-ai`, `ml-kmeans`, `ml-random-forest`, `natural`, `compromise` |
| **Documentos y Correo** | PDFKit, QRCode, Nodemailer, csvtojson |

---

## 📁 Estructura del Proyecto

```text
Vida_Fit-movil/
├── App.tsx                      # Navegación raíz, temas MD3 (Claro/Oscuro) y estado de sesión
├── android/                     # Proyecto nativo Android (com.andres23328.vidafit)
├── src/
│   ├── components/              # Navegadores (BottomTab, Drawer), PerformanceChart, Predicts y UI
│   ├── config/                  # Configuración de Firebase
│   ├── context/                 # AuthContext y DarkModeContext
│   ├── global/
│   │   ├── Slice/               # Slices de Redux (goals, userInfo, membresia, weeklySchedule, etc.)
│   │   ├── services/            # Servicios de autenticación y Firestore
│   │   └── store.ts             # Store centralizado de Redux Toolkit
│   └── screens/
│       ├── inicio_screen/       # Flujo de onboarding de 18 pantallas
│       ├── screen_login/        # HomeScreen, DashboardScreen, ClassesScreen, ProgressScreen
│       ├── graficas/            # ProgresoPeso, Records, Distribucion, TiempoEntrenamiento
│       └── sub-screens/         # Gemini, Predict, IMCScreen, MembershipScreen, Calendar, Chat
└── backend/
    ├── csv/                     # Datasets de usuarios y ejercicios (megaGymDataset.csv)
    ├── models/
    │   ├── kmeansModel.js       # Modelo K-Means + Random Forest para predicción de rutinas
    │   ├── geminis.js           # Integración con Google Gemini AI para nutrición
    │   └── chat.js              # Chatbot NLP con persistencia JSON
    └── server.js                # Servidor Express, generación de facturas PDF/QR y envío de emails
```

---

## 🚀 Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/andres23328/Vida_Fit-movil.git
cd Vida_Fit-movil
```

### 2. Configurar e iniciar el Backend
```bash
cd backend
npm install
```
Crea un archivo `.env` dentro de `backend/` con las siguientes variables:
```env
PORT=3000
GEMINI_API_KEYS=tu_api_key_de_google_gemini
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contrasena_de_aplicacion
```
Ejecuta el servidor:
```bash
npm start
```

### 3. Instalar dependencias e iniciar la App Móvil
Desde la raíz del proyecto (`Vida_Fit-movil/`):
```bash
npm install expo
npm install --legacy-peer-deps
npx expo start --dev-client
```
*(También puedes compilar en Android nativo con `npm run android` o previsualizar en web con `npm run web`).*

---

## 👤 Autor

**Andrés Felipe Ardila Ardila**  
Desarrollador Fullstack & Estudiante de Ingeniería de Sistemas — Villavicencio, Meta, Colombia  
- GitHub: [@andres23328](https://github.com/andres23328)
- Correo: ardila23328@gmail.com
