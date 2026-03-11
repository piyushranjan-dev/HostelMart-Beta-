// ─── STATE ───
let listings = [];
let cart = [];
let saved = [];
let currentModalId = null;
let selectedCondition = '';
let selectedEmoji = '📦';
let currentTab = 'active';

// ─── SEED DATA ───
const seedListings = [
  { id: 1, title: 'Engineering Physics Textbook', cat: 'books', emoji: '📚', price: 180, origPrice: 550, condition: 'Good', desc: 'Halliday & Resnick 10th edition. Used for 2 semesters. Some pencil marks but fully readable. Great for 1st year.', seller: 'Arjun S', room: 'B-204', contact: '9876543210', badge: 'hot', timestamp: Date.now() - 1 * 3600000, mine: false },
  { id: 2, title: 'Soleus Fan (Table)', cat: 'appliances', emoji: '💨', price: 350, origPrice: 700, condition: 'Good', desc: 'Works perfectly. Selling because I bought an AC cooler. All speeds functional, no noise.', seller: 'Priya M', room: 'A-101', contact: '9812345678', badge: 'new', timestamp: Date.now() - 2 * 3600000, mine: false },
  { id: 3, title: 'HP Laptop 15" (i5 8th Gen)', cat: 'electronics', emoji: '💻', price: 18500, origPrice: 38000, condition: 'Good', desc: '8GB RAM, 512 SSD. Battery backup ~3hrs. Small dent on lid but display is perfect. Charger included.', seller: 'Rohan K', room: 'C-312', contact: '9876001234', badge: 'hot', timestamp: Date.now() - 3 * 3600000, mine: true },
  { id: 4, title: 'Foldable Study Chair', cat: 'furniture', emoji: '🪑', price: 600, origPrice: 1200, condition: 'Like New', desc: 'Bought this semester. Moving out. Sturdy, ergonomic, fits under standard hostel desk. White color.', seller: 'Nisha T', room: 'D-207', contact: '9845678901', badge: 'new', timestamp: Date.now() - 5 * 3600000, mine: true },
  { id: 5, title: 'Football (Adidas)', cat: 'sports', emoji: '⚽', price: 250, origPrice: 500, condition: 'Fair', desc: 'Used regularly but still good for playing. Size 5. Slightly worn on one side.', seller: 'Dev P', room: 'A-204', contact: '9800112233', badge: 'used', timestamp: Date.now() - 8 * 3600000, mine: false },
  { id: 6, title: 'Data Structures (Cormen)', cat: 'books', emoji: '📚', price: 220, origPrice: 900, condition: 'Good', desc: 'CLRS 3rd edition. Essential for CS students. Few highlighted sections, good condition overall.', seller: 'Ananya R', room: 'B-110', contact: '9888234567', badge: null, timestamp: Date.now() - 10 * 3600000, mine: false },
  { id: 7, title: 'Electric Kettle 1.5L', cat: 'appliances', emoji: '🍵', price: 400, origPrice: 800, condition: 'Like New', desc: 'Used only 3 months. Fast heating, auto shutoff. Perfect for hostel life. No rust or stains.', seller: 'Kartik B', room: 'E-301', contact: '9890002345', badge: 'new', timestamp: Date.now() - 12 * 3600000, mine: false },
  { id: 8, title: 'Nike Running Shoes (Size 9)', cat: 'clothing', emoji: '👟', price: 1200, origPrice: 3500, condition: 'Good', desc: 'Bought 6 months ago. Used only for running. No tears. Clean, looks almost new. Size 9 UK.', seller: 'Sneha V', room: 'F-102', contact: '9876123450', badge: null, timestamp: Date.now() - 15 * 3600000, mine: false },
  { id: 9, title: 'Graphic Novel Bundle (5 books)', cat: 'books', emoji: '📚', price: 300, origPrice: 1200, condition: 'Like New', desc: 'Watchmen, Maus Vol 1&2, Persepolis, Sandman Vol 1. All in great condition. Selling as bundle only.', seller: 'Tanvi G', room: 'A-303', contact: '9812300001', badge: 'urgent', timestamp: Date.now() - 20 * 3600000, mine: false },
  { id: 10, title: 'Sketchbook & Art Supplies Kit', cat: 'stationery', emoji: '✏️', price: 250, origPrice: 600, condition: 'Good', desc: '2 A3 sketchbooks, 24 color pencils, 6 watercolor tubes, 2 paintbrushes. Everything usable.', seller: 'Meera S', room: 'B-202', contact: '9900001234', badge: null, timestamp: Date.now() - 24 * 3600000, mine: false },
  { id: 11, title: 'Yoga Mat (6mm thick)', cat: 'sports', emoji: '🧘', price: 200, origPrice: 450, condition: 'Good', desc: 'Anti-slip, 6mm thick. Used for 4 months. Clean and odor-free. Free carrying bag included.', seller: 'Kavitha L', room: 'D-105', contact: '9876000011', badge: null, timestamp: Date.now() - 30 * 3600000, mine: false },
  { id: 12, title: 'Bluetooth Speaker (JBL Go 2)', cat: 'electronics', emoji: '🔊', price: 800, origPrice: 2000, condition: 'Like New', desc: 'JBL Go 2. Works perfectly, battery holds ~5 hours. Bought but barely used. All original accessories.', seller: 'Farhan A', room: 'C-201', contact: '9811122233', badge: 'new', timestamp: Date.now() - 35 * 3600000, mine: false }
];

