import type React from "react"
import { TouchableOpacity, Text, StyleSheet, type ViewStyle, type TextStyle } from "react-native"

interface ButtonProps {
  title?: string
  onPress: () => void
  disabled?: boolean
  primary?: boolean
  small?: boolean
  ghost?: boolean
  icon?: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
}

export default function Button({
  title,
  onPress,
  disabled = false,
  primary = false,
  small = false,
  ghost = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    primary && styles.primaryButton,
    ghost && styles.ghostButton,
    small && styles.smallButton,
    disabled && styles.disabledButton,
    style,
  ]

  const textStyles = [
    styles.text,
    primary && styles.primaryText,
    ghost && styles.ghostText,
    small && styles.smallText,
    disabled && styles.disabledText,
    textStyle,
  ]

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} disabled={disabled} activeOpacity={0.7}>
      {icon}
      {title && <Text style={textStyles}>{title}</Text>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  primaryButton: {
    backgroundColor: "#0070f3",
    borderColor: "#0070f3",
  },
  ghostButton: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  primaryText: {
    color: "#fff",
  },
  ghostText: {
    color: "#0070f3",
  },
  smallText: {
    fontSize: 14,
  },
  disabledText: {
    color: "#666",
  },
})

