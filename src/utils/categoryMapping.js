// Système de catégorisation intelligent avec priorités
export const categoryKeywords = {
  'Fruits': {
    priority: 10,
    keywords: [
      'pomme', 'pommes', 'banane', 'bananes', 'orange', 'oranges', 'citron', 'citrons',
      'fraise', 'fraises', 'poire', 'poires', 'raisin', 'raisins', 'kiwi', 'kiwis',
      'mangue', 'mangues', 'ananas', 'melon', 'pastèque', 'pêche', 'pêches',
      'abricot', 'abricots', 'prune', 'prunes', 'cerise', 'cerises', 'myrtille', 'myrtilles',
      'framboise', 'framboises', 'mûre', 'mûres', 'cassis', 'groseille', 'groseilles',
      'clémentine', 'clémentines', 'mandarine', 'mandarines', 'pamplemousse', 'pamplemousses',
      'grenade', 'grenades', 'figue', 'figues', 'datte', 'dattes', 'litchi', 'litchis',
      'fruit de la passion', 'papaye', 'goyave', 'fruit', 'fruits'
    ]
  },
  'Légumes': {
    priority: 10,
    keywords: [
      'tomate', 'tomates', 'carotte', 'carottes', 'salade', 'salades', 'laitue',
      'oignon', 'oignons', 'ail', 'poireau', 'poireaux', 'courgette', 'courgettes',
      'aubergine', 'aubergines', 'poivron', 'poivrons', 'champignon', 'champignons',
      'patate', 'patates', 'pomme de terre', 'pommes de terre', 'haricot', 'haricots',
      'petit pois', 'petits pois', 'pois', 'brocoli', 'brocolis', 'chou', 'choux',
      'chou-fleur', 'épinard', 'épinards', 'avocat', 'avocats', 'concombre', 'concombres',
      'céleri', 'navet', 'navets', 'radis', 'betterave', 'betteraves', 'endive', 'endives',
      'fenouil', 'artichaut', 'artichauts', 'asperge', 'asperges', 'courge', 'courges',
      'potiron', 'potimarron', 'butternut', 'maïs', 'blé', 'soja', 'gingembre',
      'échalote', 'échalotes', 'ciboulette', 'persil', 'basilic', 'coriandre', 'menthe',
      'roquette', 'mâche', 'cresson', 'légume', 'légumes'
    ]
  },
  'Viandes & Volailles': {
    priority: 9,
    keywords: [
      'poulet', 'boeuf', 'bœuf', 'porc', 'veau', 'agneau', 'dinde', 'canard',
      'steak', 'steaks', 'côtelette', 'côtelettes', 'viande hachée', 'haché', 'hachée',
      'rôti', 'escalope', 'escalopes', 'filet', 'filets', 'cuisse', 'cuisses',
      'blanc de poulet', 'blanc de dinde', 'magret', 'confit', 'lapin', 'pintade',
      'caille', 'pigeon', 'viande', 'viandes', 'volaille', 'volailles'
    ]
  },
  'Charcuterie': {
    priority: 9,
    keywords: [
      'jambon', 'saucisse', 'saucisses', 'merguez', 'chipolata', 'chipolatas',
      'charcuterie', 'pâté', 'terrine', 'bacon', 'lardon', 'lardons',
      'saucisson', 'salami', 'chorizo', 'mortadelle', 'rillettes', 'boudin',
      'andouille', 'andouillette', 'coppa', 'bresaola', 'pancetta', 'prosciutto'
    ]
  },
  'Poissons & Fruits de mer': {
    priority: 9,
    keywords: [
      'saumon', 'thon', 'cabillaud', 'colin', 'lieu', 'merlu', 'dorade', 'daurade',
      'bar', 'loup', 'truite', 'sole', 'raie', 'sardine', 'sardines', 'maquereau',
      'anchois', 'hareng', 'morue', 'espadon', 'flétan', 'turbot', 'rouget',
      'crevette', 'crevettes', 'gambas', 'scampi', 'homard', 'langouste', 'langoustine',
      'crabe', 'tourteau', 'araignée de mer', 'huître', 'huîtres', 'moule', 'moules',
      'coque', 'coques', 'palourde', 'palourdes', 'bulot', 'bulots', 'bigorneau',
      'calamar', 'calamars', 'seiche', 'poulpe', 'encornet', 'poisson', 'poissons',
      'fruit de mer', 'fruits de mer', 'surimi'
    ]
  },
  'Produits Laitiers & Œufs': {
    priority: 8,
    keywords: [
      'lait', 'fromage', 'fromages', 'yaourt', 'yaourts', 'yogourt', 'yogourts',
      'crème', 'crème fraîche', 'beurre', 'margarine', 'camembert', 'emmental',
      'comté', 'raclette', 'mozzarella', 'parmesan', 'chèvre', 'roquefort',
      'petit suisse', 'skyr', 'kéfir', 'gruyère', 'cantal', 'reblochon',
      'brie', 'munster', 'maroilles', 'bleu', 'gorgonzola', 'feta', 'ricotta',
      'mascarpone', 'philadelphia', 'boursin', 'kiri', 'vache qui rit', 'babybel',
      'oeuf', 'oeufs', 'œuf', 'œufs', 'lait de vache', 'lait de chèvre',
      'lait d\'amande', 'lait de soja', 'lait d\'avoine', 'lait de coco',
      'crème liquide', 'crème épaisse', 'faisselle', 'fromage blanc', 'petit-suisse'
    ]
  },
  'Boulangerie & Pâtisserie': {
    priority: 8,
    keywords: [
      'pain', 'baguette', 'baguettes', 'pain de mie', 'pain complet', 'pain aux céréales',
      'brioche', 'brioches', 'croissant', 'croissants', 'pain au chocolat', 'chocolatine',
      'viennoiserie', 'viennoiseries', 'gâteau', 'gâteaux', 'tarte', 'tartes',
      'éclair', 'éclairs', 'chouquette', 'chouquettes', 'macaron', 'macarons',
      'cookie', 'cookies', 'muffin', 'muffins', 'brownie', 'brownies', 'donut', 'donuts',
      'flan', 'clafoutis', 'financier', 'madeleine', 'madeleines', 'cake', 'cakes',
      'quatre-quarts', 'pain d\'épices', 'spéculoos', 'pain grillé', 'biscottes'
    ]
  },
  'Épicerie Salée': {
    priority: 7,
    keywords: [
      'pâte', 'pâtes', 'spaghetti', 'spaghettis', 'tagliatelle', 'tagliatelles',
      'penne', 'fusilli', 'farfalle', 'ravioli', 'raviolis', 'tortellini',
      'lasagne', 'lasagnes', 'cannelloni', 'macaroni', 'coquillette', 'coquillettes',
      'riz', 'riz basmati', 'riz complet', 'riz thaï', 'riz arborio', 'risotto',
      'couscous', 'semoule', 'quinoa', 'boulgour', 'blé', 'orge', 'épeautre',
      'lentille', 'lentilles', 'pois chiche', 'pois chiches', 'haricot sec', 'haricots secs',
      'fève', 'fèves', 'flageolet', 'flageolets', 'conserve', 'conserves',
      'sauce tomate', 'coulis', 'concentré de tomate', 'ketchup', 'mayonnaise',
      'moutarde', 'cornichon', 'cornichons', 'olive', 'olives', 'câpre', 'câpres',
      'huile', 'huile d\'olive', 'huile de tournesol', 'huile de colza', 'vinaigre',
      'vinaigre balsamique', 'sel', 'poivre', 'épice', 'épices', 'herbe', 'herbes',
      'cube', 'bouillon', 'fond', 'soupe', 'potage', 'velouté'
    ]
  },
  'Épicerie Sucrée': {
    priority: 7,
    keywords: [
      'sucre', 'sucre en poudre', 'sucre glace', 'cassonade', 'miel', 'sirop d\'érable',
      'confiture', 'confitures', 'gelée', 'marmelade', 'pâte à tartiner', 'nutella',
      'chocolat', 'chocolat noir', 'chocolat au lait', 'chocolat blanc', 'cacao',
      'poudre de cacao', 'pépite', 'pépites de chocolat', 'biscuit', 'biscuits',
      'gâteau sec', 'petit beurre', 'prince', 'oreo', 'granola', 'muesli',
      'céréale', 'céréales', 'corn flakes', 'chocapic', 'nesquik', 'frosties',
      'barre céréales', 'barre de céréales', 'bonbon', 'bonbons', 'caramel', 'caramels',
      'guimauve', 'chamallow', 'réglisse', 'chewing-gum', 'dragée', 'dragées',
      'farine', 'farine de blé', 'farine complète', 'levure', 'levure chimique',
      'bicarbonate', 'vanille', 'extrait de vanille', 'sucre vanillé', 'arôme'
    ]
  },
  'Boissons': {
    priority: 6,
    keywords: [
      'eau', 'eau plate', 'eau gazeuse', 'eau pétillante', 'perrier', 'evian',
      'vittel', 'badoit', 'contrex', 'hépar', 'volvic', 'cristalline',
      'jus', 'jus d\'orange', 'jus de pomme', 'jus de raisin', 'jus multifruits',
      'nectar', 'smoothie', 'soda', 'coca', 'coca-cola', 'pepsi', 'sprite',
      'fanta', 'orangina', 'schweppes', 'limonade', 'ice tea', 'thé glacé',
      'sirop', 'sirop de menthe', 'sirop de grenadine', 'diabolo',
      'café', 'café moulu', 'café en grain', 'café soluble', 'nespresso', 'dosette',
      'thé', 'thé vert', 'thé noir', 'tisane', 'infusion', 'verveine', 'camomille',
      'bière', 'bières', 'vin', 'vin rouge', 'vin blanc', 'vin rosé', 'champagne',
      'cidre', 'apéritif', 'pastis', 'ricard', 'whisky', 'rhum', 'vodka', 'gin',
      'boisson', 'boissons', 'boisson énergisante', 'red bull', 'monster'
    ]
  },
  'Surgelés': {
    priority: 8,
    keywords: [
      'surgelé', 'surgelés', 'congelé', 'congelés', 'glace', 'glaces', 'sorbet', 'sorbets',
      'crème glacée', 'bâtonnet', 'esquimau', 'magnum', 'ben & jerry', 'häagen-dazs',
      'pizza surgelée', 'pizza', 'pizzas', 'frite', 'frites', 'frites surgelées',
      'poisson pané', 'nugget', 'nuggets', 'cordon bleu', 'légumes surgelés',
      'haricot vert surgelé', 'petit pois surgelé', 'épinard surgelé',
      'poêlée', 'wok', 'plat préparé surgelé', 'lasagne surgelée'
    ]
  },
  'Hygiène & Beauté': {
    priority: 5,
    keywords: [
      'savon', 'savons', 'gel douche', 'shampooing', 'shampoing', 'après-shampooing',
      'après-shampoing', 'masque capillaire', 'dentifrice', 'brosse à dents',
      'fil dentaire', 'bain de bouche', 'déodorant', 'déo', 'anti-transpirant',
      'parfum', 'eau de toilette', 'eau de cologne', 'crème', 'crème hydratante',
      'crème de jour', 'crème de nuit', 'lait corporel', 'huile de corps',
      'démaquillant', 'coton', 'coton-tige', 'lingette', 'lingettes',
      'rasoir', 'mousse à raser', 'gel de rasage', 'après-rasage', 'lame',
      'épilateur', 'cire', 'maquillage', 'rouge à lèvres', 'mascara', 'fond de teint',
      'vernis', 'dissolvant', 'cosmétique', 'cosmétiques', 'soin', 'soins'
    ]
  },
  'Entretien & Maison': {
    priority: 5,
    keywords: [
      'lessive', 'lessive liquide', 'lessive en poudre', 'capsule', 'skip', 'ariel',
      'assouplissant', 'adoucissant', 'détachant', 'eau de javel', 'javel',
      'nettoyant', 'produit d\'entretien', 'spray', 'cif', 'ajax', 'mr propre',
      'liquide vaisselle', 'produit vaisselle', 'tablette lave-vaisselle', 'finish',
      'éponge', 'éponges', 'lavette', 'chiffon', 'microfibre', 'serpillière',
      'balai', 'pelle', 'sac poubelle', 'sacs poubelle', 'papier toilette',
      'papier wc', 'essuie-tout', 'sopalin', 'mouchoir', 'mouchoirs', 'kleenex',
      'allumette', 'allumettes', 'bougie', 'bougies', 'pile', 'piles', 'ampoule',
      'désodorisant', 'parfum d\'intérieur', 'febreze', 'insecticide', 'anti-moustique'
    ]
  },
  'Bébé & Puériculture': {
    priority: 9,
    keywords: [
      'couche', 'couches', 'pampers', 'lingette bébé', 'lingettes bébé',
      'lait infantile', 'lait bébé', 'biberon', 'tétine', 'sucette',
      'petit pot', 'petits pots', 'compote bébé', 'purée bébé',
      'céréale bébé', 'céréales bébé', 'biscuit bébé', 'biscuits bébé',
      'gel lavant bébé', 'shampooing bébé', 'liniment', 'crème pour le change',
      'bébé', 'nourrisson', 'enfant'
    ]
  },
  'Animalerie': {
    priority: 9,
    keywords: [
      'croquette', 'croquettes', 'pâtée', 'nourriture chat', 'nourriture chien',
      'friandise chien', 'friandise chat', 'litière', 'litière chat',
      'whiskas', 'friskies', 'royal canin', 'purina', 'sheba',
      'animal', 'animaux', 'chien', 'chat', 'oiseau'
    ]
  }
};

