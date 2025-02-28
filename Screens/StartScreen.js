import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    Pressable,
    TouchableOpacity,
  } from "react-native";
  import React from "react";
  import { useNavigation } from "@react-navigation/native";
  
  const StartScreen = () => {
    const navigation = useNavigation();
  
    return (
      <View style={styles.container}>
        {/* Dynamic Map Background with Animated Gradient */}
        <View style={styles.mapContainer}>
          <Image 
            source={require("../images/Map.png")} 
            style={styles.mapBackground}
          />
          <View style={styles.overlay} />
          <View style={styles.gradientOverlay} />
        </View>
  
        {/* Floating Elements */}
        <View style={styles.floatingElements}>
          <View style={styles.bubble} />
          <View style={styles.bubble2} />
          <View style={styles.bubble3} />
        </View>
  
        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Floating Logo Card with Enhanced Effects */}
          <View style={styles.logoCard}>
            <Image
              source={require("../images/Logo.png")}
              style={styles.logo}
            />
            <View style={styles.glowEffect} />
            <View style={styles.shimmerEffect} />
          </View>
  
          {/* Enhanced Text Section */}
          <View style={styles.textSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Find Players</Text>
              <Text style={styles.titleHighlight}>Near You</Text>
            </View>
            <Text style={styles.subtitle}>
              Connect • Play • Compete
            </Text>
            <Text style={styles.description}>
              Join thousands of players in your area and start your gaming journey today
            </Text>
          </View>
  
          {/* Enhanced Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => navigation.navigate("Register")}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>START YOUR JOURNEY</Text>
                <View style={styles.buttonArrow}>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </View>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>Already a player?</Text>
              <Text style={styles.loginHighlight}>Sign In</Text>
            </TouchableOpacity>
          </View>
  
          {/* Social Proof Section */}
          <View style={styles.socialProof}>
            <Text style={styles.statsText}>10K+ Active Players</Text>
            <Text style={styles.statsText}>•</Text>
            <Text style={styles.statsText}>4.9★ Rating</Text>
          </View>
        </View>
      </View>
    );
  };
  
  export default StartScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    mapContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    mapBackground: {
      width: '100%',
      height: '100%',
      opacity: 0.7,
      resizeMode: 'cover',
    },
    overlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(87, 9, 135, 0.3)',
    },
    gradientOverlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(87, 9, 135, 0.2)',
      backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(87,9,135,0.6) 100%)',
    },
    floatingElements: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    bubble: {
      position: 'absolute',
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: 'rgba(255,255,255,0.1)',
      top: '10%',
      left: '5%',
    },
    bubble2: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'rgba(87,9,135,0.15)',
      top: '25%',
      right: '10%',
    },
    bubble3: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255,255,255,0.08)',
      bottom: '15%',
      right: '15%',
    },
    shimmerEffect: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.1)',
      transform: [{ rotate: '45deg' }],
    },
    mainContent: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 24,
      paddingTop: 60,
      paddingBottom: 40,
    },
    logoCard: {
      alignSelf: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 35,
      padding: 25,
      transform: [{ rotate: '-2deg' }],
      shadowColor: '#570987',
      shadowOffset: {
        width: 0,
        height: 15,
      },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 25,
    },
    logo: {
      width: 320,
      height: 160,
      resizeMode: 'contain',
    },
    glowEffect: {
      position: 'absolute',
      top: -20,
      left: -20,
      right: -20,
      bottom: -20,
      borderRadius: 45,
      backgroundColor: 'rgba(87, 9, 135, 0.15)',
      zIndex: -1,
    },
    textSection: {
      alignItems: 'center',
      marginTop: 40,
    },
    titleContainer: {
      alignItems: 'center',
    },
    title: {
      fontSize: 42,
      fontWeight: '800',
      color: '#FFFFFF',
      textAlign: 'center',
      letterSpacing: -0.5,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    titleHighlight: {
      fontSize: 48,
      fontWeight: '900',
      color: '#FFFFFF',
      textAlign: 'center',
      letterSpacing: -0.5,
      textShadowColor: '#570987',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    subtitle: {
      marginTop: 16,
      fontSize: 20,
      color: '#FFFFFF',
      fontWeight: '600',
      letterSpacing: 2,
      opacity: 0.9,
    },
    buttonGroup: {
      gap: 20,
      marginTop: 40,
    },
    mainButton: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      height: 65,
      justifyContent: 'center',
      shadowColor: '#570987',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 16,
      borderWidth: 1,
      borderColor: 'rgba(87,9,135,0.1)',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    buttonText: {
      color: '#570987',
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: 1,
    },
    buttonArrow: {
      marginLeft: 10,
      backgroundColor: '#570987',
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowIcon: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    loginLink: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    loginText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '500',
      opacity: 0.9,
    },
    loginHighlight: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      textDecorationLine: 'underline',
    },
    description: {
      marginTop: 12,
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
      opacity: 0.8,
      maxWidth: '80%',
    },
    socialProof: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      marginTop: 20,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 15,
      padding: 12,
    },
    statsText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      opacity: 0.9,
    },
  });
  