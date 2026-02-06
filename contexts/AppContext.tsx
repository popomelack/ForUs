import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { properties, agents, newsArticles, conversations, usersDatabase, passwordsDatabase, Property, Agent, NewsArticle, Conversation, User } from '../services/mockData';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  
  // Data
  properties: Property[];
  favorites: string[];
  agents: Agent[];
  news: NewsArticle[];
  conversations: Conversation[];
  
  // Filters
  filters: {
    type: string | null;
    status: string | null;
    city: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    minBedrooms: number | null;
  };
  searchQuery: string;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleFavorite: (propertyId: string) => void;
  setFilters: (filters: Partial<AppState['filters']>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  likeProperty: (propertyId: string) => void;
  shareProperty: (propertyId: string) => void;
  getFilteredProperties: () => Property[];
}

const defaultFilters = {
  type: null,
  status: null,
  city: null,
  minPrice: null,
  maxPrice: null,
  minBedrooms: null,
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [propertyList, setPropertyList] = useState<Property[]>(properties);
  const [filters, setFiltersState] = useState(defaultFilters);
  const [searchQuery, setSearchQueryState] = useState('');
  
  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);
  
  // Save favorites when they change
  useEffect(() => {
    if (favoriteIds.length > 0 || isAuthenticated) {
      AsyncStorage.setItem('favorites', JSON.stringify(favoriteIds));
    }
  }, [favoriteIds]);
  
  const loadSavedData = async () => {
    try {
      const [savedFavorites, savedAuth, savedUserEmail] = await Promise.all([
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('isAuthenticated'),
        AsyncStorage.getItem('userEmail'),
      ]);
      
      if (savedFavorites) {
        setFavoriteIds(JSON.parse(savedFavorites));
      }
      
      if (savedAuth === 'true' && savedUserEmail) {
        const savedUser = usersDatabase[savedUserEmail];
        if (savedUser) {
          setIsAuthenticated(true);
          setUser(savedUser);
        } else {
          // User not found, clear auth
          await AsyncStorage.multiRemove(['isAuthenticated', 'userEmail']);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (email: string, password: string): Promise<boolean> => {
    // Validate credentials against database
    const storedPassword = passwordsDatabase[email.toLowerCase()];
    const userProfile = usersDatabase[email.toLowerCase()];
    
    if (storedPassword && userProfile && storedPassword === password) {
      setIsAuthenticated(true);
      setUser(userProfile);
      await AsyncStorage.setItem('isAuthenticated', 'true');
      await AsyncStorage.setItem('userEmail', email.toLowerCase());
      return true;
    }
    return false;
  };
  
  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      await AsyncStorage.multiRemove(['isAuthenticated', 'userEmail']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const toggleFavorite = (propertyId: string) => {
    setFavoriteIds(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      }
      return [...prev, propertyId];
    });
  };
  
  const likeProperty = (propertyId: string) => {
    setPropertyList(prev => 
      prev.map(p => 
        p.id === propertyId ? { ...p, likes: p.likes + 1 } : p
      )
    );
  };
  
  const shareProperty = (propertyId: string) => {
    setPropertyList(prev => 
      prev.map(p => 
        p.id === propertyId ? { ...p, shares: p.shares + 1 } : p
      )
    );
  };
  
  const setFilters = (newFilters: Partial<typeof filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };
  
  const clearFilters = () => {
    setFiltersState(defaultFilters);
    setSearchQueryState('');
  };
  
  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
  };
  
  const getFilteredProperties = (): Property[] => {
    return propertyList.filter(property => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          property.title.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query) ||
          property.neighborhood.toLowerCase().includes(query) ||
          property.type.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Type filter
      if (filters.type && property.type !== filters.type) return false;
      
      // Status filter
      if (filters.status && property.status !== filters.status) return false;
      
      // City filter
      if (filters.city && property.city !== filters.city) return false;
      
      // Price filters
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      
      // Bedrooms filter
      if (filters.minBedrooms && property.bedrooms < filters.minBedrooms) return false;
      
      return true;
    });
  };
  
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        properties: propertyList,
        favorites: favoriteIds,
        agents,
        news: newsArticles,
        conversations,
        filters,
        searchQuery,
        login,
        logout,
        toggleFavorite,
        setFilters,
        clearFilters,
        setSearchQuery,
        likeProperty,
        shareProperty,
        getFilteredProperties,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
