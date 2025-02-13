import React from 'react';
import { View, Text, Alert, Vibration, useWindowDimensions } from 'react-native';
import { BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import { Text as SvgText } from 'react-native-svg'; // Import Text from react-native-svg
import * as scale from 'd3-scale'; // Import d3-scale for XAxis

interface CarbonEmissionsChartProps {
   chartData: any; // Replace with a more specific type if possible
}

const CarbonEmissionsChart: React.FC<CarbonEmissionsChartProps> = ({ chartData }) => {
   const { width: screenWidth } = useWindowDimensions();

   if (!chartData || !chartData.datasets || chartData.datasets.length === 0 || !chartData.labels) {
      return (
         <View className="px-5 mb-8">
            <Text className="text-xl font-semibold text-green-900 mb-3">
               Weekly Carbon Emissions
            </Text>
            <View className="bg-white rounded-2xl py-3 shadow-md border border-gray-100 h-64 justify-center items-center">
               <Text className="text-gray-500">No data to display</Text>
            </View>
         </View>
      );
   }

   const data = chartData.datasets[0].data;
   const labels = chartData.labels;
   const CUT_OFF = Math.max(...data) * 0.2; // Dynamic cutoff for spacing
   const BarChartExample = () => {

      const Labels = ({ x, y, bandwidth, data }) => (
         data.map((value, index) => (
            <SvgText
               key={index}
               x={x(index) + (bandwidth / 2)}
               y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
               fontSize={12}
               fontFamily="Poppins-Medium"
               fill={value >= CUT_OFF ? 'white' : 'black'}
               alignmentBaseline={'middle'}
               textAnchor={'middle'}
            >
               {value}
            </SvgText>
         ))
      )
      return (
         <BarChart
            style={{ flex: 1, marginLeft: 10 }}
            data={data}
            gridMin={0}
            svg={{
               fill: 'rgba(52, 211, 16, 0.8)',
               rx: '5px'
            }} // Vibrant green for bars
            contentInset={{ top: 20, bottom: 10, right: 20 }} // Adjust insets
         >
            <Grid />
            <Labels />
         </BarChart>
      )
   }

   return (
      <View className="px-5 mb-8">
         <Text className="text-xl font-semibold text-green-900 mb-3">
            Weekly Carbon Emissions
         </Text>
         <View className="bg-white rounded-2xl py-3 shadow-md border border-gray-100" style={{ overflow: "visible" }}>
            {/* Main Chart Container */}
            <View style={{ height: 260, flexDirection: 'row', paddingRight: 5, paddingLeft: 5 }}>
               <YAxis
                  data={data}
                  contentInset={{ top: 20, bottom: 10 }}
                  svg={{
                     fill: 'rgba(55, 65, 81, 1)', // Darker gray for labels
                     fontSize: 12,
                     fontFamily: 'Poppins-Regular',
                  }}
                  numberOfTicks={4} // Control the number of ticks/labels on Y-axis
                  formatLabel={(value) => `${value}kg`} // Format Y-axis labels
                  min={0}
               />
               <BarChartExample />
            </View>
            <XAxis
               style={{ marginHorizontal: 5, height: 30 }}
               data={data}
               formatLabel={(_, index) => labels[index]}
               contentInset={{ left: 10, right: 10 }}
               svg={{ fontSize: 12, fill: 'black', fontFamily: 'Poppins-Regular' }}
               scale={scale.scaleBand}
            />
         </View>
      </View>
   );
};

export default CarbonEmissionsChart;