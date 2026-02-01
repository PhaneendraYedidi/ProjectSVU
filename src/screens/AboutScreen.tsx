import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const AboutScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About ProjectSVU</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Logo Area */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>SVU</Text>
                    </View>
                    <Text style={styles.appName}>ProjectSVU</Text>
                    <Text style={styles.version}>Version 1.0.0</Text>
                </View>

                {/* Info Sections */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Mission</Text>
                    <Text style={styles.sectionText}>
                        ProjectSVU aims to revolutionize exam preparation by providing an accessible,
                        intelligent, and engaging platform for students. We believe in learning through
                        practice and data-driven insights.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL('mailto:support@projectsvu.com')}>
                        <Icon name="mail-outline" size={20} color="#AAA" />
                        <Text style={styles.contactText}>support@projectsvu.com</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL('https://projectsvu.com')}>
                        <Icon name="globe-outline" size={20} color="#AAA" />
                        <Text style={styles.contactText}>www.projectsvu.com</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2026 ProjectSVU Inc.</Text>
                    <Text style={styles.footerText}>Made with ❤️ for Students</Text>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: '#1E1E1E',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        transform: [{ rotate: '-10deg' }]
    },
    logoText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    version: {
        color: '#666',
        marginTop: 5,
    },
    section: {
        marginBottom: 30,
        backgroundColor: '#111',
        padding: 20,
        borderRadius: 16,
    },
    sectionTitle: {
        color: '#4CAF50', // Brand color
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionText: {
        color: '#DDD',
        lineHeight: 24,
        fontSize: 15,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    contactText: {
        color: '#FFF',
        marginLeft: 15,
        fontSize: 16,
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#444',
        marginBottom: 5,
    }
});

export default AboutScreen;
