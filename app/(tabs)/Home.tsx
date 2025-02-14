import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Text, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import new components
import {FormField, CarbonEmissionsChart, EcoActionsCarousel, TodayMetrics, EcoScoreDisplay } from '../../components'
import TestChart from '@/components/TestChart';


const API_ENDPOINT = 'https://67adf6af9e85da2f020be41b.mockapi.io/api/v1/emissionData';

// --- Mock Action Cards (Keep these as they are) ---
const mockActionCards = [
    {
        title: 'Carpool Tomorrow',
        description: 'Save 5kg CO₂',
        icon: 'car',
        actionText: 'Log it!',
        onAction: () => Alert.alert('Action!', 'Log Carpooling action'),
    },
    {
        title: 'Turn Off Lights',
        description: 'Save 2kg CO₂/week',
        icon: 'lightbulb',
        actionText: 'Set Reminder',
        onAction: () => Alert.alert('Action!', 'Set Reminder for lights'),
    },
    {
        title: 'Try Thrift Stores',
        description: 'Reduce fast fashion impact',
        icon: 'shopping',
        actionText: 'Find Stores',
        onAction: () => Alert.alert('Action!', 'Open Thrift Store finder (placeholder)'),
    },
];
const mockCO2Saved = 25; // Keep mock CO2 Saved


const HomeScreen = () => {
    const [emissionData, setEmissionData] = useState([]);
    const [ecoScore, setEcoScore] = useState(0);
    const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });
    const [todayEmissions, setTodayEmissions] = useState(0);
    const [todayTrend, setTodayTrend] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(API_ENDPOINT);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                setEmissionData(jsonData);
                transformEmissionData(jsonData); // Process and set other states
            } catch (error) {
                console.error("Fetching emission data failed:", error);
                Alert.alert("Error", "Failed to load emission data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const transformEmissionData = (apiData) => {
        if (!apiData || apiData.length === 0) {
            return; // Handle empty data case
        }

        const last7DaysData = apiData.slice(0, 7); // Take only the first 7 days as per API data order
        const labels = last7DaysData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue", etc.
        }).reverse(); // Reverse to get chronological order (Mon to Sun)
        const datasetData = last7DaysData.map(item => item.emission_amount).reverse(); // Reverse emission data too

        // Calculate Eco Score (example: average emission, inverted and scaled)
        const averageEmission = datasetData.reduce((sum, value) => sum + value, 0) / datasetData.length;
        const calculatedEcoScore = Math.max(0, Math.min(100, 150 - averageEmission)); // Example scoring logic
        setEcoScore(Math.round(calculatedEcoScore));

        // Prepare chart data
        setChartData({
            labels: labels,
            datasets: [
                {
                    data: datasetData,
                    barColors: datasetData.map((_, index) => index === 6 ? '#10a326' : '#26A69A'), // Highlight today (last bar in reversed array)
                },
            ],
        });

        // Set Today's Emissions and Trend
        const todayEmissionAmount = last7DaysData[0].emission_amount; // API data is already sorted by date desc
        setTodayEmissions(todayEmissionAmount);

        if (last7DaysData.length > 1) {
            const yesterdayEmission = last7DaysData[1].emission_amount;
            const trendPercentage = ((todayEmissionAmount - yesterdayEmission) / yesterdayEmission) * 100;
            if (Math.abs(trendPercentage) < 0.01) {
                setTodayTrend('→ 0%'); // No significant change
            } else if (trendPercentage < 0) {
                setTodayTrend(`(${Math.abs(trendPercentage).toFixed(0)}% ↓)`); // Decrease
            } else {
                setTodayTrend(`(${trendPercentage.toFixed(0)}% ↑)`); // Increase
            }
        } else {
            setTodayTrend('No comparison data'); // For the very first day
        }
    };


    if (loading) {
        return (
            <View className="flex-1 bg-green-50 justify-center items-center">
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text className="mt-2 text-green-800 font-pregular">Loading Data...</Text>
            </View>
        );
    }


    return (
        <SafeAreaView className='h-full'>
            <ScrollView className="flex-1 bg-white pt-5 text-[#06d6a0]">
                {/* 1. Eco Score Section */}
                <EcoScoreDisplay ecoScore={ecoScore} />
    
                {/* 2. 7-Day Carbon Chart */}
                <CarbonEmissionsChart chartData={chartData} />
                {/* <TestChart/> */}
    
                {/* 3. Action Cards Section */}
                <EcoActionsCarousel actionCards={mockActionCards} />
    
                {/* 4. Bottom Metrics Section */}
                <TodayMetrics todayEmissions={todayEmissions} todayTrend={todayTrend} co2Saved={mockCO2Saved} />
    
    
                {/* Floating Action Button */}
                <TouchableOpacity className="absolute bottom-5 right-5 bg-green-500 rounded-full w-14 h-14 justify-center items-center shadow-md" onPress={() => Alert.alert('Action', 'Log new activity (placeholder)')}>
                <MaterialCommunityIcons name="plus" size={30} color="white" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};


export default HomeScreen;