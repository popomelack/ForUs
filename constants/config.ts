// ForUs - Configuration App
// Congo-Brazzaville Real Estate Platform

export const APP_CONFIG = {
  name: 'ForUs',
  version: '1.0.0',
  tagline: 'L\'immobilier au Congo simplifié',
  description: 'Trouvez votre bien idéal à Brazzaville et Pointe-Noire',
  
  // Contact
  whatsappNumber: '+242066000000',
  supportEmail: 'support@forus.cg',
  website: 'https://forus.cg',
  
  // Locations
  cities: [
    'Brazzaville',
    'Pointe-Noire',
    'Dolisie',
    'Nkayi',
    'Ouesso',
  ],
  
  neighborhoods: {
    'Brazzaville': [
      'Centre-ville',
      'Bacongo',
      'Poto-Poto',
      'Moungali',
      'Ouenzé',
      'Talangaï',
      'Mpila',
      'Mfilou',
      'Djiri',
      'Kintélé',
    ],
    'Pointe-Noire': [
      'Centre-ville',
      'Loandjili',
      'Tié-Tié',
      'Lumumba',
      'Ngoyo',
      'Mpita',
      'Mongo-Poukou',
    ],
  },
  
  // Property types
  propertyTypes: [
    { id: 'villa', label: 'Villa', icon: 'home' },
    { id: 'appartement', label: 'Appartement', icon: 'apartment' },
    { id: 'duplex', label: 'Duplex', icon: 'home-work' },
    { id: 'terrain', label: 'Terrain', icon: 'landscape' },
    { id: 'bureau', label: 'Bureau', icon: 'business' },
    { id: 'studio', label: 'Studio', icon: 'room' },
    { id: 'maison', label: 'Maison', icon: 'house' },
    { id: 'local', label: 'Local commercial', icon: 'store' },
  ],
  
  // Status
  propertyStatus: [
    { id: 'vente', label: 'À vendre', color: '#FF5722' },
    { id: 'location', label: 'À louer', color: '#009688' },
    { id: 'vendu', label: 'Vendu', color: '#9E9E9E' },
    { id: 'loué', label: 'Loué', color: '#9E9E9E' },
  ],
  
  // Price ranges (FCFA)
  priceRanges: [
    { min: 0, max: 30000000, label: 'Moins de 30M' },
    { min: 30000000, max: 60000000, label: '30M - 60M' },
    { min: 60000000, max: 100000000, label: '60M - 100M' },
    { min: 100000000, max: 200000000, label: '100M - 200M' },
    { min: 200000000, max: 500000000, label: '200M - 500M' },
    { min: 500000000, max: null, label: 'Plus de 500M' },
  ],
  
  // Currency
  currency: {
    code: 'XAF',
    symbol: 'FCFA',
    locale: 'fr-CG',
  },
};

export const formatPrice = (amount: number): string => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}Md FCFA`;
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)}M FCFA`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K FCFA`;
  }
  return `${amount} FCFA`;
};

export const formatPriceFull = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};
