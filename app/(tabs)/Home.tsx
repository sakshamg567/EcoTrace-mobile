import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Or 'react-native-vector-icons/MaterialCommunityIcons'
import { StatusBar } from 'expo-status-bar';

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

const screenWidth = Dimensions.get('window').width;

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
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={{ marginTop: 10, color: '#2E7D32', fontFamily: 'Poppins-Regular' }}>Loading Data...</Text>
            </View>
        );
    }


    return (
        <ScrollView style={styles.container}>
          <StatusBar style='dark'/>
            {/* 1. Eco Score Section */}
            <View style={styles.ecoScoreSection}>
                <View style={styles.ecoScoreCircle}>
                    <Text style={styles.ecoScoreNumber}>{ecoScore}</Text>
                    <View style={[styles.ecoScoreProgress, { width: `${ecoScore}%` }]} />
                </View>
                <Text style={styles.ecoScoreSubtext}>Your Eco Score (Past 7 Days): {ecoScore}/100 🌟</Text>
            </View>

            {/* 2. 7-Day Carbon Chart */}
            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>7-Day Carbon Emissions (kg CO₂e)</Text>
                <BarChart
                    data={chartData}
                    width={screenWidth - 40} // Adjust chart width as needed
                    height={220}
                    yAxisSuffix="kg"
                    yAxisInterval={3} // Optional, adjust interval as needed
                    chartConfig={styles.chartConfig}
                    bezier // Optional, smooth bar edges
                    style={styles.barChartStyle}
                    onDataPointClick={(value) => {
                        const dayLabel = chartData.labels[value.index];
                        const emission = chartData.datasets[0].data[value.index];
                        Alert.alert('Daily Emissions', `${dayLabel}: ${emission}kg CO₂e`);
                    }}
                />
            </View>

            {/* 3. Action Cards Section */}
            <View style={styles.actionsSection}>
                <Text style={styles.sectionTitle}>Eco Actions</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {mockActionCards.map((card, index) => (
                        <ActionCard key={index} card={card} />
                    ))}
                </ScrollView>
            </View>

            {/* 4. Bottom Metrics Section */}
            <View style={styles.metricsSection}>
                <View style={styles.todayTotalContainer}>
                    <Text style={styles.todayTotalText}>Today's Total: {todayEmissions} kg CO₂e</Text>
                    <Text style={[styles.todayTrendText, todayTrend.includes('↓') || todayTrend.includes('0') ? styles.trendPositive : styles.trendNegative]}>
                        {todayTrend} from yesterday
                    </Text>
                </View>
                <Text style={styles.co2SavedText}>You've Saved {mockCO2Saved} kg CO₂ 🌱</Text>
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fab} onPress={() => Alert.alert('Action', 'Log new activity (placeholder)')}>
                <MaterialCommunityIcons name="plus" size={30} color="white" />
            </TouchableOpacity>
        </ScrollView>
    );
};

// ActionCard Component (No changes needed here)
const ActionCard = ({ card }) => (
    <View style={styles.actionCard}>
        <View style={styles.cardIconContainer}>
            <MaterialCommunityIcons name={card.icon} size={35} color={styles.actionCard.color} />
        </View>
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.cardDescription}>{card.description}</Text>
        <TouchableOpacity style={styles.cardActionButton} onPress={card.onAction}>
            <Text style={styles.cardActionText}>{card.actionText}</Text>
        </TouchableOpacity>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0fdf4', // Very Light Green Background
        paddingVertical: 20,
    },
    ecoScoreSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    ecoScoreCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 10,
        borderColor: '#ddd', // Light gray border
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    ecoScoreProgress: {
        position: 'absolute',
        left: -10,
        top: -10,
        width: '75%', // Will be dynamically set based on score
        height: '100%',
        borderRadius: 75,
        borderWidth: 10,
        borderColor: '#10a326', // Green progress color
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
    },

    ecoScoreNumber: {
        fontSize: 48,
        fontFamily: 'Poppins-Bold', // Ensure you have this font loaded
        color: '#2E7D32', // Deep Green
    },
    ecoScoreSubtext: {
        marginTop: 10,
        fontSize: 16,
        color: '#2E7D32',
        fontFamily: 'Poppins-Regular',
    },
    chartSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        color: '#2E7D32',
        marginBottom: 15,
    },
    barChartStyle: {
        borderRadius: 16,
    },
    chartConfig: {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0, // Show emissions as whole numbers for simplicity
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.6,
        useShadowColorFromDataset: false, // optional
    },
    actionsSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    actionCard: {
        backgroundColor: '#ffffff',
        width: 160,
        padding: 15,
        borderRadius: 12,
        marginRight: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardIconContainer: {
        backgroundColor: '#f0fdf4', // Light Green Icon Background
        padding: 10,
        borderRadius: 30,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        color: '#2E7D32',
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        textAlign: 'center',
        color: 'gray',
        marginBottom: 10,
    },
    cardActionButton: {
        backgroundColor: '#26A69A', // Teal Button
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    cardActionText: {
        color: 'white',
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
    metricsSection: {
        paddingHorizontal: 20,
        marginBottom: 80, // Make space for FAB
    },
    todayTotalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    todayTotalText: {
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
        color: '#2E7D32',
    },
    todayTrendText: {
        fontSize: 14,
        marginLeft: 8,
        fontFamily: 'Poppins-Regular',
    },
    trendPositive: {
        color: '#10a326', // Green for positive trend (decrease)
    },
    trendNegative: {
        color: '#FF6F61', // Coral for negative trend (increase)
    },
    co2SavedText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#2E7D32',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#10a326', // Primary Green FAB color
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default HomeScreen;