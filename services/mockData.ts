// ForUs - Mock Data
// Données de démonstration pour l'application

export interface Property {
  id: string;
  title: string;
  type: string;
  status: 'vente' | 'location';
  price: number;
  pricePerMonth?: number;
  city: string;
  neighborhood: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  description: string;
  features: string[];
  images: string[];
  agent: Agent;
  agencyId: string;
  views: number;
  likes: number;
  shares: number;
  isNew: boolean;
  isPremium: boolean;
  createdAt: string;
  coordinates?: { lat: number; lng: number };
}

export interface Agent {
  id: string;
  name: string;
  photo: string;
  phone: string;
  whatsapp: string;
  email: string;
  agency: string;
  agencyLogo: string;
  rating: number;
  reviews: number;
  properties: number;
  specialties: string[];
  verified: boolean;
  bio: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  readTime: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'client' | 'agent' | 'agency' | 'admin';
  favorites: string[];
  searches: SavedSearch[];
  notifications: boolean;
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: {
    type?: string;
    status?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
  };
  alertEnabled: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
  propertyId?: string;
}

export interface Conversation {
  id: string;
  participants: { id: string; name: string; avatar: string }[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  propertyId?: string;
  propertyTitle?: string;
}

// Mock Agents
export const agents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Marie Okemba',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop',
    phone: '+242 06 600 00 01',
    whatsapp: '+242066000001',
    email: 'marie.okemba@immopremium.cg',
    agency: 'Immo Premium Congo',
    agencyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
    rating: 4.9,
    reviews: 127,
    properties: 45,
    specialties: ['Villas de luxe', 'Propriétés haut de gamme'],
    verified: true,
    bio: 'Spécialiste de l\'immobilier de luxe à Brazzaville avec plus de 10 ans d\'expérience.',
  },
  {
    id: 'agent-2',
    name: 'Jean-Paul Moukoko',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    phone: '+242 06 600 00 02',
    whatsapp: '+242066000002',
    email: 'jp.moukoko@congohabitat.cg',
    agency: 'Congo Habitat Solutions',
    agencyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
    rating: 4.8,
    reviews: 98,
    properties: 78,
    specialties: ['Appartements', 'Locations'],
    verified: true,
    bio: 'Expert en location d\'appartements et solutions résidentielles à Pointe-Noire.',
  },
  {
    id: 'agent-3',
    name: 'Grace Ngoma',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    phone: '+242 06 600 00 03',
    whatsapp: '+242066000003',
    email: 'grace.ngoma@immopremium.cg',
    agency: 'Immo Premium Congo',
    agencyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
    rating: 4.7,
    reviews: 85,
    properties: 32,
    specialties: ['Terrains', 'Investissements'],
    verified: true,
    bio: 'Conseillère en investissements immobiliers et terrains viabilisés.',
  },
  {
    id: 'agent-4',
    name: 'Patrick Mabiala',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    phone: '+242 06 600 00 04',
    whatsapp: '+242066000004',
    email: 'patrick.m@agencecentre.cg',
    agency: 'Agence du Centre',
    agencyLogo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop',
    rating: 4.6,
    reviews: 64,
    properties: 23,
    specialties: ['Résidentiel', 'Bureaux'],
    verified: true,
    bio: 'Agent immobilier polyvalent spécialisé dans le centre-ville de Brazzaville.',
  },
  {
    id: 'agent-5',
    name: 'Sylvie Loufoua',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    phone: '+242 06 600 00 05',
    whatsapp: '+242066000005',
    email: 'sylvie.l@immomoderne.cg',
    agency: 'Immobilier Moderne',
    agencyLogo: 'https://images.unsplash.com/photo-1464938050520-ef2571f05df4?w=100&h=100&fit=crop',
    rating: 4.5,
    reviews: 42,
    properties: 15,
    specialties: ['Studios', 'Jeunes actifs'],
    verified: false,
    bio: 'Spécialiste des petites surfaces et premiers achats pour jeunes professionnels.',
  },
];

