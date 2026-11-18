/* ==========================================================================
   FOODWAY MENU DATA & FILTERING LOGIC
   ========================================================================== */

const FOODWAY_MENU = [
  // --- MUGHLAI SIGNATURES ---
  {
    id: 'f1',
    name: 'Chicken Foodway Special',
    category: 'mughlai',
    price: 450,
    rating: 4.9,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 2,
    desc: 'Our flagship slow-cooked signature gravy simmered fresh daily with secret royal Mughlai spices, cashews, and juicy chicken pieces.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f5',
    name: 'Chicken Shahi Murg (Full)',
    category: 'mughlai',
    price: 810,
    rating: 4.7,
    isBestseller: false,
    isVeg: false,
    spiceLevel: 1,
    desc: 'Fit for royalty — chicken cooked in rich saffron, almond, and cream gravy topped with gold-leaf boiled eggs.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f6',
    name: 'Mutton Bhuna Ghost',
    category: 'mughlai',
    price: 380,
    rating: 4.8,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 3,
    desc: 'Succulent pieces of mutton slow-cooked in a dark caramelized onion and roasted spice gravy until tender.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f13',
    name: 'Mutton Nalli Nihari',
    category: 'mughlai',
    price: 480,
    rating: 4.9,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 2,
    desc: 'Traditional overnight slow-cooked mutton shank stew garnished with fresh ginger, coriander, and lemon.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f14',
    name: 'Chicken Korma Royal',
    category: 'mughlai',
    price: 360,
    rating: 4.6,
    isBestseller: false,
    isVeg: false,
    spiceLevel: 1,
    desc: 'Classic Mughlai chicken in a rich cashew-yogurt gravy flavored with mace, cardamom, and rose water.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80'
  },

  // --- TANDOOR & KEBABS ---
  {
    id: 'f2',
    name: 'Chicken Foodway Dry Dhaba',
    category: 'tandoor',
    price: 400,
    rating: 4.9,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 3,
    desc: 'Robust street-style spicy roasted chicken tossed in thick dhaba masala, garlic, and fresh green chillies.',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f3',
    name: 'Chicken Malai Tandoori (Full)',
    category: 'tandoor',
    price: 540,
    rating: 4.7,
    isBestseller: false,
    isVeg: false,
    spiceLevel: 1,
    desc: 'Tender chicken marinated in rich cream, cardamom, cheese, and hung curd, clay-oven roasted to perfection.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f15',
    name: 'Chicken Tangdi Kebab (4 pcs)',
    category: 'tandoor',
    price: 390,
    rating: 4.8,
    isBestseller: false,
    isVeg: false,
    spiceLevel: 2,
    desc: 'Juicy chicken drumsticks marinated in spicy yogurt and roasted in tandoor until smoky.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f16',
    name: 'Paneer Tikka Angara',
    category: 'tandoor',
    price: 310,
    rating: 4.6,
    isBestseller: false,
    isVeg: true,
    spiceLevel: 3,
    desc: 'Fresh cottage cheese cubes marinated in fiery red spices and charcoal roasted with bell peppers.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f17',
    name: 'Mutton Seekh Kebab',
    category: 'tandoor',
    price: 420,
    rating: 4.8,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 2,
    desc: 'Minced mutton skewers infused with aromatic spices, mint, and cilantro, grilled over glowing coals.',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80'
  },

  // --- NORTH INDIAN & BIRYANI ---
  {
    id: 'f7',
    name: 'Chicken Tikka Biryani',
    category: 'north-indian',
    price: 340,
    rating: 4.8,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 2,
    desc: 'Aromatic long-grain Basmati rice dum-cooked with smoky tandoori chicken tikka pieces and saffron infusion.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f8',
    name: 'Paneer Tikka Masala',
    category: 'north-indian',
    price: 300,
    rating: 4.5,
    isBestseller: false,
    isVeg: true,
    spiceLevel: 2,
    desc: 'Grilled cottage cheese cubes simmered in a luscious orange tomato cream gravy with fenugreek leaves.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f18',
    name: 'Mutton Dum Biryani',
    category: 'north-indian',
    price: 390,
    rating: 4.9,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 2,
    desc: 'Royal Hyderabadi style marinated mutton and basmati rice sealed and slow cooked in dum style.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f19',
    name: 'Dal Makhani Gold',
    category: 'north-indian',
    price: 240,
    rating: 4.7,
    isBestseller: true,
    isVeg: true,
    spiceLevel: 1,
    desc: 'Black lentils slow cooked overnight on charcoal, finished with white butter and fresh churned cream.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f20',
    name: 'Butter Garlic Naan (2 Pcs)',
    category: 'north-indian',
    price: 110,
    rating: 4.8,
    isBestseller: false,
    isVeg: true,
    spiceLevel: 0,
    desc: 'Soft leavened tandoori bread brushed with melted butter and sprinkled with roasted minced garlic.',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80'
  },

  // --- CHINESE ---
  {
    id: 'f9',
    name: 'Paneer Crispy',
    category: 'chinese',
    price: 280,
    rating: 4.6,
    isBestseller: false,
    isVeg: true,
    spiceLevel: 2,
    desc: 'Crispy fried paneer tossed in sweet chili, soy sauce, sesame seeds, and crunchy spring onions.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f21',
    name: 'Chicken Schezwan Triple Rice',
    category: 'chinese',
    price: 350,
    rating: 4.8,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 3,
    desc: 'Combo of fried rice, fried noodles, spicy gravy, and fried egg — Mumbai street classic.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f22',
    name: 'Chicken Lollipop Oil Fry (8 pcs)',
    category: 'chinese',
    price: 290,
    rating: 4.9,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 2,
    desc: 'Crispy seasoned chicken wings served with fiery homemade Schezwan dipping sauce.',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f23',
    name: 'Veg Manchurian Dry',
    category: 'chinese',
    price: 230,
    rating: 4.5,
    isBestseller: false,
    isVeg: true,
    spiceLevel: 2,
    desc: 'Deep fried vegetable dumplings tossed in tangy soy-garlic-ginger glaze with spring onion.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80'
  },

  // --- SEAFOOD ---
  {
    id: 'f10',
    name: 'Prawns Schezwan Hakka Noodles',
    category: 'seafood',
    price: 340,
    rating: 4.7,
    isBestseller: false,
    isVeg: false,
    spiceLevel: 3,
    desc: 'Wok-tossed noodles with fresh sea prawns, bell peppers, and fiery homemade Schezwan sauce.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f24',
    name: 'Prawns Koliwada Fry',
    category: 'seafood',
    price: 420,
    rating: 4.8,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 3,
    desc: 'Crispy batter-fried fresh prawns marinated in red chili, carom seeds, and lemon juice.',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f25',
    name: 'Surmai Tawa Fry',
    category: 'seafood',
    price: 460,
    rating: 4.7,
    isBestseller: false,
    isVeg: false,
    spiceLevel: 2,
    desc: 'Fresh King Fish slice coated with spicy Malvani masala and semolina, shallow fried on iron tawa.',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80'
  },

  // --- COMBOS & PLATTERS ---
  {
    id: 'f4',
    name: 'Foodway Special Kabsa',
    category: 'combos',
    price: 810,
    rating: 4.9,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 2,
    desc: 'Grand Arabic-style fragrant rice platter topped with whole tandoori chicken, fried nuts, and signature tomato chutney.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f11',
    name: 'Butter Chicken with Naan Combo',
    category: 'combos',
    price: 360,
    rating: 4.9,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 1,
    desc: 'Classic velvet rich Butter Chicken served alongside 2 piping hot Butter Garlic Naans & fresh salad.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f26',
    name: 'Royal Tandoori Platter (Assorted)',
    category: 'combos',
    price: 950,
    rating: 4.9,
    isBestseller: true,
    isVeg: false,
    spiceLevel: 2,
    desc: 'Platter of Chicken Tikka, Malai Kebab, Mutton Seekh, Tangdi Kebab, and Fish Koliwada with mint chutney.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80'
  },

  // --- DESSERTS ---
  {
    id: 'f12',
    name: 'Caramel Custard',
    category: 'desserts',
    price: 120,
    rating: 4.9,
    isBestseller: true,
    isVeg: false, // Corrected: Egg-based custard is non-veg in Indian dining context
    spiceLevel: 0,
    desc: 'Our signature melt-in-the-mouth silky vanilla egg custard topped with dark amber caramelized sugar syrup.',
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f27',
    name: 'Gulab Jamun with Rabdi (2 pcs)',
    category: 'desserts',
    price: 140,
    rating: 4.8,
    isBestseller: true,
    isVeg: true,
    spiceLevel: 0,
    desc: 'Warm khoya dumplings soaked in cardamom sugar syrup, served over thick chilled condensed milk rabdi.',
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f28',
    name: 'Shahi Tukda Royal',
    category: 'desserts',
    price: 160,
    rating: 4.7,
    isBestseller: false,
    isVeg: true,
    spiceLevel: 0,
    desc: 'Crispy fried bread soaked in saffron syrup, topped with thick rabdi, silver leaf, and crushed pistachios.',
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=800&q=80'
  }
];

