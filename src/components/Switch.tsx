"use client"

import React from "react"
import { View, StyleSheet, Animated, TouchableWithoutFeedback } from "react-native"

interface SwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
}

export default function Switch({ value, onValueChange, disabled = false }: SwitchProps) {
  const translateX = React.useRef(new Animated.Value(value ? 20 : 0)).current

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 20 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [value, translateX])

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress} disabled={disabled}>
      <View style={[styles.container, value ? styles.containerOn : styles.containerOff, disabled && styles.disabled]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 5,
  },
  containerOn: {
    backgroundColor: "#0070f3",
  },
  containerOff: {
    backgroundColor: "#ddd",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
})

