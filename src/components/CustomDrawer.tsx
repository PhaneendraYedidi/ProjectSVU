import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    interpolate,
    runOnJS,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuthStore } from '../auth/auth.store';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

interface CustomDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const MENU_ITEMS = [
    { label: 'Profile', icon: 'person-outline', route: 'Profile' },
    { label: 'Dashboard', icon: 'stats-chart-outline', route: 'Dashboard' },
    { label: 'Practice', icon: 'school-outline', route: 'Practice' },
    { label: 'Challenges', icon: 'trophy-outline', route: 'Challenges' },
    { label: 'Mock Tests', icon: 'clipboard-outline', route: 'MockTestList' },
    { label: 'Bookmarks', icon: 'bookmark-outline', route: 'Bookmarks' },
    { label: 'Referral', icon: 'people-outline', route: 'Referral' },
    { label: 'About', icon: 'information-circle-outline', route: 'About' },
];

const CustomDrawer: React.FC<CustomDrawerProps> = ({ isOpen, onClose }) => {
    const translateX = useSharedValue(-DRAWER_WIDTH);
    const opacity = useSharedValue(0);
    const navigation = useNavigation<any>();
    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
        if (isOpen) {
            translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
            opacity.value = withTiming(0.5);
        } else {
            translateX.value = withTiming(-DRAWER_WIDTH, { duration: 300 });
            opacity.value = withTiming(0);
        }
    }, [isOpen]);

    const drawerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const backdropStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const handleNavigation = (route: string) => {
        // if (route === 'MockTest') {
        //     // Special handling if needed?
        // }
        navigation.navigate(route);
        onClose();
    };

    const handleLogout = () => {
        logout();
        onClose();
    };

    if (!isOpen && translateX.value === -DRAWER_WIDTH) {
        // optimization: render nothing if completely closed? 
        // Actually better to keep mounted for animation, but could use zIndex
    }

    return (
        <View style={[styles.container, !isOpen ? { pointerEvents: 'none' } : {}]}>
            {/* Backdrop */}
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View style={[styles.backdrop, backdropStyle]} />
            </TouchableWithoutFeedback>

            {/* Drawer Content */}
            <Animated.View style={[styles.drawer, drawerStyle]}>
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
                    </View>
                    <Text style={styles.username}>{user?.name || 'Guest User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'Sign in to sync'}</Text>
                </View>

                <View style={styles.menuContainer}>
                    {MENU_ITEMS.map((item) => (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.menuItem}
                            onPress={() => handleNavigation(item.route)}
                        >
                            <Icon name={item.icon} size={24} color="#FFF" style={styles.menuIcon} />
                            <Text style={styles.menuLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <Icon name="log-out-outline" size={24} color="#FF5252" style={styles.menuIcon} />
                        <Text style={[styles.menuLabel, { color: '#FF5252' }]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        elevation: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    drawer: {
        width: DRAWER_WIDTH,
        height: '100%',
        backgroundColor: '#1E1E1E',
        position: 'absolute',
        left: 0,
        top: 0,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 20,
    },
    header: {
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#2C2C2C',
        borderTopRightRadius: 20,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#AAA',
    },
    menuContainer: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        marginBottom: 4,
        borderRadius: 8,
    },
    menuIcon: {
        marginRight: 16,
    },
    menuLabel: {
        fontSize: 16,
        color: '#EEE',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 16,
    },
});

export default CustomDrawer;