// Mock Properties
export const properties: Property[] = [
  {
    id: 'prop-1',
    title: 'Villa moderne avec piscine à Mpila',
    type: 'villa',
    status: 'vente',
    price: 280000000,
    city: 'Brazzaville',
    neighborhood: 'Mpila',
    address: 'Avenue des Trois Martyrs',
    bedrooms: 5,
    bathrooms: 4,
    surface: 450,
    description: 'Magnifique villa contemporaine avec piscine, jardin paysager et vue dégagée. Construction récente aux finitions haut de gamme. Quartier résidentiel calme et sécurisé.',
    features: ['Piscine', 'Jardin', 'Garage 2 voitures', 'Climatisation', 'Groupe électrogène', 'Gardien 24h/24', 'Cuisine équipée', 'Terrasse'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ],
    agent: agents[0],
    agencyId: 'agency-1',
    views: 1250,
    likes: 89,
    shares: 34,
    isNew: true,
    isPremium: true,
    createdAt: '2025-01-28',
    coordinates: { lat: -4.2634, lng: 15.2429 },
  },
  {
    id: 'prop-2',
    title: 'Duplex luxueux vue mer à Loandjili',
    type: 'duplex',
    status: 'vente',
    price: 180000000,
    city: 'Pointe-Noire',
    neighborhood: 'Loandjili',
    address: 'Boulevard de la République',
    bedrooms: 4,
    bathrooms: 3,
    surface: 220,
    description: 'Superbe duplex avec vue imprenable sur l\'océan Atlantique. Résidence sécurisée avec accès direct à la plage. Finitions luxueuses et espaces de vie généreux.',
    features: ['Vue mer', 'Terrasse panoramique', 'Résidence sécurisée', 'Climatisation', 'Parking', 'Ascenseur', 'Plage privée'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
    ],
    agent: agents[1],
    agencyId: 'agency-2',
    views: 890,
    likes: 67,
    shares: 28,
    isNew: false,
    isPremium: true,
    createdAt: '2025-01-20',
    coordinates: { lat: -4.7692, lng: 11.8636 },
  },
  {
    id: 'prop-3',
    title: 'Appartement F4 centre-ville Brazzaville',
    type: 'appartement',
    status: 'vente',
    price: 55000000,
    city: 'Brazzaville',
    neighborhood: 'Centre-ville',
    address: 'Rue Moe Poaty',
    bedrooms: 3,
    bathrooms: 2,
    surface: 120,
    description: 'Appartement spacieux idéalement situé en plein cœur de Brazzaville. Proximité immédiate des commerces, banques et transports. Parfait pour famille ou investissement locatif.',
    features: ['Centre-ville', 'Lumineux', 'Balcon', 'Climatisation', 'Parking', 'Proche commerces'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    ],
    agent: agents[3],
    agencyId: 'agency-3',
    views: 654,
    likes: 45,
    shares: 12,
    isNew: false,
    isPremium: false,
    createdAt: '2025-01-15',
    coordinates: { lat: -4.2611, lng: 15.2469 },
  },
  {
    id: 'prop-4',
    title: 'Terrain viabilisé 500m² à Bacongo',
    type: 'terrain',
    status: 'vente',
    price: 35000000,
    city: 'Brazzaville',
    neighborhood: 'Bacongo',
    address: 'Route de l\'OMS',
    bedrooms: 0,
    bathrooms: 0,
    surface: 500,
    description: 'Terrain plat et viabilisé dans un quartier en plein développement. Eau et électricité disponibles. Titre foncier en règle. Idéal pour construction de maison familiale.',
    features: ['Viabilisé', 'Titre foncier', 'Eau/Électricité', 'Quartier calme', 'Accès goudronné'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800&h=600&fit=crop',
    ],
    agent: agents[2],
    agencyId: 'agency-1',
    views: 432,
    likes: 28,
    shares: 15,
    isNew: true,
    isPremium: false,
    createdAt: '2025-01-25',
    coordinates: { lat: -4.2701, lng: 15.2521 },
  },
  {
    id: 'prop-5',
    title: 'Studio meublé à louer - Moungali',
    type: 'studio',
    status: 'location',
    price: 150000,
    pricePerMonth: 150000,
    city: 'Brazzaville',
    neighborhood: 'Moungali',
    address: 'Avenue de l\'Indépendance',
    bedrooms: 1,
    bathrooms: 1,
    surface: 35,
    description: 'Studio entièrement meublé et équipé, prêt à habiter. Idéal pour étudiant ou jeune professionnel. Quartier animé avec tous les commerces à proximité.',
    features: ['Meublé', 'Équipé', 'Wifi inclus', 'Eau/Électricité inclus', 'Sécurisé'],
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
    ],
    agent: agents[4],
    agencyId: 'agency-4',
    views: 789,
    likes: 52,
    shares: 8,
    isNew: false,
    isPremium: false,
    createdAt: '2025-01-10',
  },
  {
    id: 'prop-6',
    title: 'Bureau moderne 200m² - Centre d\'affaires',
    type: 'bureau',
    status: 'location',
    price: 2500000,
    pricePerMonth: 2500000,
    city: 'Brazzaville',
    neighborhood: 'Centre-ville',
    address: 'Tour Nabemba',
    bedrooms: 0,
    bathrooms: 2,
    surface: 200,
    description: 'Espace de bureau premium dans le centre d\'affaires le plus prestigieux de Brazzaville. Open space modulable, salles de réunion, accueil et parking sécurisé.',
    features: ['Open space', 'Climatisation centrale', 'Sécurité 24h/24', 'Parking', 'Fibre optique', 'Salle de réunion'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    ],
    agent: agents[3],
    agencyId: 'agency-3',
    views: 345,
    likes: 23,
    shares: 18,
    isNew: false,
    isPremium: true,
    createdAt: '2025-01-05',
  },
  {
    id: 'prop-7',
    title: 'Maison coloniale rénovée - Poto-Poto',
    type: 'maison',
    status: 'vente',
    price: 95000000,
    city: 'Brazzaville',
    neighborhood: 'Poto-Poto',
    address: 'Rue Matsiona',
    bedrooms: 4,
    bathrooms: 2,
    surface: 180,
    description: 'Charmante maison de style colonial entièrement rénovée. Alliance parfaite entre cachet historique et confort moderne. Grand jardin arboré.',
    features: ['Rénové', 'Jardin', 'Garage', 'Charme colonial', 'Quartier historique'],
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
    ],
    agent: agents[0],
    agencyId: 'agency-1',
    views: 567,
    likes: 78,
    shares: 25,
    isNew: false,
    isPremium: false,
    createdAt: '2025-01-12',
  },
  {
    id: 'prop-8',
    title: 'Appartement F3 neuf - Talangaï',
    type: 'appartement',
    status: 'vente',
    price: 42000000,
    city: 'Brazzaville',
    neighborhood: 'Talangaï',
    address: 'Avenue de la Paix',
    bedrooms: 2,
    bathrooms: 1,
    surface: 85,
    description: 'Appartement neuf dans résidence récente. Finitions de qualité, cuisine américaine équipée. Idéal premier achat ou investissement.',
    features: ['Neuf', 'Cuisine américaine', 'Résidence gardiennée', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
    ],
    agent: agents[1],
    agencyId: 'agency-2',
    views: 423,
    likes: 35,
    shares: 9,
    isNew: true,
    isPremium: false,
    createdAt: '2025-01-26',
  },
  {
    id: 'prop-9',
    title: 'Villa de standing à Kintélé',
    type: 'villa',
    status: 'vente',
    price: 450000000,
    city: 'Brazzaville',
    neighborhood: 'Kintélé',
    address: 'Boulevard du Stade',
    bedrooms: 6,
    bathrooms: 5,
    surface: 600,
    description: 'Exceptionnelle villa de grand standing dans le quartier le plus prisé de Brazzaville. Piscine à débordement, tennis, dépendances pour personnel.',
    features: ['Piscine à débordement', 'Court de tennis', 'Dépendances', 'Jardin 2000m²', 'Groupe électrogène', 'Forage', 'Système domotique'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    ],
    agent: agents[0],
    agencyId: 'agency-1',
    views: 2150,
    likes: 156,
    shares: 67,
    isNew: false,
    isPremium: true,
    createdAt: '2025-01-08',
  },
  {
    id: 'prop-10',
    title: 'Local commercial 150m² - Tié-Tié',
    type: 'local',
    status: 'location',
    price: 800000,
    pricePerMonth: 800000,
    city: 'Pointe-Noire',
    neighborhood: 'Tié-Tié',
    address: 'Avenue Charles de Gaulle',
    bedrooms: 0,
    bathrooms: 1,
    surface: 150,
    description: 'Local commercial bien situé sur axe passant. Grande vitrine, bon état général. Convient pour boutique, restaurant ou services.',
    features: ['Axe passant', 'Grande vitrine', 'Arrière-boutique', 'Toilettes'],
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&h=600&fit=crop',
    ],
    agent: agents[1],
    agencyId: 'agency-2',
    views: 234,
    likes: 15,
    shares: 7,
    isNew: false,
    isPremium: false,
    createdAt: '2025-01-18',
  },
  // Additional properties for more data
  {
    id: 'prop-11',
    title: 'Appartement F5 familial - Ouenzé',
    type: 'appartement',
    status: 'vente',
    price: 68000000,
    city: 'Brazzaville',
    neighborhood: 'Ouenzé',
    address: 'Rue des Écoles',
    bedrooms: 4,
    bathrooms: 2,
    surface: 140,
    description: 'Grand appartement familial dans quartier calme. Proche des écoles et marchés. Balcon donnant sur cour intérieure.',
    features: ['Familial', 'Proche écoles', 'Balcon', 'Cave', 'Gardien'],
    images: [
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560185127-bdf5d6f1bce5?w=800&h=600&fit=crop',
    ],
    agent: agents[3],
    agencyId: 'agency-3',
    views: 312,
    likes: 28,
    shares: 11,
    isNew: false,
    isPremium: false,
    createdAt: '2025-01-22',
  },
  {
    id: 'prop-12',
    title: 'Terrain 1000m² - Djiri',
    type: 'terrain',
    status: 'vente',
    price: 28000000,
    city: 'Brazzaville',
    neighborhood: 'Djiri',
    address: 'Secteur 15',
    bedrooms: 0,
    bathrooms: 0,
    surface: 1000,
    description: 'Grand terrain dans zone en développement. Accès facile depuis la nationale. Idéal pour projet immobilier ou entrepôt.',
    features: ['Grand terrain', 'Zone en développement', 'Accès route nationale'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
    ],
    agent: agents[2],
    agencyId: 'agency-1',
    views: 189,
    likes: 12,
    shares: 5,
    isNew: true,
    isPremium: false,
    createdAt: '2025-01-27',
  },
];

