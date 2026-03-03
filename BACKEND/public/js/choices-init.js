document.addEventListener('DOMContentLoaded', function () { 
  const selects = document.querySelectorAll('.assignar-equip-select');

  selects.forEach(select => {
    new Choices(select, {
      removeItemButton: true,
      searchPlaceholderValue: 'Cerca usuari...',
      noResultsText: 'Cap resultat trobat',
      noChoicesText: 'Cap opció disponible',
      itemSelectText: '',
    });
  });
});