// ─── INIT ───
function init() {
  listings = [...seedListings];

  // Setup emoji picker
  const emojis = ['📚','💻','🛋️','🍳','👕','⚽','✏️','📦','🎒','🖊️','📐','🎮','🔌','💡','🧲','📷','🎵','🎯','🏋️','🚲','🧴','🍵','🪴','📱'];
  const picker = document.getElementById('emojiPicker');
  if (picker) {
    picker.innerHTML = emojis.map(e =>
      `<div class="emoji-opt ${selectedEmoji === e ? 'selected' : ''}" onclick="pickEmoji('${e}', this)">${e}</div>`
    ).join('');
  }

  renderListings();
  updateCartCount();
  updateMyPage();
}

document.addEventListener('DOMContentLoaded', init);

// ─── LISTINGS RENDER ───
function renderListings() {
  const grid = document.getElementById('listingsGrid');
  const search = document.getElementById('searchInput').value.toLowerCase();
  const sort = document.getElementById('sortSelect').value;
  const cat = document.getElementById('catFilter').value;

  let filtered = listings.filter(l => {
    const matchSearch =
      l.title.toLowerCase().includes(search) ||
      l.desc.toLowerCase().includes(search) ||
      l.seller.toLowerCase().includes(search);
    const matchCat = cat === 'all' || l.cat === cat;
    return matchSearch && matchCat;
  });

  if (sort === 'price-low') {
    filtered.sort((a,b) => a.price - b.price);
  } else if (sort === 'price-high') {
    filtered.sort((a,b) => b.price - a.price);
  } else {
    filtered.sort((a,b) => b.timestamp - a.timestamp);
  }

  document.getElementById('resultNum').textContent = filtered.length;
  const statEl = document.getElementById('stat-listings');
  if (statEl) statEl.innerHTML = `${listings.length}<span>+</span>`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="big-emoji">🤷‍♂️</div>
        <p>No items found. Try a different search or category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(l => `
    <div class="product-card" onclick="openModal(${l.id})">
      ${l.badge ? `<div class="card-badge badge-${l.badge}">${l.badge === 'hot' ? 'Hot' : l.badge === 'new' ? 'New' : l.badge === 'urgent' ? 'Urgent' : 'Used'}</div>` : ''}
      <div class="card-wishlist ${saved.includes(l.id) ? 'active' : ''}" onclick="event.stopPropagation(); toggleWish(${l.id}, this)">${saved.includes(l.id) ? '♥' : '♡'}</div>
      <div class="card-img">
        <div class="card-img-bg">${l.emoji}</div>
        <div>${l.emoji}</div>
      </div>
      <div class="card-body">
        <div class="card-cat">${getCatLabel(l.cat)}</div>
        <div class="card-title">${l.title}</div>
        <div class="card-desc">${l.desc.substring(0, 80)}...</div>
        <div class="card-footer">
          <div>
            <span class="card-price">₹${l.price.toLocaleString()}</span>
            ${l.origPrice ? `<span class="card-price-og">₹${l.origPrice.toLocaleString()}</span>` : ''}
          </div>
          <div class="card-seller">
            <div class="seller-avatar" style="background:${getColor(l.seller)};color:#000;">${l.seller[0]}</div>
            <div>${l.seller}</div>
          </div>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn btn-ghost" onclick="event.stopPropagation(); messageSellerById(${l.id})">💬 Chat</button>
        <button class="btn btn-primary" onclick="event.stopPropagation(); addToCartById(${l.id})">🛒 Cart</button>
      </div>
    </div>
  `).join('');
}

