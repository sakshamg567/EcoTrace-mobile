import React from 'react';
import { View, Text, Alert, Vibration, useWindowDimensions, StyleSheet } from 'react-native';
import { Grid, YAxis, XAxis, LineChart } from 'react-native-svg-charts';
import { Text as SvgText, Path, Circle, Line } from 'react-native-svg';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';

interface CarbonEmissionsChartProps {
   chartData: any; // Replace with a more specific type if possible
}

const CarbonEmissionsChart: React.FC<CarbonEmissionsChartProps> = ({ chartData }) => {
   const { width: screenWidth, height: screenHeight } = useWindowDimensions(); // Get screen dimensions

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
   const xData = data.map((_, index) => index);
   
   // Line Chart Decorator (for points and labels)
   const LineDecorator = ({ x, y, data }) => {
      return data.map((value, index) => (
         <React.Fragment key={index}>
            <Circle
               cx={x(index)}
               cy={y(value)}
               r={4}
               stroke={'rgb(6, 214, 160)'}
               fill={'white'}
            />
            <SvgText
               x={x(index)}
               y={y(value) - 15}
               fontSize={10}
               fontFamily="Poppins-Regular"
               fill="rgb(4, 133, 99)"
               alignmentBaseline={'bottom'}
               textAnchor={'middle'}
            >
               {value}
            </SvgText>
         </React.Fragment>
      ));
   };

   // Vertical Grid Lines (Custom Component)
   const VerticalGrid = ({ x, height, ticks }) => {
      return ticks.map((tick, index) => (
         <Line
            key={index}
            x1={x(index)}
            x2={x(index)}
            y1={0}
            y2={height}  // Use the passed height
            stroke={'rgba(0, 0, 0, 0.1)'}
            // strokeDasharray={[4, 4]}
         />
      ));
   };

   // Calculate chart height based on screen height (responsive)
   const chartHeight = screenHeight * 0.3; // Example: 30% of screen height

   return (
      <View className="px-5 mb-8">
         <Text className="text-lg font-pmedium text-green-900 mb-3">
            Weekly Carbon Emissions
         </Text>
         <View className="bg-white rounded-2xl py-3 shadow-md border border-gray-100">
            {/* Main Chart Container */}
            <View style={{ height: chartHeight, flexDirection: 'row' }}>
               <YAxis
                  data={data}
                  contentInset={{ top: 30, bottom: 30, left: 10, right: 10 }}
                  svg={{
                     fill: 'rgba(55, 65, 81, 1)',
                     fontSize: 12,
                     fontFamily: 'Poppins-Regular',
                  }}
                  numberOfTicks={4}
                  formatLabel={(value) => `${value}kg`}
                  min={0}
               />
               <View style={{ flex: 1, marginLeft: 0 }}>
                  <LineChart
                     style={StyleSheet.absoluteFillObject} // Use StyleSheet.absoluteFillObject directly
                     data={data}
                     yAccessor={({ item }) => item}
                     xAccessor={({ index }) => index}
                     contentInset={{ top: 30, bottom: 30, right: 20, left: 10 }}
                     svg={{
                        stroke: 'rgb(6, 214, 160)',
                        strokeWidth: 2,
                     }}
                     curve={shape.curveNatural}
                     yMin={0}
                  >
                     <Grid belowChart={true} svg={{
                        stroke: 'rgba(0, 0, 0, 0.1)',
                        strokeDasharray: [4, 4],
                        
                           
                        }} 
                     />
                     <VerticalGrid ticks={data} height={chartHeight - 80} /* Pass height to VerticalGrid */ />
                     <LineDecorator />
                  </LineChart>
               </View>
            </View>
            <XAxis
               style={{ marginHorizontal: -20, height: 30 }}
               data={xData}
               formatLabel={(_, index) => labels[index]}
               contentInset={{ left: 40, right: 35 }}
               svg={{ 
                  fontSize: 12,
                  fill: 'black',
                  fontFamily: 'Poppins-Regular',
                  textAnchor: 'start',
                  y: 12
               }}
               scale={scale.scaleBand}
            />
         </View>
      </View>
   );
};

export default CarbonEmissionsChart;