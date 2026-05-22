import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Sun, Moon, Plus, Minus, Trash2, Search, 
  Upload, X, ChevronRight, Lock, ShieldCheck, ShoppingCart, 
  Sparkles, CheckCircle2, AlertCircle, ArrowLeft, Loader2
} from 'lucide-react';

// Price Formatter Helper
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(price);
};

// ==========================================
// COMPONENT: NAVBAR
// ==========================================
function Navbar({ cartCount, onCartOpen, darkMode, toggleDarkMode }) {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="nav-logo">
          ✨ CROWN <span>COLLECTION</span>
        </Link>
        
        <div className="nav-actions">
          <button 
            onClick={toggleDarkMode} 
            className="icon-btn" 
            aria-label="Toggle Dark Mode"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={onCartOpen} 
            className="icon-btn" 
            aria-label="Open Cart"
            title="Open Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          
          <Link to="/admin" className="icon-btn" title="Admin Panel">
            <Lock size={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ==========================================
// COMPONENT: CART DRAWER
// ==========================================
function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeFromCart }) {
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Format cart text for WhatsApp
    const itemsText = cart.map(item => 
      `- ${item.quantity}x ${item.title} (${formatPrice(item.price * item.quantity)})`
    ).join('\n');
    
    const totalText = formatPrice(getCartTotal());
    
    const message = `Hello Crown Collection ⚡\n\nI would like to place an order for the following jewelry:\n\n${itemsText}\n\n*Total:* ${totalText}\n\nCan you please confirm availability and payment details? Thank you!`;
    const whatsappUrl = `https://wa.me/2348029402971?text=${encodeURIComponent(message)}`;
    
    // Confetti effect
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#d4af37', '#d97d99', '#ffffff']
      });
    });

    // Redirect after a short delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1200);
  };

  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="cart-title">
            <ShoppingCart size={24} className="text-primary" />
            Your Cart
          </h2>
          <button onClick={onClose} className="cart-close-btn" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={64} strokeWidth={1} className="text-secondary" />
              <p className="cart-empty-text">Your jewelry box is empty.</p>
              <button onClick={onClose} className="cta-button" style={{ padding: '10px 24px', fontSize: '14px' }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&auto=format&fit=crop&q=60'} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <span className="cart-item-category">{item.category}</span>
                  <h3 className="cart-item-title">{item.title}</h3>
                  <div className="cart-item-quantity-price">
                    <div className="quantity-controller">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="qty-btn" aria-label="Decrease quantity">
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn" aria-label="Increase quantity">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="cart-item-price">{formatPrice(item.price * item.quantity)}</span>
                      <button onClick={() => removeFromCart(item.id)} className="remove-item-btn" title="Remove Item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span style={{ color: 'var(--gold-accent)', fontSize: '22px' }}>{formatPrice(getCartTotal())}</span>
            </div>
            <button onClick={handleCheckout} className="checkout-btn">
              Order via WhatsApp
              <ChevronRight size={18} />
            </button>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '12px' }}>
              Redirects to WhatsApp with order details to complete payment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// VIEW: LANDING STORE FRONT
