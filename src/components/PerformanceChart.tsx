import { StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      data: [40, 30, 20, 27, 18, 23, 34],
      color: (opacity = 1) => `rgba(0, 112, 243, ${opacity})`,
      strokeWidth: 2,
    },
    {
      data: [24, 13, 98, 39, 48, 38, 43],
      color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
      strokeWidth: 2,
    },
    {
      data: [18, 20, 22, 25, 23, 28, 24],
      color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
      strokeWidth: 2,
    },
  ],
  legend: ["Engagement", "Conversion", "Retention"],
}

export default function PerformanceChart() {
  const screenWidth = Dimensions.get("window").width - 64 // Accounting for padding

  return (
    <LineChart
      data={data}
      width={screenWidth}
      height={220}
      chartConfig={{
        backgroundColor: "#fff",
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "3",
          strokeWidth: "1",
        },
      }}
      bezier
      style={styles.chart}
      legend={data.legend}
    />
  )
}

const styles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
})

