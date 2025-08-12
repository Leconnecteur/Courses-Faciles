// Base de données des magasins français avec leurs logos
export const stores = [
  {
    id: 'carrefour',
    name: 'Carrefour',
    logo: '/images/stores/carrefour.png'
  },
  {
    id: 'auchan',
    name: 'Auchan',
    logo: '/images/stores/auchan.jpg'
  },
  {
    id: 'leclerc',
    name: 'E.Leclerc',
    logo: '/images/stores/leclerc.jpeg'
  },
  {
    id: 'intermarche',
    name: 'Intermarché',
    logo: '/images/stores/intermarche.jpg'
  },
  {
    id: 'super-u',
    name: 'Super U',
    logo: '/images/stores/superu.png'
  },
  {
    id: 'casino',
    name: 'Casino',
    logo: '/images/stores/casino.jpg'
  },
  {
    id: 'monoprix',
    name: 'Monoprix',
    logo: '/images/stores/monoprix.jpg'
  },
  {
    id: 'franprix',
    name: 'Franprix',
    logo: '/images/stores/franprix.jpg'
  },
  {
    id: 'lidl',
    name: 'Lidl',
    logo: '/images/stores/lidl.png'
  },
  {
    id: 'aldi',
    name: 'Aldi',
    logo: '/images/stores/aldi.png'
  },
  {
    id: 'cora',
    name: 'Cora',
    logo: '/images/stores/cora.png'
  },
  {
    id: 'grand-frais',
    name: 'Grand Frais',
    logo: '/images/stores/grandfrais.jpg'
  },
  {
    id: 'picard',
    name: 'Picard',
    logo: '/images/stores/picard.jpeg'
  },
  {
    id: 'biocoop',
    name: 'Biocoop',
    logo: '/images/stores/biocoop.jpg'
  },
  {
    id: 'spar',
    name: 'Spar',
    logo: '/images/stores/spar.png'
  },
  {
    id: 'leroy-merlin',
    name: 'Leroy Merlin',
    logo: '/images/stores/leroymerlin.jpg'
  },
  {
    id: 'autre',
    name: 'Autre magasin',
    logo: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png'
  }
];

// Fonction pour obtenir un magasin par son ID
export const getStoreById = (storeId) => {
  return stores.find(store => store.id === storeId) || null;
};
