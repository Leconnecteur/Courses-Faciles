export const categoryKeywords = {
  'Fruits et Légumes': [
    'pomme', 'banane', 'orange', 'citron', 'fraise', 'poire', 'raisin',
    'tomate', 'carotte', 'salade', 'oignon', 'ail', 'poireau', 'courgette',
    'aubergine', 'poivron', 'champignon', 'patate', 'pomme de terre',
    'haricot', 'petit pois', 'brocoli', 'chou', 'épinard', 'avocat',
    'concombre', 'céleri', 'fruit', 'légume'
  ],
  'Produits Laitiers': [
    'lait', 'fromage', 'yaourt', 'yogourt', 'crème', 'beurre', 'margarine',
    'camembert', 'emmental', 'comté', 'raclette', 'mozzarella', 'parmesan',
    'chèvre', 'roquefort', 'crème fraîche', 'petit suisse', 'skyr', 'kéfir'
  ],
  'Viandes': [
    'poulet', 'boeuf', 'porc', 'veau', 'agneau', 'dinde', 'canard',
    'jambon', 'saucisse', 'steak', 'côtelette', 'viande hachée', 'merguez',
    'charcuterie', 'pâté', 'rôti', 'bacon', 'lardon'
  ],
  'Épicerie': [
    'pâte', 'riz', 'farine', 'sucre', 'sel', 'huile', 'vinaigre',
    'conserve', 'sauce', 'épice', 'gâteau', 'biscuit', 'chocolat',
    'céréale', 'confiture', 'miel', 'nutella', 'café', 'thé',
    'pâtes', 'spaghetti', 'ravioli', 'couscous', 'quinoa'
  ],
  'Boissons': [
    'eau', 'jus', 'soda', 'coca', 'sprite', 'fanta', 'orangina',
    'bière', 'vin', 'champagne', 'sirop', 'café', 'thé', 'tisane',
    'boisson', 'limonade', 'ice tea', 'coca-cola', 'perrier', 'evian',
    'vittel', 'badoit'
  ],
  'Hygiène': [
    'savon', 'shampooing', 'dentifrice', 'brosse à dents', 'déodorant',
    'papier toilette', 'mouchoir', 'coton', 'gel douche', 'rasoir',
    'serviette', 'lessive', 'nettoyant', 'désodorisant', 'shampoing',
    'hygiène', 'cosmétique', 'soin'
  ]
};

export function findCategory(itemName) {
  const normalizedName = itemName.toLowerCase().trim();
  
  // Chercher dans chaque catégorie
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (normalizedName.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  // Si aucune correspondance n'est trouvée
  return 'Autre';
}
