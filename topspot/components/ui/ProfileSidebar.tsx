import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  Dimensions 
} from 'react-native';
import { X, User, LogOut, Info, Settings, HelpCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@/app/lib/supabase';

const { width } = Dimensions.get('window');

interface ProfileSidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ProfileSidebar({ isVisible, onClose }: ProfileSidebarProps) {
  const [slideAnim] = useState(new Animated.Value(width * 0.75)); // Start from right (positive)

  React.useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0, // Slide to position 0 (visible)
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width * 0.75, // Slide back to right (hidden)
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: width * 0.75, // Slide back to right
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      closeSidebar();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleMenuAction = (action: string) => {
    closeSidebar();
    
    switch (action) {
      case 'signout':
        handleSignOut();
        break;
      // Uncomment when you create these pages
      case 'edit-profile':
        router.push('/pages/EditProfilePage1');
        break;
      // case 'settings':
      //   router.push('/pages/Settings');
      //   break;
      // case 'help':
      //   router.push('/pages/Help');
      //   break;
       case 'about':
         router.push('/pages/AboutPage');
        break;
    }
  };

  const menuItems = [
    { icon: User, label: 'Edit Profile', action: 'edit-profile' },
    { icon: Settings, label: 'Settings', action: 'settings' },
    { icon: HelpCircle, label: 'Help & Support', action: 'help' },
    { icon: Info, label: 'About', action: 'about' },
    { icon: LogOut, label: 'Sign Out', action: 'signout', danger: true },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={closeSidebar}
    >
      <View style={styles.modalContainer}>
        {/* Overlay */}
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={closeSidebar}
        />

        {/* Sidebar - Now on the RIGHT side */}
        <Animated.View 
          style={[
            styles.sidebar,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {/* Header */}
          <View style={styles.sidebarHeader}>
            
            <Text style={styles.headerTitle}>Menu</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuItems}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleMenuAction(item.action)}
                >
                  <Icon 
                    size={22} 
                    color={item.danger ? '#ef4444' : '#fff'} 
                  />
                  <Text style={[
                    styles.menuItemText,
                    item.danger && styles.dangerText
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Version 1.0.0</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute', // Add this
    right: 0, // Position on the right
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#000000ff',
    borderLeftWidth: 1, // Changed from borderRightWidth
    borderLeftColor: '#334155', // Changed from borderRightColor
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  dangerText: {
    color: '#ef4444',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
  },
});