import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

interface RadioButtonProps {
  selected: boolean
  onSelect: () => void
  label: string
  value: string
}

export default function RadioButton({ selected, onSelect, label, value }: RadioButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onSelect} activeOpacity={0.7}>
      <View style={styles.radio}>{selected && <View style={styles.selected} />}</View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#0070f3",
  },
  label: {
    fontSize: 14,
    color: "#111",
  },
})