export function findCategory(itemName) {
  const normalizedName = itemName.toLowerCase().trim();
  
  // Tableau pour stocker les correspondances avec leur priorité
  const matches = [];
  
  // Chercher dans chaque catégorie
  for (const [category, data] of Object.entries(categoryKeywords)) {
    for (const keyword of data.keywords) {
      const normalizedKeyword = keyword.toLowerCase();
      
      // Vérifier si le mot-clé correspond
      if (normalizedName.includes(normalizedKeyword)) {
        // Calculer un score : priorité + bonus si c'est une correspondance exacte
        let score = data.priority;
        
        // Bonus si le mot-clé correspond exactement au nom
        if (normalizedName === normalizedKeyword) {
          score += 20;
        }
        // Bonus si le nom commence par le mot-clé
        else if (normalizedName.startsWith(normalizedKeyword)) {
          score += 10;
        }
        // Bonus si le mot-clé est long (plus spécifique)
        score += keyword.length * 0.1;
        
        matches.push({ category, score, keyword });
      }
    }
  }
  
  // Si aucune correspondance n'est trouvée
  if (matches.length === 0) {
    return 'Autre';
  }
  
  // Trier par score décroissant et retourner la meilleure catégorie
  matches.sort((a, b) => b.score - a.score);
  
  console.log(`Catégorisation de "${itemName}":`, matches[0].category, `(score: ${matches[0].score.toFixed(1)}, mot-clé: "${matches[0].keyword}")`);
  
  return matches[0].category;
}

// Fonction pour obtenir toutes les catégories disponibles
export function getAllCategories() {
  return Object.keys(categoryKeywords).concat(['Autre']);
}