// Mock News
export const newsArticles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Le marché immobilier congolais en pleine croissance',
    excerpt: 'Analyse des tendances du secteur immobilier au Congo-Brazzaville pour 2025.',
    content: 'Le marché immobilier congolais connaît une croissance soutenue depuis plusieurs années. Les investissements dans les infrastructures et l\'urbanisation rapide de Brazzaville et Pointe-Noire stimulent la demande...',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    category: 'Marché',
    author: 'Rédaction ForUs',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
    date: '2025-01-28',
    likes: 234,
    comments: 45,
    shares: 89,
    readTime: 5,
  },
  {
    id: 'news-2',
    title: '5 conseils pour bien acheter votre premier bien',
    excerpt: 'Guide pratique pour les primo-accédants au Congo.',
    content: 'Acheter son premier bien immobilier est une étape importante. Voici nos conseils pour réussir votre acquisition au Congo-Brazzaville...',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
    category: 'Conseils',
    author: 'Marie Okemba',
    authorAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=50&h=50&fit=crop',
    date: '2025-01-25',
    likes: 456,
    comments: 78,
    shares: 123,
    readTime: 8,
  },
  {
    id: 'news-3',
    title: 'Nouveaux projets immobiliers à Kintélé',
    excerpt: 'Découvrez les programmes neufs dans le quartier le plus dynamique de Brazzaville.',
    content: 'Le quartier de Kintélé continue son développement avec plusieurs projets immobiliers d\'envergure. Appartements, villas et commerces vont transformer ce secteur...',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop',
    category: 'Nouveautés',
    author: 'Jean-Paul Moukoko',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
    date: '2025-01-22',
    likes: 189,
    comments: 34,
    shares: 56,
    readTime: 4,
  },
  {
    id: 'news-4',
    title: 'Location vs Achat : que choisir au Congo ?',
    excerpt: 'Analyse comparative pour vous aider à faire le bon choix.',
    content: 'Face à la hausse des prix immobiliers, de nombreux Congolais s\'interrogent : vaut-il mieux louer ou acheter ? Notre analyse détaillée...',
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=400&fit=crop',
    category: 'Conseils',
    author: 'Grace Ngoma',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop',
    date: '2025-01-20',
    likes: 312,
    comments: 89,
    shares: 145,
    readTime: 10,
  },
  {
    id: 'news-5',
    title: 'Les quartiers les plus prisés de Pointe-Noire',
    excerpt: 'Top 5 des secteurs où investir dans la capitale économique.',
    content: 'Pointe-Noire offre de nombreuses opportunités immobilières. Découvrez les quartiers qui attirent le plus d\'investisseurs et de résidents...',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop',
    category: 'Marché',
    author: 'Rédaction ForUs',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
    date: '2025-01-18',
    likes: 267,
    comments: 56,
    shares: 98,
    readTime: 6,
  },
  {
    id: 'news-6',
    title: 'Forum immobilier de Brazzaville 2025',
    excerpt: 'Rendez-vous le 15 février pour l\'événement incontournable du secteur.',
    content: 'Le Forum Immobilier de Brazzaville revient pour sa 5ème édition. Conférences, exposants et opportunités vous attendent au Palais des Congrès...',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    category: 'Événements',
    author: 'Rédaction ForUs',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
    date: '2025-01-15',
    likes: 178,
    comments: 23,
    shares: 67,
    readTime: 3,
  },
];