function filterListings() {
  const externalSort = document.getElementById('sortSelect2');
  if (externalSort) {
    document.getElementById('sortSelect').value = externalSort.value;
  }
  renderListings();
}

function setCat(cat, el) {
  document.getElementById('catFilter').value = cat;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  filterListings();
}

function getCatLabel(cat) {
  const map = {
    books: 'Books & Notes',
    electronics: 'Electronics',
    furniture: 'Furniture',
    appliances: 'Appliances',
    clothing: 'Clothing',
    sports: 'Sports',
    stationery: 'Stationery',
    other: 'Other'
  };
  return map[cat] || cat;
}

function getColor(name) {
  const colors = ['#f5c842','#4ecdc4','#ff6b35','#56cf8a','#a78bfa','#f472b6','#38bdf8'];
  return colors[name.charCodeAt(0) % colors.length];
}

// ─── MODAL ───
function openModal(id) {
  const l = listings.find(x => x.id === id);
  if (!l) return;
  currentModalId = id;

  const bg = document.getElementById('modalImg');
  bg.innerHTML = `
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:9rem;opacity:0.15;filter:blur(12px);">${l.emoji}</div>
    <div style="font-size:7rem;position:relative;">${l.emoji}</div>
  `;

  document.getElementById('modalTitle').textContent = l.title;
  document.getElementById('modalPrice').textContent = `₹${l.price.toLocaleString()}`;
  if (l.origPrice) {
    const off = Math.round((1 - l.price / l.origPrice) * 100);
    document.getElementById('modalPriceOg').textContent = `₹${l.origPrice.toLocaleString()} (${off}% off)`;
  } else {
    document.getElementById('modalPriceOg').textContent = '';
  }

  document.getElementById('modalDesc').textContent = l.desc;
  document.getElementById('modalTags').innerHTML = [
    `<span class="modal-tag">${getCatLabel(l.cat)}</span>`,
    `<span class="modal-tag">${l.condition}</span>`,
    `<span class="modal-tag">Room ${l.room}</span>`,
    l.badge ? `<span class="modal-tag" style="border-color:var(--accent);color:var(--accent);">${l.badge.toUpperCase()}</span>` : ''
  ].filter(Boolean).join('');

  const av = document.getElementById('modalSellerAv');
  av.textContent = l.seller[0];
  av.style.background = getColor(l.seller);
  av.style.color = '#000';

  document.getElementById('modalSellerName').textContent = l.seller;
  document.getElementById('modalSellerInfo').textContent = `Room ${l.room} • Contact: ${l.contact}`;

  const wishBtn = document.getElementById('modalWishBtn');
  const isSaved = saved.includes(id);
  wishBtn.textContent = isSaved ? '♥ Saved' : '♡ Save';
  wishBtn.style.color = isSaved ? 'var(--danger)' : 'inherit';

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
  currentModalId = null;
}