// ==========================================
function StoreFront({ products, loading, addToCart }) {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');

  const categories = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Sets'];

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(p => category === 'All' || p.category === category)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || 
                 p.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0; // featured
    });

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="hero-subtitle">Premium Jewelry Collection</span>
            <h1 className="hero-title luxury-text-gradient">Crafted For Elegance & Majesty</h1>
            <p className="hero-description">
              Discover timeless crown jewels, bespoke diamond rings, and premium accessories tailored for those who demand nothing less than royalty.
            </p>
            <a href="#shop" className="cta-button">
              Explore Collection
              <Sparkles size={18} />
            </a>
          </div>
          
          <div className="hero-image-container">
            <div className="hero-circle-bg"></div>
            <img 
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80" 
              alt="Luxury Crown Collection Jewels" 
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="shop-section container">
        <div className="section-header">
          <h2 className="section-title">The Royal Catalog</h2>
          <p className="section-subtitle">Browse our hand-selected items, crafted in fine gold, silver, and embedded with pristine gemstones.</p>
        </div>

        <div className="filters-bar">
          <div className="categories-container">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setCategory(cat)}
                className={`category-btn ${category === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="search-sort-row">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search premium pieces..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="sort-select-wrapper">
              <label htmlFor="sort" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Sort By:</label>
              <select 
                id="sort" 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured Jewelry</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '100px 0' }}>
            <Loader2 className="animate-spin text-primary" size={48} />
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text-secondary)' }}>Polishing the collection...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">
            <AlertCircle size={48} strokeWidth={1} style={{ marginBottom: '16px', color: 'var(--primary-pink)' }} />
            <p>No jewelry matches your search criteria.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <article key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <span className="product-badge">New</span>
                  <img src={product.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&auto=format&fit=crop&q=80'} alt={product.title} className="product-image" loading="lazy" />
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="add-to-cart-btn" 
                      title="Add to cart"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ==========================================
// VIEW: ADMIN CONSOLE
// ==========================================
function AdminConsole({ products, loadingProducts, onRefreshProducts }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Product Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Rings');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Delete State
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // Simple Admin Login Authentication
  const handleLogin = (e) => {
    e.preventDefault();
    // In production, configure ADMIN_PASSWORD in environment variables
    // Fallback password is crown123
    const correctPassword = 'crown123';
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin passkey. Please check owner credentials.');
    }
  };

  // Image Selection Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setFormError('Image size exceeds 8MB. Please choose a smaller file.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormError('');
    }
  };

  // Product Submit Form Handler
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!title || !price || !category) {
      setFormError('Please fill out all required fields.');
      return;
    }

    setFormLoading(true);
    setFormSuccess('');
    setFormError('');

    try {
      let imageUrl = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'; // fallback default

      // 1. Upload image if selected
      if (imagePreview) {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imagePreview })
        });
        
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || 'Failed to upload image');
        }
        imageUrl = uploadData.url;
      }

      // 2. Add product details to DB
      const productRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          category,
          image: imageUrl
        })
      });

      const productData = await productRes.json();
      if (!productRes.ok) {
        throw new Error(productData.error || 'Failed to add product to database');
      }

      // Success Reset Form
      setFormSuccess('Premium product uploaded and listed successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('Rings');
      setImageFile(null);
      setImagePreview('');
      
      // Refresh the storefront product state
      onRefreshProducts();
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'An error occurred during submission.');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to remove this jewelry piece? This action is permanent.')) {
      return;
    }

    setDeleteLoadingId(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      onRefreshProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // Login Form Gate View
  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="admin-auth-card">
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: 'var(--primary-pink-light)', color: 'var(--primary-pink)', marginBottom: '16px' }}>
            <Lock size={32} />
          </div>
          <h2 className="admin-auth-title">Owner Access Portal</h2>
          <p className="admin-auth-desc">Please enter your administrative passkey to manage inventory and settings.</p>
          
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="passkey">Admin Passkey</label>
              <input 
                type="password" 
                id="passkey" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Authenticate Portal
            </button>
            <div style={{ marginTop: '20px' }}>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--primary-pink)' }}>
                <ArrowLeft size={14} /> Back to Storefront
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard Layout
  return (
    <div className="container admin-layout">
      <div className="admin-header">
        <div>
          <span className="hero-subtitle">Administrative Control Panel</span>
          <h1 className="admin-title">Boutique Inventory Manager</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/" className="cta-button" style={{ padding: '10px 20px', fontSize: '14px', backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
            <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Shop Storefront
          </Link>
          <button onClick={() => setIsAuthenticated(false)} className="cta-button" style={{ padding: '10px 20px', fontSize: '14px', backgroundColor: '#e04f5f' }}>
            Lock Portal
          </button>
        </div>
      </div>

      <div className="admin-grid">
        {/* Upload Form Card */}
        <div className="admin-card">
          <h2 className="admin-card-title">Upload New Jewelry</h2>
          
          {formSuccess && <div className="success-msg"><CheckCircle2 size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />{formSuccess}</div>}
          {formError && <div className="error-msg"><AlertCircle size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />{formError}</div>}

          <form onSubmit={handleSubmitProduct}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Jewelry Name *</label>
              <input 
                type="text" 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="form-input" 
                placeholder="e.g., Diamond Solitaire Ring"
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="price">Price (₦ - NGN) *</label>
              <input 
                type="number" 
                id="price" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                className="form-input" 
                placeholder="e.g., 250000"
                min="0"
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select 
                id="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="form-select"
              >
                <option value="Rings">Rings</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Earrings">Earrings</option>
                <option value="Sets">Jewelry Sets</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Product Description</label>
              <textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="form-textarea" 
                placeholder="Describe materials, carat quality, weight and size fittings..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jewelry Display Photo *</label>
              <div 
                className="file-upload-wrapper"
                onClick={() => document.getElementById('image-upload').click()}
              >
                <Upload size={28} style={{ color: 'var(--primary-pink)', marginBottom: '8px' }} />
                <p style={{ fontSize: '13px', fontWeight: '500' }}>
                  {imageFile ? imageFile.name : 'Select or Drop Product Image'}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>PNG, JPG, WEBP up to 8MB</p>
                <input 
                  type="file" 
                  id="image-upload" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  style={{ display: 'none' }} 
                />
              </div>
              {imagePreview && (
                <div style={{ position: 'relative', marginTop: '12px' }}>
                  <img src={imagePreview} alt="Upload Preview" className="file-upload-preview" />
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="icon-btn" 
                    style={{ position: 'absolute', top: '6px', right: '6px', width: '28px', height: '28px', backgroundColor: 'var(--surface-color)' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={formLoading}>
              {formLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  Processing Upload...
                </>
              ) : (
                'Publish Product'
              )}
            </button>
          </form>
        </div>

        {/* Inventory list Card */}
        <div className="admin-card">
          <h2 className="admin-card-title">Boutique Inventory ({products.length})</h2>
          
          {loadingProducts ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Loader2 className="animate-spin text-primary" size={32} />
              <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Loading catalog database...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textDecoration: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              No items in catalog database. Use form to create products.
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="admin-product-row">
                      <td>
                        <img src={p.image} alt={p.title} className="admin-table-img" />
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{p.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.description || 'No description'}
                        </div>
                      </td>
                      <td style={{ fontWeight: '600' }}>{formatPrice(p.price)}</td>
                      <td>
                        <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'var(--primary-pink-light)', color: 'var(--primary-pink)', fontWeight: '500' }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="delete-btn"
                          disabled={deleteLoadingId === p.id}
                        >
                          {deleteLoadingId === p.id ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            <>
                              <Trash2 size={14} /> Remove
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT & STATE MANAGEMENT
// ==========================================
export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('crown_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('crown_dark_mode') === 'true';
  });

  // Fetch products from database API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch catalog');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync Cart to localStorage
  useEffect(() => {
    localStorage.setItem('crown_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Dark Mode state to DOM and localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('crown_dark_mode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Cart Functions
  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    // Auto-open cart drawer when adding new item
    setIsCartOpen(true);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar 
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
          onCartOpen={() => setIsCartOpen(true)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={
                <StoreFront 
                  products={products} 
                  loading={loading} 
                  addToCart={addToCart} 
                />
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminConsole 
                  products={products} 
                  loadingProducts={loading} 
                  onRefreshProducts={fetchProducts} 
                />
              } 
            />
          </Routes>
        </main>
        
        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />

        {/* Footer */}
        <footer className="footer">
          <div className="container footer-grid">
            <div className="footer-brand">
              <h3>✨ CROWN COLLECTION</h3>
              <p>Exclusive jewelry and luxury accessories boutique based in Nigeria. Providing royal designs for elegant lifestyles.</p>
              <p style={{ fontWeight: '500', color: 'var(--text-primary)' }}>📞 +234 8029402971</p>
            </div>
            <div>
              <h4 className="footer-links-title">Collections</h4>
              <ul className="footer-links">
                <li><a href="#shop">Diamond Rings</a></li>
                <li><a href="#shop">Bespoke Necklaces</a></li>
                <li><a href="#shop">Imperial Bracelets</a></li>
                <li><a href="#shop">Royal Earrings</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-links-title">Customer Care</h4>
              <ul className="footer-links">
                <li><a href="https://wa.me/2348029402971" target="_blank" rel="noopener noreferrer">Contact WhatsApp Support</a></li>
                <li><a href="#shop">Shipping & Delivery</a></li>
                <li><a href="#shop">Sizing Guide</a></li>
                <li><a href="/admin">Owner Portal Login</a></li>
              </ul>
            </div>
          </div>
          <div className="container footer-bottom">
            <p>&copy; {new Date().getFullYear()} Crown Collection. Crafted with royal elegance.</p>
            <p>Developed with React & Node.js</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
