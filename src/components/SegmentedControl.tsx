import { View, Text, StyleSheet, TouchableOpacity, type ViewStyle } from "react-native"

interface SegmentedControlProps {
  values: string[]
  selectedIndex: number
  onChange: (index: number) => void
  style?: ViewStyle
}

export function SegmentedControl({ values, selectedIndex, onChange, style }: SegmentedControlProps) {
  return (
    <View style={[styles.container, style]}>
      {values.map((value, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.segment,
            index === 0 && styles.firstSegment,
            index === values.length - 1 && styles.lastSegment,
            selectedIndex === index && styles.selectedSegment,
          ]}
          onPress={() => onChange(index)}
          activeOpacity={0.7}
        >
          <Text style={[styles.segmentText, selectedIndex === index && styles.selectedSegmentText]}>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  firstSegment: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  lastSegment: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  selectedSegment: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  selectedSegmentText: {
    color: "#111",
  },
})

