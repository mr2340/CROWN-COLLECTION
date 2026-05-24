import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag, Sun, Moon, Plus, Minus, Trash2, Search,
  Upload, X, ChevronRight, Lock, ShieldCheck, ShoppingCart,
  Sparkles, CheckCircle2, AlertCircle, ArrowLeft, Loader2,
  Award, Truck, Star, ChevronDown, ChevronUp,
  Home, Mail, Eye, Ruler, Instagram, Phone, MapPin, Clock,
  MessageSquare, Send, Bot, User
} from 'lucide-react';


// ==========================================
// COMPONENT: SCROLL REVEAL WRAPPER
// ==========================================
function Reveal({ children, delay = 0, effect = 'fade-in-up', className = '', as = 'div', ...props }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  const getEffectClass = () => {
    if (effect === 'fade-in') return 'reveal-fade';
    if (effect === 'scale') return 'reveal-scale';
    return 'reveal-fade-in-up';
  };

  const Component = as;

  return (
    <Component
      ref={elementRef}
      className={`reveal-element ${getEffectClass()} ${isVisible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...props.style }}
      {...props}
    >
      {children}
    </Component>
  );
}

// ==========================================
// COMPONENT: CUSTOM LUXURY CURSOR
// ==========================================
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Only run on desktop
    if (window.innerWidth <= 768) return;

    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (typeof window !== 'undefined' && window.innerWidth <= 768) return null;

  return (
    <>
      <div className="cursor-dot" style={{ left: `${position.x}px`, top: `${position.y}px` }} />
      <div className={`cursor-outline ${isHovering ? 'hovering' : ''}`} style={{ left: `${position.x}px`, top: `${position.y}px` }} />
    </>
  );
}

// ==========================================
// COMPONENT: FLOATING TRUST BADGE
// ==========================================
function TrustBadge() {
  return (
    <div className="floating-trust-badge">
      <ShieldCheck size={16} style={{ color: 'var(--gold-accent)' }} />
      <span>100% Certified 18k Gold</span>
    </div>
  );
}

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
function Navbar({ cartCount, onCartOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="nav-logo" style={{ color: '#fff' }}>
          CROWN <span style={{ color: 'var(--primary-pink)' }}>COLLECTION</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <a href="#shop" onClick={(e) => handleScrollTo(e, 'shop')} className="nav-link-item">Shop</a>
          <a href="#heritage" onClick={(e) => handleScrollTo(e, 'heritage')} className="nav-link-item">Heritage</a>
          <a href="#reviews" onClick={(e) => handleScrollTo(e, 'reviews')} className="nav-link-item">Reviews</a>
          <a href="#faq" onClick={(e) => handleScrollTo(e, 'faq')} className="nav-link-item">FAQ</a>
        </div>

        <div className="nav-actions">

          <button
            onClick={onCartOpen}
            className="icon-btn"
            aria-label="Open Cart"
            title="Open Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}


// ==========================================
// COMPONENT: TERMS AND CONDITIONS BANNER
// ==========================================
function TermsBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('crown-terms-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('crown-terms-consent', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="terms-banner-overlay">
      <div className="terms-banner-card">
        <div className="terms-banner-content">
          <div className="terms-icon-wrapper">
            <ShieldCheck size={24} className="terms-icon" />
          </div>
          <div className="terms-text-container">
            <h4>Terms &amp; Conditions Agreement</h4>
            <p>
              By continuing to browse this site, you agree to our terms of service, custom jewelry sales agreement, and fully insured delivery policies.
            </p>
          </div>
        </div>
        <div className="terms-actions">
          <button onClick={handleAccept} className="terms-accept-btn">
            Accept &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function MarqueeBanner() {
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <span>LUXURY JEWELRY</span>
        <span>BONE STRAIGHT DIAMONDS</span>
        <span>CUSTOM CROWNS</span>
        <span>SEAMLESS DESIGNS</span>
        <span>LUXURY JEWELRY</span>
        <span>BONE STRAIGHT DIAMONDS</span>
      </div>
    </div>
  );
}

function MeetTheJeweler() {
  return (
    <section className="meet-artist">
      <div className="container meet-artist-grid">
        <Reveal delay={200} effect="scale">
          <img
            src="https://images.unsplash.com/photo-1599643478514-4a4e09b52342?q=80&w=800&auto=format&fit=crop"
            alt="The Jeweler at Work"
            className="meet-artist-img"
          />
        </Reveal>
        <Reveal delay={400}>
          <h2>Meet The Jeweler</h2>
          <p>
            With over two decades of mastering the art of bespoke luxury, our master jeweler
            blends traditional craftsmanship with avant-garde aesthetics. Every piece is a
            testament to uncompromising quality, designed exclusively for those who demand
            nothing but absolute perfection.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function FloatingActionButtons() {
  return (
    <>
      <div className="fab-container-left">
        <button className="fab-up" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ChevronUp size={24} />
        </button>
      </div>
    </>
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
        colors: ['#c92c61', '#c49682', '#ffffff']
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
// COMPONENT: MOBILE BOTTOM NAVIGATION
// ==========================================
function MobileBottomNav({ onCartOpen, cartCount, onSearchFocus }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (targetId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        if (targetId === 'shop' && onSearchFocus) {
          onSearchFocus();
        }
      }, 150);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      if (targetId === 'shop' && onSearchFocus) {
        onSearchFocus();
      }
    }
  };

  return (
    <div className="mobile-bottom-nav">
      <button onClick={() => handleNav('hero')} className="mobile-nav-item" aria-label="Home">
        <Home size={20} />
        <span>Home</span>
      </button>
      <button onClick={() => handleNav('shop')} className="mobile-nav-item" aria-label="Shop">
        <Search size={20} />
        <span>Shop</span>
      </button>
      <button onClick={onCartOpen} className="mobile-nav-item cart-btn-mobile" aria-label="Open Cart">
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
        </div>
        <span>Cart</span>
      </button>
      <button onClick={() => window.open('https://wa.me/2348029402971', '_blank')} className="mobile-nav-item" aria-label="Contact">
        <Phone size={20} />
        <span>Contact</span>
      </button>
    </div>
  );
}

// ==========================================
// COMPONENT: RING SIZING MODAL
// ==========================================
function SizingModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="quickview-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="quickview-modal sizing-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
        <button className="quickview-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>
        <div style={{ padding: '30px' }}>
          <h2 className="section-title" style={{ fontSize: '28px', marginBottom: '16px', textAlign: 'left' }}>
            📏 Jewelry Sizing Guide
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '15px' }}>
            Ensure your jewelry fits like royalty. Follow these steps to measure your perfect ring size at home.
          </p>

          <div className="sizing-steps" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="step-item" style={{ borderLeft: '3px solid var(--primary-pink)', paddingLeft: '16px' }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Step 1: Wrap</strong>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Wrap a thin strip of paper or string around the base of your finger. Ensure it isn't too tight.</span>
            </div>
            <div className="step-item" style={{ borderLeft: '3px solid var(--primary-pink)', paddingLeft: '16px' }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Step 2: Mark</strong>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Use a pen to mark the exact point where the paper overlaps to form a complete circle.</span>
            </div>
            <div className="step-item" style={{ borderLeft: '3px solid var(--primary-pink)', paddingLeft: '16px' }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Step 3: Measure & Match</strong>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Lay the paper flat and measure the distance in millimeters (circumference). Match it against the table below:</span>
            </div>
          </div>

          <table className="sizing-table" style={{ width: '100%', marginTop: '24px', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Inside Circ. (mm)</th>
                <th style={{ padding: '8px' }}>US Size</th>
                <th style={{ padding: '8px' }}>UK Size</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px' }}>51.9 mm</td>
                <td style={{ padding: '8px' }}>6</td>
                <td style={{ padding: '8px' }}>L ½</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px' }}>54.4 mm</td>
                <td style={{ padding: '8px' }}>7</td>
                <td style={{ padding: '8px' }}>N ½</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px' }}>57.0 mm</td>
                <td style={{ padding: '8px' }}>8</td>
                <td style={{ padding: '8px' }}>P ½</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px' }}>59.5 mm</td>
                <td style={{ padding: '8px' }}>9</td>
                <td style={{ padding: '8px' }}>R ½</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px' }}>62.1 mm</td>
                <td style={{ padding: '8px' }}>10</td>
                <td style={{ padding: '8px' }}>T ½</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                const message = `Hello Crown Collection ⚡\n\nI need help measuring my ring size. Can you send me a digital size print template?`;
                window.open(`https://wa.me/2348029402971?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="cta-button"
              style={{ fontSize: '13px', padding: '10px 20px', backgroundColor: 'var(--gold-accent)' }}
            >
              Get Sizing Help on WhatsApp
            </button>
            <button onClick={onClose} className="cta-button" style={{ fontSize: '13px', padding: '10px 20px', backgroundColor: 'var(--text-primary)' }}>
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: PRODUCT QUICK VIEW MODAL
// ==========================================
function QuickViewModal({ product, isOpen, onClose, addToCart, onSizingOpen }) {
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'shipping', 'care'
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  const handleDirectWhatsApp = () => {
    const itemTotal = formatPrice(product.price * quantity);
    const message = `Hello Crown Collection ⚡\n\nI want to order this item immediately:\n- ${quantity}x ${product.title} (${itemTotal})\n\nCan you please check availability? Thank you!`;
    const whatsappUrl = `https://wa.me/2348029402971?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSizingInquiry = () => {
    onSizingOpen();
  };

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="quickview-grid">
          <div className="quickview-image-sec">
            <img src={product.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80'} alt={product.title} className="quickview-img" />
          </div>

          <div className="quickview-info-sec">
            <span className="quickview-category">{product.category}</span>
            <h2 className="quickview-title">{product.title}</h2>
            <div className="quickview-price-row">
              <span className="quickview-price">{formatPrice(product.price)}</span>
            </div>

            <p className="quickview-desc">{product.description || 'No description available for this handcrafted jewelry piece.'}</p>

            {/* Spec Tabs */}
            <div className="quickview-tabs">
              <button onClick={() => setActiveTab('specs')} className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}>Specifications</button>
              <button onClick={() => setActiveTab('shipping')} className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}>Shipping</button>
              <button onClick={() => setActiveTab('care')} className={`tab-btn ${activeTab === 'care' ? 'active' : ''}`}>Jewelry Care</button>
            </div>

            <div className="quickview-tab-content">
              {activeTab === 'specs' && (
                <ul className="specs-table">
                  <li>
                    <span>Metal Finish:</span>
                    <strong>{product.category === 'Rings' ? '18k Solid Yellow/Rose Gold Alloy' : 'Premium 18k Gold Plated / Solid Silver'}</strong>
                  </li>
                  <li>
                    <span>Gemstone:</span>
                    <strong>{product.title.toLowerCase().includes('diamond') ? 'VVS Clarity simulated diamond stones' : 'Pristine cut simulated sapphire/emerald'}</strong>
                  </li>
                  <li>
                    <span>Weight:</span>
                    <strong>{product.category === 'Rings' ? 'approx. 8.5g - 12.0g' : 'approx. 14g - 28g'}</strong>
                  </li>
                  <li>
                    <span>Origin:</span>
                    <strong>Handcrafted & hand-polished in Lagos, Nigeria</strong>
                  </li>
                </ul>
              )}

              {activeTab === 'shipping' && (
                <div className="tab-details">
                  <p>🚚 <strong>Lagos Delivery:</strong> Secure delivery in 24 to 48 hours.</p>
                  <p>✈️ <strong>Nationwide Delivery:</strong> Insured delivery in 3 to 5 business days via reliable courier service.</p>
                  <p>🔁 <strong>Return Policy:</strong> Returns accepted within 7 days for exchange only (standard items only, custom orders are final sale).</p>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="tab-details">
                  <p>Keep your Crown Collection pieces shining for generations:</p>
                  <ul>
                    <li>Avoid direct contact with perfumes, chlorine, and hair sprays.</li>
                    <li>Clean gently with a soft micro-fiber cloth after wearing.</li>
                    <li>Store in the velvet luxury box provided with your purchase.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Sizing inquiry helper link */}
            <button onClick={handleSizingInquiry} className="text-link-btn" style={{ margin: '12px 0 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Ruler size={14} /> Need help choosing your size? Sizing Guide & Ring Chart
            </button>

            {/* Actions Row */}
            <div className="quickview-actions">
              <div className="quantity-controller-large">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-large-btn" aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <span className="qty-large-value">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="qty-large-btn" aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>

              <button onClick={handleAddToCart} className="add-to-cart-large">
                Add to Cart
              </button>
            </div>

            <button onClick={handleDirectWhatsApp} className="buy-now-whatsapp">
              Buy Now via WhatsApp (Skip Cart)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: SIGNATURE COLLECTIONS SHOWCASE
// ==========================================
function SignatureCollections({ onSelectCategory }) {
  const collections = [
    {
      id: 1,
      title: "Monarch Rings",
      subtitle: "18k Gold & Gemstone Bands",
      category: "Rings",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: "Imperial Necklaces",
      subtitle: "Bespoke Pendants & Chains",
      category: "Necklaces",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: "Royal Jewelry Sets",
      subtitle: "Matched Sets for Major Occasions",
      category: "Sets",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <section className="signature-collections-section container">
      <Reveal className="section-header">
        <h2 className="section-title">The Signature Series</h2>
        <p className="section-subtitle">Explore our hand-matched premium collections, curated for exquisite tastes and special milestones.</p>
      </Reveal>

      <div className="sig-grid">
        {collections.map((col, index) => (
          <Reveal
            key={col.id}
            as="div"
            className="sig-card"
            delay={index * 150}
            onClick={() => onSelectCategory(col.category)}
          >
            <img src={col.image} alt={col.title} className="sig-card-img" />
            <div className="sig-card-overlay">
              <span className="sig-card-subtitle">{col.subtitle}</span>
              <h3 className="sig-card-title">{col.title}</h3>
              <span className="sig-explore-btn">
                Shop Collection <ChevronRight size={14} />
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ==========================================
// COMPONENT: CLIENT STYLE SHOWCASE GALLERY
// ==========================================
function StyleGallery() {
  const [activeImage, setActiveImage] = useState(null);

  const galleryItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      caption: "Gold Herringbone Necklace & Monarch Ring Set"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      caption: "Bespoke 18k Yellow Gold Diamond Wedding Band"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&auto=format&fit=crop&q=80",
      caption: "Lagos Collection Imperial Gold Bangles"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80",
      caption: "Royal Blossom Diamond Chandelier Earrings"
    }
  ];

  return (
    <section className="gallery-section container">
      <Reveal className="section-header">
        <h2 className="section-title">Royal Showcases</h2>
        <p className="section-subtitle">Browse how our clients style Crown Collection pieces for major occasions and everyday luxury.</p>
      </Reveal>
      <div className="gallery-grid">
        {galleryItems.map((item, index) => (
          <Reveal
            key={item.id}
            as="div"
            className="gallery-item-wrapper"
            delay={index * 120}
            onClick={() => setActiveImage(item)}
          >
            <img src={item.image} alt={item.caption} className="gallery-img" />
            <div className="gallery-overlay-hover">
              <Eye size={24} className="gallery-eye-icon" />
              <span>Zoom Styling View</span>
            </div>
          </Reveal>
        ))}
      </div>

      {activeImage && (
        <div className="lightbox-overlay" onClick={() => setActiveImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setActiveImage(null)} aria-label="Close image zoom">
              <X size={24} />
            </button>
            <img src={activeImage.image} alt={activeImage.caption} className="lightbox-img" />
            <p className="lightbox-caption">{activeImage.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}

// ==========================================
// COMPONENT: VIP NEWSLETTER CLUB
// ==========================================
function RoyaltyVIPClub({ onSubscribeSuccess }) {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setSubscribing(true);

    setTimeout(() => {
      setSubscribing(false);
      setEmail('');
      onSubscribeSuccess('Welcome to Royalty! We have sent a private invitation to your inbox.');

      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#c92c61', '#c49682', '#ffffff']
        });
      });
    }, 1000);
  };

  return (
    <section className="vip-newsletter-section">
      <div className="container">
        <Reveal as="div" effect="scale" className="vip-newsletter-card">
          <div className="vip-newsletter-icon">
            <Mail size={32} />
          </div>
          <h2 className="vip-newsletter-title">Join The Royalty VIP Club</h2>
          <p className="vip-newsletter-desc">
            Subscribe to receive private invitations to seasonal sales, custom-sizing guides, and exclusive releases of solid gold jewelry in Nigeria.
          </p>

          <form onSubmit={handleSubscribe} className="vip-form">
            <div className="vip-input-group">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className={`vip-input ${error ? 'error' : ''}`}
                required
              />
              <button type="submit" className="vip-btn" disabled={subscribing}>
                {subscribing ? <Loader2 className="animate-spin" size={18} /> : 'Request Invitation'}
              </button>
            </div>
            {error && <span className="vip-error-text">{error}</span>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

// ==========================================
// COMPONENT: TOAST NOTIFICATION
// ==========================================
function Toast({ message, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="luxury-toast">
      <Sparkles size={18} className="toast-icon animate-pulse" />
      <span className="toast-message">{message}</span>
      <button onClick={onClose} className="toast-close-btn" aria-label="Close toast">
        <X size={14} />
      </button>
    </div>
  );
}

// ==========================================
// COMPONENT: BOOKING SECTION
// ==========================================
function BookingSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    service: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `*New Booking Request*%0A%0AName: ${formData.fullName}%0AEmail: ${formData.email}%0AService: ${formData.service}%0ANotes: ${formData.notes}`;
    window.open(`https://wa.me/2348029402971?text=${text}`, '_blank');
  };

  return (
    <section id="booking" className="booking-section">
      <div className="container booking-grid">
        <Reveal effect="fade-in-up" className="booking-image-wrapper">
          <div className="booking-image-bg-accent"></div>
          <img src="https://images.unsplash.com/photo-1599643478524-fb66f70a00ac?w=800&auto=format&fit=crop&q=80" alt="Secure Your Slot" className="booking-image" />
        </Reveal>

        <Reveal effect="fade-in-up" delay={200} className="booking-form-wrapper">
          <h2 className="booking-title">Secure Your Slot</h2>
          <p className="booking-subtitle">Ready for the Crown Experience? Fill out the form below.</p>

          <form className="booking-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="booking-input"
              required
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="booking-input"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <div className="select-wrapper">
              <select
                className="booking-input booking-select"
                required
                value={formData.service}
                onChange={e => setFormData({ ...formData, service: e.target.value })}
              >
                <option value="" disabled>Select Service</option>
                <option value="Custom Ring Design">Custom Ring Design</option>
                <option value="Bridal Set Consultation">Bridal Set Consultation</option>
                <option value="Jewelry Resizing/Repair">Jewelry Resizing/Repair</option>
                <option value="General Consultation">General Consultation</option>
              </select>
              <ChevronDown className="select-icon" size={16} />
            </div>
            <textarea
              placeholder="Additional Notes (Date/Time preference)"
              className="booking-textarea"
              rows={4}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            ></textarea>

            <div className="booking-submit-row">
              <button type="submit" className="booking-submit-btn">
                CONFIRM BOOKING
                <span className="submit-icon-wrapper">
                  <MessageSquare size={20} />
                </span>
              </button>

              <button type="button" className="booking-whatsapp-circle" onClick={handleSubmit}>
                <Phone size={24} color="#fff" fill="#fff" />
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

// ==========================================
// COMPONENT: VISIT THE CROWN STORE
// ==========================================
function VisitCrownStore() {
  const handleGetDirections = () => {
    window.open("https://www.google.com/maps/search/?api=1&query=Tiana+Hairline+1,+Ikotun,+Lagos,+Nigeria", "_blank");
  };

  return (
    <section className="dollhouse-section container">
      <div className="dollhouse-grid">
        <Reveal effect="fade-in-up" className="dollhouse-map-wrapper">
          <div className="map-container">
            <img
              src="/map-vintage.png"
              alt="CROWN Store Location Map"
              className="dollhouse-map-img"
            />
            {/* Hot Pink Location Pin with Tooltip */}
            <div className="map-pin-container">
              <div className="map-pin-pulse"></div>
              <div className="map-pin-icon">
                <MapPin size={28} color="var(--primary-pink)" fill="var(--primary-pink)" />
              </div>
              <div className="map-tooltip">Ikotun, Lagos</div>
            </div>
          </div>
        </Reveal>

        <Reveal effect="fade-in-up" delay={200} className="dollhouse-info-wrapper">
          <h2 className="dollhouse-title">Visit The CROWN Store</h2>
          <p className="dollhouse-subtitle">Come experience royal elegance and fine craftsmanship in person at our flagship boutique.</p>

          <div className="dollhouse-details">
            <div className="dollhouse-detail-item">
              <MapPin size={22} className="detail-icon" />
              <span>Tiana Hairline 1, Ikotun, Lagos, Nigeria</span>
            </div>

            <div className="dollhouse-detail-item align-start">
              <Clock size={22} className="detail-icon" />
              <div>
                <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                <p>Sun: 1:00 PM - 6:00 PM</p>
              </div>
            </div>

            <div className="dollhouse-detail-item">
              <Phone size={22} className="detail-icon" />
              <span><a href="tel:+2347048916429" className="hover-link">+2347048916429</a></span>
            </div>
          </div>

          <button onClick={handleGetDirections} className="directions-btn">
            GET DIRECTIONS
          </button>
        </Reveal>
      </div>
    </section>
  );
}

// ==========================================
// COMPONENT: STOREFRONT (LANDING PAGE)
// ==========================================
function StoreFront({ products, siteSettings, loading, addToCart, onProductClick, onSizingOpen, onSubscribeSuccess }) {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [activeFaq, setActiveFaq] = useState(null);

  const categories = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Sets'];

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(p => category === 'All' || p.category === category)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0; // featured
    });

  return (
    <div>
      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="container hero-grid">
          <div>
            <Reveal delay={100}>
              <span className="hero-subtitle">{siteSettings?.heroSubtitle || "Premium Jewelry Collection"}</span>
            </Reveal>
            <Reveal delay={250}>
              <h1 className="hero-title luxury-text-gradient">{siteSettings?.heroTitle || "Crafted For Elegance & Majesty"}</h1>
            </Reveal>
            <Reveal delay={400}>
              <p className="hero-description">
                {siteSettings?.heroDescription || "Discover timeless crown jewels, bespoke diamond rings, and premium accessories tailored for those who demand nothing less than royalty."}
              </p>
            </Reveal>
            <Reveal delay={550}>
              <a href="#shop" className="cta-button" onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('shop');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}>
                Explore Collection
                <Sparkles size={18} />
              </a>
            </Reveal>
          </div>

          <Reveal as="div" effect="fade-in" delay={300} className="hero-image-container">
            <div className="glass-badge" style={{ top: '15%', left: '-15%' }}>
              ✨ 2030 Collection
            </div>
            <div className="glass-badge" style={{ bottom: '20%', right: '-10%' }}>
              <ShieldCheck size={16} /> Authentic
            </div>

            <div className="hero-arch">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80"
                alt="Luxury Crown Collection Jewels"
                className="hero-img"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="container features-grid">
          <Reveal as="div" className="feature-item" delay={100}>
            <Truck size={24} className="feature-icon" />
            <div>
              <h3>Secure Nationwide Delivery</h3>
              <p>Fully insured courier shipping across Nigeria</p>
            </div>
          </Reveal>
          <Reveal as="div" className="feature-item" delay={250}>
            <Award size={24} className="feature-icon" />
            <div>
              <h3>100% Certified Gold</h3>
              <p>Sourced ethically and verified for absolute purity</p>
            </div>
          </Reveal>
          <Reveal as="div" className="feature-item" delay={400}>
            <ShieldCheck size={24} className="feature-icon" />
            <div>
              <h3>Secure WhatsApp Checkout</h3>
              <p>Direct confirmations with our customer support</p>
            </div>
          </Reveal>
        </div>
      </section>

      <MarqueeBanner />

      <MeetTheJeweler />

      {/* Signature Collections Showcase */}
      <SignatureCollections onSelectCategory={(cat) => {
        setCategory(cat);
        const element = document.getElementById('shop');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* Shop Catalog Section */}
      <section id="shop" className="shop-section container">
        <Reveal className="section-header">
          <h2 className="section-title">The Royal Catalog</h2>
          <p className="section-subtitle">Browse our hand-selected items, crafted in fine gold, silver, and embedded with pristine gemstones.</p>
        </Reveal>

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
            <button
              onClick={onSizingOpen}
              className="category-btn sizing-helper-btn"
              style={{ color: 'var(--gold-accent)', borderColor: 'rgba(194, 166, 136, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Ruler size={14} /> Size Guide
            </button>
          </div>

          <div className="search-sort-row">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                id="shop-search-input"
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
            {filteredProducts.map((product, index) => (
              <Reveal
                key={product.id}
                as="article"
                className="product-card"
                delay={(index % 4) * 100}
                onClick={() => onProductClick(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image-wrapper">
                  <span className="product-badge">New</span>
                  <img src={product.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&auto=format&fit=crop&q=80'} alt={product.title} className="product-image" loading="lazy" />
                  <div className="product-card-quickview-overlay">
                    <Eye size={18} />
                    <span>Quick View</span>
                  </div>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="add-to-cart-btn"
                      title="Add to cart"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Craftsmanship Section */}
      <section id="heritage" className="craftsmanship-section">
        <div className="container craftsmanship-grid">
          <Reveal as="div" className="craftsmanship-content" delay={100}>
            <span className="hero-subtitle">Our Heritage</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Royal Craftsmanship & Nigerian Majesty</h2>
            <p className="craftsmanship-p">
              From our flagship workshop in Lagos, Crown Collection has redefined jewelry as an expression of majesty and heritage. Every piece is meticulously hand-refined, combining traditional Nigerian aesthetics with global standards of luxury.
            </p>
            <p className="craftsmanship-p">
              We partner with experienced local smiths and international refiners to craft solid 18k and 22k gold jewelry, ensuring that each pendant, wedding band, and custom accessory possesses a weight, shine, and durability that lasts for generations.
            </p>
            <div className="specs-list">
              <div className="spec-item">
                <strong>22k & 18k Gold Finish</strong>
                <span>Solid gold alloys tailored for color retention and gorgeous skin glow.</span>
              </div>
              <div className="spec-item">
                <strong>VVS Clarity Gems</strong>
                <span>Pristine diamond cuts that refract light from all angles.</span>
              </div>
            </div>
          </Reveal>
          <Reveal as="div" effect="scale" className="craftsmanship-image-wrapper" delay={250}>
            <div className="craftsmanship-image-badge">✨ Handcrafted</div>
            <img
              src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80"
              alt="Jeweler crafting premium rings"
              className="craftsmanship-img"
            />
          </Reveal>
        </div>
      </section>

      {/* Client Style Gallery Section */}
      <StyleGallery />

      {/* Testimonials Section */}
      <section id="reviews" className="testimonials-section">
        <div className="container">
          <Reveal className="section-header">
            <h2 className="section-title">Royal Reviews</h2>
            <p className="section-subtitle">What our distinguished clients say about our service and craftsmanship.</p>
          </Reveal>
          <div className="testimonials-grid">
            <Reveal as="div" className="testimonial-card" delay={100}>
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--gold-accent)" color="var(--gold-accent)" />
                ))}
              </div>
              <p className="testimonial-quote">"The 18k Diamond Crown Ring is absolutely breathtaking! It fits perfectly and the diamonds sparkle brilliantly. The WhatsApp checkout was incredibly fast, and it was delivered securely in Lagos within 48 hours."</p>
              <div className="testimonial-author">
                <strong>Chioma A.</strong>
                <span>Lagos, Nigeria</span>
              </div>
            </Reveal>

            <Reveal as="div" className="testimonial-card" delay={250}>
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--gold-accent)" color="var(--gold-accent)" />
                ))}
              </div>
              <p className="testimonial-quote">"Excellent service. I ordered a custom Monarch Jewelry Set for my wedding anniversary. The owner was extremely professional on WhatsApp and kept me updated throughout the process. Highly recommend!"</p>
              <div className="testimonial-author">
                <strong>Tunde O.</strong>
                <span>Abuja, Nigeria</span>
              </div>
            </Reveal>

            <Reveal as="div" className="testimonial-card" delay={400}>
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--gold-accent)" color="var(--gold-accent)" />
                ))}
              </div>
              <p className="testimonial-quote">"Stunning craftsmanship. The Blush Rose Gold Pendant is delicate but has a solid weight. It's a gorgeous everyday luxury accessory. Dark mode on this website makes browsing so luxurious."</p>
              <div className="testimonial-author">
                <strong>Hadiza M.</strong>
                <span>Kano, Nigeria</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <BookingSection />

      {/* VIP Club newsletter */}
      <RoyaltyVIPClub onSubscribeSuccess={onSubscribeSuccess} />

      {/* FAQ Section */}
      <section id="faq" className="faq-section container">
        <Reveal className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Got questions? We have answers to help you navigate your luxury purchase.</p>
        </Reveal>
        <div className="faq-list">
          {[
            {
              q: "How do I make a payment for my order?",
              a: "Once you click 'Order via WhatsApp', your cart details will be forwarded directly to us. We will verify availability and send our official bank details for payment. We accept direct bank transfers and standard online payment links."
            },
            {
              q: "Do you deliver nationwide across Nigeria?",
              a: "Yes, we offer fully insured nationwide delivery across all 36 states. Deliveries in Lagos take 24–48 hours, while other major cities (Abuja, Port Harcourt, Kano, etc.) take 3–5 working days."
            },
            {
              q: "Can I order custom-size rings or bespoke jewelry designs?",
              a: "Absolutely! We specialize in custom designs. Simply start a chat with us on WhatsApp or specify in your order if you require a particular ring size or custom engravings. We will guide you through the measurements."
            },
            {
              q: "What is your return and exchange policy?",
              a: "As a luxury jewelry boutique, we stand behind our quality. We offer exchanges within 7 days of delivery for standard items, provided they are in pristine, unworn condition. Custom bespoke orders are final sale but carry a lifetime warranty on materials."
            }
          ].map((item, index) => (
            <Reveal
              key={index}
              as="div"
              className={`faq-item ${activeFaq === index ? 'active' : ''}`}
              delay={index * 100}
            >
              <button
                className="faq-question"
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <span>{item.q}</span>
                {activeFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Visit The CROWN Store Section */}
      <VisitCrownStore />
    </div>
  );
}

// ==========================================
// VIEW: ADMIN CONSOLE
// ==========================================
function AdminConsole({ products, loadingProducts, onRefreshProducts, siteSettings, onSettingsUpdated }) {
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

  // Settings State
  const [heroTitle, setHeroTitle] = useState(siteSettings?.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState(siteSettings?.heroSubtitle || '');
  const [heroDescription, setHeroDescription] = useState(siteSettings?.heroDescription || '');
  const [themeColor, setThemeColor] = useState(siteSettings?.themeColor || 'pink');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  useEffect(() => {
    if (siteSettings) {
      setHeroTitle(siteSettings.heroTitle);
      setHeroSubtitle(siteSettings.heroSubtitle);
      setHeroDescription(siteSettings.heroDescription);
      setThemeColor(siteSettings.themeColor || 'pink');
    }
  }, [siteSettings]);

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

  // Settings Submit Handler
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsSuccess('');
    setSettingsError('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroTitle, heroSubtitle, heroDescription, themeColor })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      setSettingsSuccess('Website configurations updated successfully!');
      if (onSettingsUpdated) onSettingsUpdated();
    } catch (err) {
      setSettingsError(err.message || 'Error saving settings.');
    } finally {
      setSettingsLoading(false);
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
        {/* Settings Form Card */}
        <div className="admin-card">
          <h2 className="admin-card-title">Website Configurations</h2>

          {settingsSuccess && <div className="success-msg"><CheckCircle2 size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />{settingsSuccess}</div>}
          {settingsError && <div className="error-msg"><AlertCircle size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />{settingsError}</div>}

          <form onSubmit={handleSettingsSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="heroTitle">Hero Banner Title</label>
              <input
                type="text"
                id="heroTitle"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="heroSubtitle">Hero Subtitle (Eyebrow)</label>
              <input
                type="text"
                id="heroSubtitle"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="heroDescription">Hero Description</label>
              <textarea
                id="heroDescription"
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="form-textarea"
                required
              />
            </div>


            <button type="submit" className="submit-btn" disabled={settingsLoading}>
              {settingsLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </form>
        </div>

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

              {/* Mobile Card Layout for small screens */}
              <div className="admin-mobile-cards">
                {products.map(p => (
                  <div key={p.id} className="admin-mobile-card">
                    <img src={p.image} alt={p.title} className="admin-card-img-mobile" />
                    <div className="admin-card-details-mobile">
                      <span className="admin-card-cat-mobile">{p.category}</span>
                      <h3 className="admin-card-title-mobile">{p.title}</h3>
                      <div className="admin-card-price-mobile">{formatPrice(p.price)}</div>
                      <p className="admin-card-desc-mobile">{p.description || 'No description'}</p>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="delete-btn mobile-delete-btn"
                        disabled={deleteLoadingId === p.id}
                      >
                        {deleteLoadingId === p.id ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <>
                            <Trash2 size={14} /> Remove Product
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: RULE-BASED CHATBOT
// ==========================================
function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! Welcome to Crown Collection. How can I assist you today? 👑", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");

  const quickReplies = [
    "Do you deliver?",
    "Can I order a custom ring?",
    "What is the price?",
    "Speak to a Human"
  ];

  const handleSend = (text) => {
    const userMessage = text || inputValue.trim();
    if (!userMessage) return;

    // Add user message
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setInputValue("");

    // Bot response logic
    setTimeout(() => {
      const lowerText = userMessage.toLowerCase();
      let botResponse = "";

      if (lowerText.includes("deliver") || lowerText.includes("shipping") || lowerText.includes("where")) {
        botResponse = "Yes! We offer fully insured nationwide delivery across all 36 states in Nigeria. Lagos deliveries take 24-48 hours, while other cities take 3-5 working days.";
      } else if (lowerText.includes("custom") || lowerText.includes("bespoke") || lowerText.includes("size")) {
        botResponse = "Absolutely! We specialize in custom designs and specific sizing. Please start a chat with us on WhatsApp to discuss your exact requirements.";
      } else if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("how much")) {
        botResponse = "Our pieces vary in price based on materials and complexity. Please check the product catalog or reach out to us on WhatsApp for quotes on specific custom pieces.";
      } else if (lowerText.includes("human") || lowerText.includes("agent") || lowerText.includes("whatsapp")) {
        botResponse = "I will connect you with a human representative on WhatsApp.";
        setTimeout(() => {
          window.open("https://wa.me/2348029402971", "_blank");
        }, 1500);
      } else {
        botResponse = "I'm not quite sure how to answer that. For complex questions, you can always reach out to our team directly on WhatsApp!";
      }

      setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window glass-panel">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} />
              <h3 style={{ margin: 0, fontSize: '16px' }}>Crown Concierge</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="icon-btn chatbot-close">
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-wrapper ${msg.sender}`}>
                <div className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="chatbot-quick-replies">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                className="quick-reply-btn"
                onClick={() => handleSend(reply)}
              >
                {reply}
              </button>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="chatbot-input"
            />
            <button onClick={() => handleSend()} className="chatbot-send-btn">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="fab-column">
        <a
          href="https://wa.me/2348029402971"
          target="_blank"
          rel="noopener noreferrer"
          className="fab-btn fab-whatsapp"
        >
          <Phone size={24} />
        </a>
        <button
          className="fab-btn chatbot-fab"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
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
    try {
      const savedCart = localStorage.getItem('crown_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error('Error parsing cart from localStorage:', err);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const [siteSettings, setSiteSettings] = useState({
    heroTitle: "Crafted For Elegance & Majesty",
    heroSubtitle: "Premium Jewelry Collection",
    heroDescription: "Discover timeless crown jewels hand-crafted with unmatched precision, destined for royalty.",
    themeColor: "pink"
  });

  // Modal and Interactive States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isSizingOpen, setIsSizingOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });

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

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSiteSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  // Sync theme to root HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', siteSettings.themeColor || 'pink');
  }, [siteSettings.themeColor]);

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

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const showToast = (message) => {
    setToast({ message, visible: true });
  };

  const handleSearchFocus = () => {
    setTimeout(() => {
      const searchInput = document.getElementById('shop-search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <CustomCursor />
        <TrustBadge />
        <Navbar
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onCartOpen={() => setIsCartOpen(true)}
        />

        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                <StoreFront
                  products={products}
                  siteSettings={siteSettings}
                  loading={loading}
                  addToCart={addToCart}
                  onProductClick={handleProductClick}
                  onSizingOpen={() => setIsSizingOpen(true)}
                  onSubscribeSuccess={showToast}
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
                  siteSettings={siteSettings}
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

        <QuickViewModal
          product={selectedProduct}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          addToCart={addToCart}
          onSizingOpen={() => setIsSizingOpen(true)}
        />

        <SizingModal
          isOpen={isSizingOpen}
          onClose={() => setIsSizingOpen(false)}
        />

        <MobileBottomNav
          onCartOpen={() => setIsCartOpen(true)}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onSearchFocus={handleSearchFocus}
        />

        <Toast
          message={toast.message}
          visible={toast.visible}
          onClose={() => setToast({ ...toast, visible: false })}
        />

        <ChatBot />

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
              </ul>
            </div>
          </div>
          <div className="container footer-bottom">
            <p>&copy; {new Date().getFullYear()} Crown Collection. Crafted with royal elegance.</p>
            <p>Developed with ❤️| Built by GHDCODES</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
