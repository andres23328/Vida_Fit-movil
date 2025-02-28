import React, { Component, ReactNode } from 'react';
import { Text } from 'react-native';  // Asegúrate de importar Text desde react-native

interface State {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { hasError: false };

  // Tipos explícitos para los parámetros error y errorInfo
  static getDerivedStateFromError(error: Error): State {
    // Puedes modificar el estado para mostrar un mensaje de error
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Aquí se registra el error, puedes hacer algo con esta información también
    console.error('Error caught in ErrorBoundary: ', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Error occurred while rendering!</Text>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