function renderMenuItems(items, containerId = 'menuGridContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-secondary);">
        <i class="fa-solid fa-utensils" style="font-size: 3rem; color: var(--gold-primary); margin-bottom: 15px;"></i>
        <h3>No dishes found matching your search.</h3>
        <p>Try searching for another dish or selecting a different category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(dish => `
    <div class="dish-card reveal">
      <div class="dish-img-wrapper">
        <img src="${dish.image}" alt="${dish.name}" loading="lazy">
        <div class="dish-badges">
          ${dish.isBestseller ? `<span class="badge badge-bestseller"><i class="fa-solid fa-fire"></i> Chef's Choice</span>` : ''}
          <span class="badge ${dish.isVeg ? 'badge-veg' : 'badge-nonveg'}">
            ${dish.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>
      </div>
      <div class="dish-details">
        <div class="dish-title-row">
          <h3 class="dish-name">${dish.name}</h3>
          <span class="dish-price">₹${dish.price}</span>
        </div>
        <p class="dish-desc">${dish.desc}</p>
        <div class="dish-meta-row">
          <span style="font-size:0.85rem; color:#f4c430;">
            <i class="fa-solid fa-star"></i> ${dish.rating}
          </span>
          <button class="add-to-cart-btn" onclick="FOODWAY_CART_ADD('${dish.id}')">
            <i class="fa-solid fa-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Global safe caller for cart
window.FOODWAY_CART_ADD = function(id) {
  if (window.FoodwayCart?.addToCart) {
    window.FoodwayCart.addToCart(id);
  } else if (typeof addToCart === 'function') {
    addToCart(id);
  }
};

function initMenuFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('menuSearchInput');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let filtered = FOODWAY_MENU;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
      );
    }

    renderMenuItems(filtered);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      applyFilters();
    });
  }

  // Initial render
  renderMenuItems(FOODWAY_MENU);
}

document.addEventListener('DOMContentLoaded', () => {
  initMenuFilters();

  // Populate featured dishes on homepage (only bestsellers)
  const featuredContainer = document.getElementById('featuredDishesContainer');
  if (featuredContainer) {
    const featured = FOODWAY_MENU.filter(d => d.isBestseller).slice(0, 6);
    renderMenuItems(featured, 'featuredDishesContainer');
  }
});

// Expose menu globally for cart system
window.FOODWAY_MENU = FOODWAY_MENU;
