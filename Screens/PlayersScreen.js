"use client"

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Animated,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  Platform,
  Vibration,
  RefreshControl,
  Switch,
} from "react-native"
import React, { useState, useRef, useEffect, useMemo } from "react"
import { useNavigation, useRoute } from "@react-navigation/native"
import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const { width, height } = Dimensions.get("window")
const HEADER_MAX_HEIGHT = 200
const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 120 : 100
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

const SKILL_LEVELS = {
  BEGINNER: { label: "BEGINNER", color: "#4CAF50", backgroundColor: "rgba(76, 175, 80, 0.1)" },
  INTERMEDIATE: { label: "INTERMEDIATE", color: "#FF9800", backgroundColor: "rgba(255, 152, 0, 0.1)" },
  ADVANCED: { label: "ADVANCED", color: "#F44336", backgroundColor: "rgba(244, 67, 54, 0.1)" },
  PROFESSIONAL: { label: "PRO", color: "#2196F3", backgroundColor: "rgba(33, 150, 243, 0.1)" },
  EXPERT: { label: "EXPERT", color: "#9C27B0", backgroundColor: "rgba(156, 39, 176, 0.1)" },
}

// Skeleton component for loading state
const SkeletonPlayerCard = () => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    )
    pulse.start()
    return () => pulse.stop()
  }, [])

  return (
    <Animated.View style={[styles.playerCard, { opacity: pulseAnim }]}>
      <View style={[styles.skeletonCircle, styles.skeletonAnimation]} />
      <View style={styles.playerInfo}>
        <View style={[styles.skeletonLine, styles.skeletonAnimation, { width: "70%", height: 18, marginBottom: 10 }]} />
        <View style={[styles.skeletonLine, styles.skeletonAnimation, { width: "40%", height: 14 }]} />
      </View>
      <View style={[styles.skeletonButton, styles.skeletonAnimation]} />
    </Animated.View>
  )
}

// Custom tooltip component
const Tooltip = ({ visible, text, position = { top: 0, left: 0 } }) => {
  if (!visible) return null

  return (
    <View style={[styles.tooltip, position]}>
      <View style={styles.tooltipArrow} />
      <Text style={styles.tooltipText}>{text}</Text>
    </View>
  )
}

const PlayersScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const [players, setPlayers] = useState(route?.params?.players || [])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPlayers, setFilteredPlayers] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [tooltipText, setTooltipText] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    onlineOnly: false,
    skillLevel: null,
    sortBy: "name", // 'name', 'rating', 'skill'
  })

  const searchAnimation = useRef(new Animated.Value(0)).current
  const scrollY = useRef(new Animated.Value(0)).current
  const filterHeight = useRef(new Animated.Value(0)).current
  const listRef = useRef(null)

  // Group players by first letter of last name
  const groupedPlayers = useMemo(() => {
    if (!filteredPlayers.length) return []

    const groups = {}
    filteredPlayers.forEach((player) => {
      const firstLetter = player.lastName.charAt(0).toUpperCase()
      if (!groups[firstLetter]) {
        groups[firstLetter] = []
      }
      groups[firstLetter].push(player)
    })

    return Object.keys(groups)
      .sort()
      .map((letter) => ({
        title: letter,
        data: groups[letter],
      }))
  }, [filteredPlayers])

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredPlayers(players)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [players])

  // Handle search and filtering
  useEffect(() => {
    if (isLoading && !refreshing) return

    let results = [...players]

    // Apply search filter
    if (searchQuery.trim() !== "") {
      results = results.filter((player) => {
        const fullName = `${player.firstName} ${player.lastName}`.toLowerCase()
        return fullName.includes(searchQuery.toLowerCase())
      })
    }

    // Apply other filters
    if (filters.onlineOnly) {
      // Simulate online status based on player index
      results = results.filter((_, index) => index % 3 !== 0)
    }

    if (filters.skillLevel) {
      // Simulate skill level filtering
      const skillLevels = Object.keys(SKILL_LEVELS)
      results = results.filter((_, index) => skillLevels[index % skillLevels.length] === filters.skillLevel)
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "name":
        results.sort((a, b) => a.lastName.localeCompare(b.lastName))
        break
      case "rating":
        // Simulate rating sorting
        results.sort((_, __) => Math.random() - 0.5)
        break
      case "skill":
        // Simulate skill sorting
        results.sort((_, __) => Math.random() - 0.5)
        break
    }

    setFilteredPlayers(results)
  }, [searchQuery, filters, players, refreshing])

  // Animation for search focus
  useEffect(() => {
    Animated.timing(searchAnimation, {
      toValue: isSearchFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [isSearchFocused])

  // Animation for filter panel
  useEffect(() => {
    Animated.timing(filterHeight, {
      toValue: showFilters ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [showFilters])

  // Handle pull to refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    // Simulate refreshing data
    setTimeout(() => {
      // Shuffle the players array to simulate new data
      setPlayers((prevPlayers) => [...prevPlayers].sort(() => Math.random() - 0.5))
      setRefreshing(false)
    }, 2000)
  }, [])

  // Show tooltip
  const displayTooltip = (text, x, y) => {
    setTooltipText(text)
    setTooltipPosition({ top: y, left: x })
    setShowTooltip(true)

    // Vibrate for feedback
    if (Platform.OS === "android") {
      Vibration.vibrate(20)
    }

    // Hide tooltip after delay
    setTimeout(() => {
      setShowTooltip(false)
    }, 2000)
  }

  // Header animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  })

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.3, 0],
    extrapolate: "clamp",
  })

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  })

  const headerTitleTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [60, 30, 0],
    extrapolate: "clamp",
  })

  const searchWidth = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["88%", "100%"],
  })

  const filterPanelHeight = filterHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180],
  })

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
      <View style={styles.sectionDivider} />
    </View>
  )

  const renderPlayerItem = ({ item, index, section }) => {
    // Assign skill levels and ratings deterministically based on index
    const skillLevels = Object.keys(SKILL_LEVELS)
    const skillLevel = SKILL_LEVELS[skillLevels[index % skillLevels.length]]
    const rating = (3 + (index % 20) / 10).toFixed(1)
    const isOnline = index % 3 !== 0 // Every third player is offline

    return (
      <Animated.View
        style={[
          styles.playerCard,
          // Remove the transform scale animation that was using scrollY
        ]}
      >
        <TouchableOpacity
          style={styles.playerImageContainer}
          onPress={() => displayTooltip("View profile", width / 2 - 100, height / 2)}
        >
          <Image style={styles.playerImage} source={{ uri: item?.image }} />
          {isOnline && <View style={styles.onlineIndicator} />}
        </TouchableOpacity>

        <View style={[styles.playerInfo, { marginRight: 8 }]}>
          <View style={styles.playerNameRow}>
            <Text style={styles.playerName}>
              {item?.firstName} {item?.lastName}
            </Text>
            {index % 5 === 0 && (
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" size={16} color="#2196F3" />
              </View>
            )}
          </View>

          <View style={styles.playerDetails}>
            <View
              style={[
                styles.skillBadge,
                {
                  borderColor: skillLevel.color,
                  backgroundColor: skillLevel.backgroundColor,
                },
              ]}
            >
              <Text style={[styles.skillText, { color: skillLevel.color }]}>{skillLevel.label}</Text>
            </View>

            <View style={styles.statBadge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.statText}>{rating}</Text>
            </View>

            <View style={styles.statBadge}>
              <MaterialCommunityIcons name="trophy-outline" size={12} color="#6200EA" />
              <Text style={styles.statText}>{index + 1}</Text>
            </View>
          </View>

          {index % 4 === 0 && (
            <View style={styles.lastActiveContainer}>
              <Text style={styles.lastActiveText}>Last active: Today</Text>
            </View>
          )}
        </View>
      </Animated.View>
    )
  }

  const renderEmptyList = () => {
    if (isLoading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          {[...Array(5)].map((_, index) => (
            <SkeletonPlayerCard key={index} />
          ))}
        </View>
      )
    }

    if (refreshing) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#6200EA" />
          <Text style={styles.emptyText}>Refreshing players...</Text>
        </View>
      )
    }

    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="account-search-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>No players found</Text>
        <Text style={styles.emptySubtext}>Try a different search term or adjust your filters</Text>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setSearchQuery("")
            setFilters({
              onlineOnly: false,
              skillLevel: null,
              sortBy: "name",
            })
            setShowFilters(false)
          }}
        >
          <Text style={styles.resetButtonText}>Reset Filters</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200EA" />

      {/* Animated Header */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <View style={styles.headerBackground}>
          <View style={styles.headerPattern} />
        </View>

        <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Animated.Text
              style={[
                styles.headerTitle,
                {
                  opacity: headerTitleOpacity,
                  transform: [{ translateY: headerTitleTranslate }],
                },
              ]}
            >
              Team Players
            </Animated.Text>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowFilters(!showFilters)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="filter-outline" size={22} color={showFilters ? "#FFD700" : "white"} />
                {showFilters && <View style={styles.activeDot} />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Entypo name="share" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Entypo name="dots-three-vertical" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerBottom}>
            <View style={styles.playerCountContainer}>
              <Text style={styles.playerCount}>{filteredPlayers.length} Players</Text>
              <Text style={styles.playerSubCount}>from {players.length} total</Text>
            </View>

            <View style={styles.visibilityBadge}>
              <Ionicons name="earth" size={16} color="white" />
              <Text style={styles.visibilityText}>Public</Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <Animated.View
          style={[styles.searchContainer, isSearchFocused && styles.searchContainerFocused, { width: searchWidth }]}
        >
          <Ionicons name="search" size={20} color={isSearchFocused ? "#6200EA" : "#666"} />

          <TextInput
            style={styles.searchInput}
            placeholder="Search players..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            returnKeyType="search"
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {isSearchFocused && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setSearchQuery("")
              setIsSearchFocused(false)
              Keyboard.dismiss()
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Panel */}
      <Animated.View style={[styles.filterPanel, { height: filterPanelHeight }]}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Online Only</Text>
          <Switch
            value={filters.onlineOnly}
            onValueChange={(value) => {
              if (Platform.OS === "android") Vibration.vibrate(20)
              setFilters((prev) => ({ ...prev, onlineOnly: value }))
            }}
            trackColor={{ false: "#e0e0e0", true: "rgba(98, 0, 234, 0.4)" }}
            thumbColor={filters.onlineOnly ? "#6200EA" : "#f4f3f4"}
          />
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Skill Level</Text>
          <View style={styles.chipContainer}>
            {Object.keys(SKILL_LEVELS).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.filterChip,
                  filters.skillLevel === level && {
                    backgroundColor: SKILL_LEVELS[level].backgroundColor,
                    borderColor: SKILL_LEVELS[level].color,
                  },
                ]}
                onPress={() => {
                  if (Platform.OS === "android") Vibration.vibrate(20)
                  setFilters((prev) => ({
                    ...prev,
                    skillLevel: prev.skillLevel === level ? null : level,
                  }))
                }}
              >
                <Text
                  style={[styles.filterChipText, filters.skillLevel === level && { color: SKILL_LEVELS[level].color }]}
                >
                  {SKILL_LEVELS[level].label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Sort By</Text>
          <View style={styles.chipContainer}>
            {[
              { id: "name", label: "Name" },
              { id: "rating", label: "Rating" },
              { id: "skill", label: "Skill" },
            ].map((sort) => (
              <TouchableOpacity
                key={sort.id}
                style={[
                  styles.filterChip,
                  filters.sortBy === sort.id && {
                    backgroundColor: "rgba(98, 0, 234, 0.1)",
                    borderColor: "#6200EA",
                  },
                ]}
                onPress={() => {
                  if (Platform.OS === "android") Vibration.vibrate(20)
                  setFilters((prev) => ({ ...prev, sortBy: sort.id }))
                }}
              >
                <Text style={[styles.filterChipText, filters.sortBy === sort.id && { color: "#6200EA" }]}>
                  {sort.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Players List */}
      {isLoading && !refreshing ? (
        <FlatList
          data={[...Array(5)]}
          renderItem={() => <SkeletonPlayerCard />}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <Animated.SectionList
          ref={listRef}
          sections={groupedPlayers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPlayerItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={[styles.listContainer, filteredPlayers.length === 0 && styles.emptyList]}
          ListEmptyComponent={renderEmptyList}
          stickySectionHeadersEnabled={true}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6200EA"]} tintColor="#6200EA" />
          }
        />
      )}

      {/* Tooltip */}
      <Tooltip visible={showTooltip} text={tooltipText} position={tooltipPosition} />
    </SafeAreaView>
  )
}

export default PlayersScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  headerContainer: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200EA",
  },
  headerPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: "#6200EA",
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 8,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
    position: "relative",
  },
  activeDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
  },
  headerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  playerCountContainer: {
    flexDirection: "column",
  },
  playerCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  playerSubCount: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  visibilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  visibilityText: {
    color: "white",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: -24,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchContainerFocused: {
    borderWidth: 1,
    borderColor: "#6200EA",
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  cancelButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cancelText: {
    color: "#6200EA",
    fontWeight: "500",
    fontSize: 14,
  },
  filterPanel: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    flex: 1,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginLeft: 8,
    marginBottom: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  listContainer: {
    padding: 16,
    paddingTop: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#f8f8f8",
    marginTop: 8,
    marginBottom: 4,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6200EA",
    marginRight: 8,
  },
  sectionDivider: {
    height: 1,
    flex: 1,
    backgroundColor: "rgba(98, 0, 234, 0.2)",
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  playerImageContainer: {
    position: "relative",
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#6200EA",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "white",
  },
  playerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playerNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  verifiedBadge: {
    marginLeft: 6,
    marginBottom: 8,
  },
  playerDetails: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  skillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  statText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    marginLeft: 4,
  },
  lastActiveContainer: {
    marginTop: 8,
  },
  lastActiveText: {
    fontSize: 12,
    color: "#999",
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  resetButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#6200EA",
    borderRadius: 20,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "500",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 10,
    borderRadius: 6,
    maxWidth: 200,
  },
  tooltipArrow: {
    position: "absolute",
    top: -10,
    left: "50%",
    marginLeft: -5,
    borderWidth: 5,
    borderColor: "transparent",
    borderBottomColor: "rgba(0, 0, 0, 0.8)",
  },
  tooltipText: {
    color: "white",
    fontSize: 14,
  },
  loadingContainer: {
    padding: 16,
  },
  skeletonCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  skeletonButton: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
  },
  skeletonAnimation: {
    backgroundColor: "#e0e0e0",
  },
})