document.getElementById('productModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ─── WISHLIST ───
function toggleWish(id, el) {
  if (saved.includes(id)) {
    saved = saved.filter(x => x !== id);
    if (el) {
      el.textContent = '♡';
      el.classList.remove('active');
    }
    showToast('Removed from saved', 'info');
  } else {
    saved.push(id);
    if (el) {
      el.textContent = '♥';
      el.classList.add('active');
    }
    showToast('Saved to wishlist!', 'success');
  }
  updateMyPage();
}

function toggleWishFromModal() {
  if (!currentModalId) return;
  const id = currentModalId;
  const btn = document.getElementById('modalWishBtn');
  if (saved.includes(id)) {
    saved = saved.filter(x => x !== id);
    btn.textContent = '♡ Save';
    btn.style.color = 'inherit';
    showToast('Removed from saved', 'info');
  } else {
    saved.push(id);
    btn.textContent = '♥ Saved';
    btn.style.color = 'var(--danger)';
    showToast('Saved to wishlist!', 'success');
  }
  updateMyPage();
  renderListings();
}

// ─── CART ───
function addToCartById(id) {
  if (cart.includes(id)) {
    showToast('Already in cart!', 'info');
    return;
  }
  const l = listings.find(x => x.id === id);
  if (!l) return;
  cart.push(id);
  updateCartCount();
  showToast(`${l.title} added to cart!`, 'success');
}

function addToCartFromModal() {
  if (!currentModalId) return;
  addToCartById(currentModalId);
}

function removeFromCart(id) {
  cart = cart.filter(x => x !== id);
  updateCartCount();
  renderCart();
  showToast('Removed from cart', 'info');
}

function updateCartCount() {
  const el = document.getElementById('cartCount');
  if (el) el.textContent = cart.length;
}

function renderCart() {
  const el = document.getElementById('cartContent');
  if (!el) return;

  if (cart.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="big-emoji">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Browse listings and add items to your cart.</p>
        <button class="btn btn-primary" onclick="showPage('home')">Browse Items</button>
      </div>
    `;
    return;
  }

  const cartItems = cart
    .map(id => listings.find(l => l.id === id))
    .filter(Boolean);
  const total = cartItems.reduce((s, l) => s + l.price, 0);

  el.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        ${cartItems.map(l => `
          <div class="cart-item">
            <div class="cart-item-emoji">${l.emoji}</div>
            <div class="cart-item-info">
              <div class="cart-item-title">${l.title}</div>
              <div class="cart-item-seller">Seller: ${l.seller} • Room ${l.room}</div>
            </div>
            <div class="cart-item-price">₹${l.price.toLocaleString()}</div>
            <button class="cart-item-remove" onclick="removeFromCart(${l.id})">✕</button>
          </div>
        `).join('')}
      </div>
      <div class="cart-summary">
        <div class="cart-summary-title">Order Summary</div>
        ${cartItems.map(l => `
          <div class="summary-row">
            <span>${l.title.substring(0,22)}...</span>
            <span>₹${l.price.toLocaleString()}</span>
          </div>
        `).join('')}
        <div class="summary-row total">
          <span>Total (${cartItems.length} items)</span>
          <span>₹${total.toLocaleString()}</span>
        </div>
        <button class="btn btn-primary cart-checkout-btn" onclick="checkout()">Proceed to Pay</button>
        <div style="font-size:0.7rem;color:var(--text-muted);text-align:center;margin-top:0.75rem;">
          Contact sellers directly via WhatsApp/UPI for payment and pickup.
        </div>
      </div>
    </div>
  `;
}

function checkout() {
  cart = [];
  updateCartCount();
  showToast('Order placed! Contact sellers for pickup.', 'success');
  setTimeout(renderCart, 300);
}

// ─── SELL FORM ───
function selectCond(c, el) {
  selectedCondition = c;
  document.querySelectorAll('.cond-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function pickEmoji(e, el) {
  selectedEmoji = e;
  document.querySelectorAll('.emoji-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

function submitListing() {
  const title = document.getElementById('sellTitle').value.trim();
  const cat = document.getElementById('sellCat').value;
  const priceVal = document.getElementById('sellPrice').value;
  const origVal = document.getElementById('sellOrigPrice').value;
  const price = parseFloat(priceVal);
  const origPrice = origVal ? parseFloat(origVal) : null;
  const desc = document.getElementById('sellDesc').value.trim();
  const seller = document.getElementById('sellName').value.trim();
  const room = document.getElementById('sellRoom').value.trim() || 'Unknown';
  const contact = document.getElementById('sellContact').value.trim() || 'NA';

  if (!title || !cat || !price || !desc || !seller || !selectedCondition) {
    showToast('Please fill in all required fields!', 'error');
    return;
  }

  const newListing = {
    id: Date.now(),
    title,
    cat,
    emoji: selectedEmoji,
    price,
    origPrice,
    condition: selectedCondition,
    desc,
    seller,
    room,
    contact,
    badge: 'new',
    timestamp: Date.now(),
    mine: true
  };

  listings.unshift(newListing);

  // Reset form
  document.getElementById('sellTitle').value = '';
  document.getElementById('sellCat').value = '';
  document.getElementById('sellPrice').value = '';
  document.getElementById('sellOrigPrice').value = '';
  document.getElementById('sellDesc').value = '';
  document.getElementById('sellName').value = '';
  document.getElementById('sellRoom').value = '';
  document.getElementById('sellContact').value = '';
  selectedCondition = '';
  selectedEmoji = '📦';
  document.querySelectorAll('.cond-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.emoji-opt').forEach(o => o.classList.remove('selected'));

  renderListings();
  updateMyPage();
  showToast('Listing published successfully!', 'success');
  showPage('home');
}

// ─── MY PAGE ───
function updateMyPage() {
  const activeCount = listings.filter(l => l.mine).length;
  const savedCount = saved.length;
  document.getElementById('activeCount').textContent = activeCount;
  document.getElementById('savedCount').textContent = savedCount;
  renderMyTab();
}

function switchTab(tab, el) {
  currentTab = tab;
  document.querySelectorAll('.my-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderMyTab();
}

function renderMyTab() {
  const el = document.getElementById('myTabContent');
  if (!el) return;

  let items = currentTab === 'active'
    ? listings.filter(l => l.mine)
    : listings.filter(l => saved.includes(l.id));

  if (items.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="big-emoji">${currentTab === 'active' ? '📭' : '💤'}</div>
        <h3>${currentTab === 'active' ? 'No listings yet' : 'Nothing saved yet'}</h3>
        <p>${currentTab === 'active'
          ? 'Click "List Item" to add your first listing.'
          : 'Browse and save items you like to see them here.'}</p>
      </div>
    `;
    return;
  }

  el.innerHTML = `
    <div class="my-listings-list">
      ${items.map(l => `
        <div class="my-listing-row">
          <div class="my-listing-emoji">${l.emoji}</div>
          <div class="my-listing-info">
            <div class="my-listing-title">${l.title}</div>
            <div class="my-listing-meta">
              <span class="status-dot ${l.mine ? '' : 'inactive'}"></span>
              ${getCatLabel(l.cat)} • Room ${l.room}
            </div>
          </div>
          <div class="my-listing-price">₹${l.price.toLocaleString()}</div>
          <div class="my-listing-actions">
            <button class="btn btn-ghost" onclick="openModal(${l.id})">View</button>
            ${currentTab === 'saved'
              ? `<button class="btn btn-danger" onclick="toggleWish(${l.id}, null)">Unsave</button>`
              : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ─── NAVIGATION ───
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navLink = document.getElementById(`nav-${page}`);
  if (navLink) navLink.classList.add('active');

  if (page === 'cart') renderCart();
  if (page === 'my') updateMyPage();
}

// ─── TOASTS ───
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const id = Date.now();
  const div = document.createElement('div');
  div.className = `toast toast-${type}`;
  div.id = `toast-${id}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  div.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(div);
  setTimeout(() => {
    const el = document.getElementById(`toast-${id}`);
    if (el) el.remove();
  }, 2500);
}

// ─── MESSAGE (SIMPLIFIED) ───
function messageSellerById(id) {
  const l = listings.find(x => x.id === id);
  if (!l) return;
  showToast(`Contact ${l.seller} at ${l.contact}`, 'info');
}

function messageFromModal() {
  if (!currentModalId) return;
  messageSellerById(currentModalId);
}
