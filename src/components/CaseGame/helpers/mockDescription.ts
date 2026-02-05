//cuz we do not receive this from backend
export const mockDescription = (name: string) => {
  switch (name.toLowerCase()) {
    case 'food case':
      return 'Open the Food Case and discover delicious surprises, rare ingredients, sweet bonuses, and powerful kitchen rewards that boost your adventure.';
    case 'animal case':
      return 'Unlock the Animal Case to reveal cute companions, wild creatures, and mythical beasts ready to join your collection.';
    case 'sports case':
      return 'Open the Sports Case and score exciting gear, champion bonuses, and exclusive items that enhance performance.';
    case 'space case':
      return 'Launch the Space Case to uncover cosmic rewards, futuristic technology, and mysterious artifacts from distant galaxies.';
    default:
      return 'Open this case';
  }
};