// Mock Conversations
export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [
      { id: 'user-1', name: 'Vous', avatar: '' },
      { id: 'agent-1', name: 'Marie Okemba', avatar: agents[0].photo },
    ],
    lastMessage: 'Bonjour ! Oui, la villa est toujours disponible. Souhaitez-vous organiser une visite ?',
    lastMessageTime: '2025-01-28T14:30:00',
    unreadCount: 1,
    propertyId: 'prop-1',
    propertyTitle: 'Villa moderne avec piscine à Mpila',
  },
  {
    id: 'conv-2',
    participants: [
      { id: 'user-1', name: 'Vous', avatar: '' },
      { id: 'agent-2', name: 'Jean-Paul Moukoko', avatar: agents[1].photo },
    ],
    lastMessage: 'Le propriétaire accepte une négociation. Quel est votre budget maximum ?',
    lastMessageTime: '2025-01-27T18:45:00',
    unreadCount: 0,
    propertyId: 'prop-2',
    propertyTitle: 'Duplex luxueux vue mer',
  },
  {
    id: 'conv-3',
    participants: [
      { id: 'user-1', name: 'Vous', avatar: '' },
      { id: 'agent-3', name: 'Grace Ngoma', avatar: agents[2].photo },
    ],
    lastMessage: 'Merci pour votre intérêt. Je vous envoie les documents du terrain.',
    lastMessageTime: '2025-01-26T10:15:00',
    unreadCount: 2,
    propertyId: 'prop-4',
    propertyTitle: 'Terrain viabilisé 500m²',
  },
];

