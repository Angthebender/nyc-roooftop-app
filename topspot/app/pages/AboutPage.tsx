import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router,Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function About() {
  const theme = Colors.dark;
  const profileImg = require('@/assets/images/angthebender.png');
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/Profile')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          About
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            source={profileImg } // Replace with your actual image
            style={styles.profileImage}
          />
        </View>

        {/* Story */}
        <View style={styles.storyContainer}>
          <Text style={[styles.storyText, { color: theme.text }]}>
            Hey — I'm <Text style={styles.highlight}>Norden Sherpa</Text> an upcoming developer. This project started as a small side idea, but along the way it taught me more than I ever expected. Every bug, every mistake, 
            and every little success helped me grow not just as a developer, but as a problem-solver.
          </Text>
          <Text style={[styles.storyText, { color: theme.text }]}>
            This app is made to help people find and discover rooftops in New York City easily.
          </Text>
          <Text style={[styles.storyText, { color: theme.text }]}>
            I built it because good rooftops are hard to find — some are hidden, some are inside hotels, and some are only known by locals.
          </Text>
          <Text style={[styles.storyText, { color: theme.text }]}>
            I wanted one simple place where anyone can see which rooftops are worth visiting, what kind of vibe they have, and what to expect before going.
          </Text>
            
          <Text style={[styles.storyText, { color: theme.text }]}>
            This app is about making rooftop exploring easier, so you can spend less time searching and more time enjoying the view.
          </Text>
            
          

          {/* <Text style={[styles.storyText, { color: theme.text }]}>
            All ratings and reviews come from people who’ve actually been there. You can save places you like, leave a review, and add new rooftops
            when you discover them. The map grows as more people use it, making it easier to find great views in any city.
          </Text> */}

          <Text style={[styles.storyText, { color: theme.text }]}>
            No gate-keeping, no velvet-rope mystery. Just climb, look out, and tag the next one. If you find a better view, add it. The city's bigger than five boroughs — it's every rooftop we haven't seen yet.
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.signatureContainer}>
          <Text style={[styles.signature, { color: theme.text }]}>
            — Norden Sherpa
          </Text>
          <Text style={styles.contact}>
            sherpa.n471@gmail.com
          </Text>
          <Text style={styles.tagline}>
            Creator, explorer, learner, sunset chaser
          </Text>
        </View>

        {/* App Info */}
        <View style={styles.appInfoContainer}>
          <Text style={[styles.appInfoTitle, { color: theme.text }]}>
            The Mission
          </Text>
          <Text style={[styles.appInfoText, { color: '#94a3b8' }]}>
            To make the rooftops around New York available to everyone.
          </Text>
        </View>

        {/* Version Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>Made with ☕ in NYC</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#3b82f6',
    opacity:0.8
  },
  storyContainer: {
    marginBottom: 32,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 20,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  signatureContainer: {
    marginBottom: 40,
    paddingLeft: 8,
  },
  signature: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  appInfoContainer: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  appInfoText: {
    fontSize: 15,
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  contact:{
    fontSize: 14,
    color: '#3b82f6',
    
  }
});