// Mock Messages
export const messages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-1',
    senderName: 'Vous',
    senderAvatar: '',
    receiverId: 'agent-1',
    text: 'Bonjour, je suis intéressé par la villa à Mpila. Est-elle toujours disponible ?',
    timestamp: '2025-01-28T14:00:00',
    read: true,
    propertyId: 'prop-1',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'agent-1',
    senderName: 'Marie Okemba',
    senderAvatar: agents[0].photo,
    receiverId: 'user-1',
    text: 'Bonjour ! Oui, la villa est toujours disponible. Souhaitez-vous organiser une visite ?',
    timestamp: '2025-01-28T14:30:00',
    read: false,
    propertyId: 'prop-1',
  },
];

// Users database mock - Different profiles
export const usersDatabase: Record<string, User> = {
  'therese.moukala@gmail.com': {
    id: 'user-client-1',
    name: 'Thérèse Moukala',
    email: 'therese.moukala@gmail.com',
    phone: '+242 06 800 00 00',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    role: 'client',
    favorites: ['prop-1', 'prop-2', 'prop-9'],
    searches: [
      {
        id: 'search-1',
        name: 'Villa 4+ chambres Brazzaville',
        filters: { type: 'villa', city: 'Brazzaville', minBedrooms: 4 },
        alertEnabled: true,
      },
    ],
    notifications: true,
    createdAt: '2024-06-15',
  },
  'admin@forus.cg': {
    id: 'user-admin-1',
    name: 'Admin ForUs',
    email: 'admin@forus.cg',
    phone: '+242 06 999 00 00',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    role: 'admin',
    favorites: [],
    searches: [],
    notifications: true,
    createdAt: '2024-01-01',
  },
  'agence@immopremium.cg': {
    id: 'user-agency-1',
    name: 'Immo Premium Congo',
    email: 'agence@immopremium.cg',
    phone: '+242 06 700 00 00',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
    role: 'agency',
    favorites: [],
    searches: [],
    notifications: true,
    createdAt: '2023-06-01',
  },
};

// Passwords mock (in real app, this would be hashed)
export const passwordsDatabase: Record<string, string> = {
  'therese.moukala@gmail.com': 'client123',
  'admin@forus.cg': 'admin123',
  'agence@immopremium.cg': 'premium123',
};

// Current user mock (for backwards compatibility)
export const currentUser: User = usersDatabase['therese.moukala@gmail.com'];
