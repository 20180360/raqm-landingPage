/**
 * Raqm Landing Page - Interactive JavaScript
 * Handles tabs, counters, accordion, and interactive animations
 */
const ASSETS = {layersIcon2: 'assets/icons/LayersIcon.svg'};
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initEcosystemTabs();
  initShowcaseSlideshow();
  initStatsCounter();
  initFaqAccordion();
  initSmoothScroll();
  initRaqmTestimonialsTicker();
});
document.querySelectorAll("[data-icon]").forEach(img => {
  const key = img.dataset.icon;
  if (ASSETS[key]) img.src = ASSETS[key];
});
/* --- Navbar Scroll Effect & Mobile Menu --- */
/* --- Navbar Scroll Effect: Smooth Hide/Show --- */
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".hero-floating-card");

  if (!cards.length) return;

  let currentCard = 0;

  cards.forEach((card, index) => {
    card.classList.toggle("active", index === 0);
  });

  setInterval(() => {

    cards[currentCard].classList.remove("active");

    currentCard = (currentCard + 1) % cards.length;

    cards[currentCard].classList.add("active");

  }, 3000);
});
function initNavbar() {
  const navbar = document.querySelector('.navbar-container');
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navActions = document.querySelector('.nav-actions');

  let lastScrollY = window.scrollY;
  let ticking = false;
  let isNavbarHidden = false;
  let hideTimeout = null;
  let isHovering = false;

  // دالة لإظهار الـ Navbar بشكل أنعم
  function showNavbar(instant = false) {
    if (!isNavbarHidden) return;
    isNavbarHidden = false;
    
    // إزالة كلاس الإخفاء
    header.classList.remove('navbar-hidden');
    header.classList.add('navbar-visible');
    
    // إضافة كلاس الظهور مع أنيميشن
    navbar.classList.remove('navbar-disappear');
    navbar.classList.add('navbar-appear');
    
    // إزالة كلاس الظهور بعد الانتهاء
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      navbar.classList.remove('navbar-appear');
    }, 900);
    
    // تحديث الخلفية
    updateNavbarStyle();
  }

  // دالة لإخفاء الـ Navbar بشكل أنعم
  function hideNavbar(instant = false) {
    if (isNavbarHidden || isHovering) return;
    isNavbarHidden = true;
    
    // إزالة كلاس الظهور
    navbar.classList.remove('navbar-appear');
    
    // إضافة كلاس الإخفاء مع أنيميشن
    navbar.classList.add('navbar-disappear');
    
    // إخفاء الـ Header بعد الأنيميشن
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      header.classList.add('navbar-hidden');
      header.classList.remove('navbar-visible');
      navbar.classList.remove('navbar-disappear');
    }, instant ? 100 : 800);
  }

  // دالة تحديث خلفية الـ Navbar
  function updateNavbarStyle() {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(2, 25, 26, 0.97)';
      navbar.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.5)';
      navbar.style.borderColor = 'rgba(2, 204, 179, 0.25)';
    } else {
      navbar.style.background = 'rgba(3, 36, 37, 0.85)';
      navbar.style.boxShadow = 'var(--shadow-header)';
      navbar.style.borderColor = 'rgba(2, 204, 179, 0.15)';
    }
  }

  // دالة التعامل مع التمرير
  function handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollThreshold = 60;

    // في أعلى الصفحة: إظهار فوري
    if (currentScrollY < 20) {
      showNavbar(true);
      lastScrollY = currentScrollY;
      return;
    }

    const isScrollingDown = currentScrollY > lastScrollY + 8;
    const isScrollingUp = currentScrollY < lastScrollY - 8;

    if (isScrollingDown && currentScrollY > scrollThreshold) {
      // تمرير لأسفل: إخفاء أنعم
      hideNavbar();
    } else if (isScrollingUp) {
      // تمرير لأعلى: إظهار أنعم
      showNavbar();
    }

    lastScrollY = currentScrollY;
    updateNavbarStyle();
  }

  // تحسين الأداء
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  // مستمع التمرير
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- تحسينات إضافية للظهور الأكثر نعومة ---

  // 1. إظهار عند hover على منطقة الـ Header
  header.addEventListener('mouseenter', () => {
    isHovering = true;
    if (isNavbarHidden) {
      showNavbar();
    }
  });

  header.addEventListener('mouseleave', () => {
    isHovering = false;
    // إذا كنا في منتصف الصفحة، نعيد الإخفاء بعد تأخير
    if (window.scrollY > 100 && !isNavbarHidden) {
      setTimeout(() => {
        if (!isHovering && window.scrollY > 100) {
          hideNavbar();
        }
      }, 1500);
    }
  });

  // 2. إظهار عند تحريك الماوس لأعلى الصفحة
  let mouseMoveTimeout = null;
  document.addEventListener('mousemove', (e) => {
    if (e.clientY < 80 && isNavbarHidden) {
      showNavbar();
      // إخفاء مرة أخرى بعد 3 ثواني إذا لم يتحرك المستخدم
      clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = setTimeout(() => {
        if (window.scrollY > 100 && !isHovering) {
          hideNavbar();
        }
      }, 3000);
    }
  });

  // 3. إظهار عند التمرير السريع لأعلى (عجلة الفأرة)
  let wheelTimeout = null;
  window.addEventListener('wheel', (e) => {
    if (e.deltaY < -30 && isNavbarHidden) {
      showNavbar();
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (window.scrollY > 100 && !isHovering) {
          hideNavbar();
        }
      }, 2000);
    }
  }, { passive: true });

  // 4. دعم اللمس (Touch)
  let touchStartY = 0;
  let touchEndY = 0;
  
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    touchEndY = e.touches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    if (diff > 20 && !isNavbarHidden && window.scrollY > 80) {
      hideNavbar();
    }
    if (diff < -20 && isNavbarHidden) {
      showNavbar();
    }
  }, { passive: true });

  // 5. إظهار عند النقر على أي عنصر تفاعلي
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, input, [role="button"]');
    if (target && isNavbarHidden) {
      showNavbar();
      setTimeout(() => {
        if (window.scrollY > 100 && !isHovering) {
          hideNavbar();
        }
      }, 2500);
    }
  });

  // 6. Mobile menu
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (isNavbarHidden) {
        showNavbar();
      }
      
      const isExpanded = navLinks.classList.toggle('show-mobile');
      if (navActions) navActions.classList.toggle('show-mobile');
      mobileToggle.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // التهيئة الأولية
  updateNavbarStyle();
  header.classList.add('navbar-visible');
}
/* --- تحسين إظهار الـ Navbar عند العودة لأعلى الصفحة بسرعة --- */
function initNavbarEnhancements() {
  const header = document.querySelector('.site-header');
  const navbar = document.querySelector('.navbar-container');
  
  // إظهار الـ Navbar عند الضغط على أي زر في الصفحة (تجربة أفضل)
  document.addEventListener('click', (e) => {
    // إذا كان الـ Navbar مخفياً ونقر المستخدم في أي مكان
    if (header && header.style.transform === 'translateY(-120%)') {
      // نتحقق إذا كان النقر على رابط أو زر
      const target = e.target.closest('a, button, input, [role="button"]');
      if (target) {
        // نعيد الـ Navbar بسرعة
        header.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
        header.style.transform = 'translateY(0)';
        header.style.opacity = '1';
        
        // بعد ثانية، نعيد التحكم للتمرير
        setTimeout(() => {
          // لا نفعل شيئاً، الـ Navbar سيبقى ظاهراً حتى التمرير التالي
        }, 1000);
      }
    }
  });

  // إظهار الـ Navbar عند تحريك الماوس لأعلى الشاشة (نصف العلوي)
  document.addEventListener('mousemove', (e) => {
    if (e.clientY < 60 && header) {
      const isHidden = header.style.transform === 'translateY(-120%)';
      if (isHidden) {
        header.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
        header.style.transform = 'translateY(0)';
        header.style.opacity = '1';
      }
    }
  });
}

// استدعاء الدالة في DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...
  initNavbarEnhancements();
});
/* --- Three Interfaces, One Mind (Ecosystem Tabs & Orbit Diagram) --- */

function initEcosystemTabs() {
  /*
   * ============================================================
   * Ecosystem data
   * ============================================================
   *
   * Every translatable value has:
   * ar = Arabic
   * en = English
   *
   * This prevents updateEcosystem() from replacing the translated
   * HTML with Arabic-only text.
   */

  const data = {
    erp: {
      title: {
        ar: "ERP",
        en: "ERP",
      },

      subtitle: {
        ar: "إدارة شاملة لكل عمليات أعمالك",
        en: "Complete management for every part of your business",
      },

      desc: {
        ar: "تابع المبيعات والمشتريات والمخزون والحسابات والتقارير من نظام واحد يمنحك رؤية أوضح لعمليات مؤسستك.",
        en: "Track sales, purchasing, inventory, accounting, and reports from a single system that gives you clearer visibility into your organization's operations.",
      },

      panelIcon: "assets/icons/LayersIcon.svg",

      features: [
        {
          title: {
            ar: "إدارة المبيعات",
            en: "Sales Management",
          },
          short: {
            ar: "المبيعات",
            en: "Sales",
          },
          desc: {
            ar: "متابعة العملاء والفرص والعقود",
            en: "Track opportunities, customers, and contracts",
          },
          icon: "assets/icons/TrendIcon.svg",
        },

        {
          title: {
            ar: "إدارة المشتريات",
            en: "Purchasing Management",
          },
          short: {
            ar: "المشتريات",
            en: "Purchasing",
          },
          desc: {
            ar: "طلبات الشراء، الموردين، والعقود",
            en: "Purchase orders, suppliers, and contracts",
          },
          icon: "assets/icons/CartIcon.svg",
        },

        {
          title: {
            ar: "إدارة المخزون",
            en: "Inventory Management",
          },
          short: {
            ar: "المخزون",
            en: "Inventory",
          },
          desc: {
            ar: "المخزون، الجرد، والمستودعات",
            en: "Stock, inventory counts, and warehouses",
          },
          icon: "assets/icons/BoxIcon.svg",
        },

        {
          title: {
            ar: "الحسابات المالية",
            en: "Financial Accounting",
          },
          short: {
            ar: "الحسابات",
            en: "Accounting",
          },
          desc: {
            ar: "القيود، الفواتير، والمدفوعات",
            en: "Journal entries, invoices, and payments",
          },
          icon: "assets/icons/AccountingIcon.svg",
        },

        {
          title: {
            ar: "التقارير والتحليلات",
            en: "Reports & Analytics",
          },
          short: {
            ar: "التقارير",
            en: "Reports",
          },
          desc: {
            ar: "تقارير ذكية لرؤية أوضح",
            en: "Smart reports for clearer visibility",
          },
          icon: "assets/icons/PieIcon.svg",
        },

        {
          title: {
            ar: "إدارة العمليات",
            en: "Operations Management",
          },
          short: {
            ar: "العمليات",
            en: "Operations",
          },
          desc: {
            ar: "أتمتة وتبسيط جميع العمليات",
            en: "Automate and simplify every process",
          },
          icon: "assets/icons/GearIcon.svg",
        },
      ],
    },

    hrSystem: {
      title: {
        ar: "نظام الموارد البشرية",
        en: "HR System",
      },

      subtitle: {
        ar: "إدارة أوضح للموظفين وعمليات الموارد البشرية",
        en: "Clearer management for employees and HR operations",
      },

      desc: {
        ar: "نظم بيانات الموظفين والحضور والإجازات والرواتب والتقييمات، وسهل على فريق الموارد البشرية متابعة الإجراءات من نظام واحد.",
        en: "Organize employee data, attendance, leaves, payroll, and performance evaluations, while making it easier for your HR team to manage processes from one system.",
      },

      panelIcon: "assets/icons/MonitorIcon.svg",

      features: [
        {
          title: {
            ar: "إدارة الموظفين",
            en: "Employee Management",
          },
          short: {
            ar: "الموظفين",
            en: "Employees",
          },
          desc: {
            ar: "تنظيم ملفات الموظفين وبياناتهم.",
            en: "Organize employee files and data.",
          },
          icon: "assets/icons/user-dark.svg",
        },

        {
          title: {
            ar: "الحضور والانصراف",
            en: "Attendance Management",
          },
          short: {
            ar: "الحضور",
            en: "Attendance",
          },
          desc: {
            ar: "متابعة أوقات الحضور وساعات العمل.",
            en: "Track attendance times and working hours.",
          },
          icon: "assets/icons/icon-calendar.svg",
        },

        {
          title: {
            ar: "إدارة الرواتب",
            en: "Payroll Management",
          },
          short: {
            ar: "الرواتب",
            en: "Payroll",
          },
          desc: {
            ar: "تنظيم بيانات الرواتب والاستحقاقات",
            en: "Organize payroll and compensation data.",
          },
          icon: "assets/icons/icon-calculator.svg",
        },

        {
          title: {
            ar: "تقييم الأداء",
            en: "Performance Evaluation",
          },
          short: {
            ar: "الأداء",
            en: "Performance",
          },
          desc: {
            ar: "متابعة الطلبات والموافقات بسهولة.",
            en: "Easily track requests and approvals.",
          },
          icon: "assets/icons/icon-star.svg",
        },

        {
          title: {
            ar: "الإجازات والطلبات",
            en: "Leaves & Requests",
          },
          short: {
            ar: "الطلبات",
            en: "Requests",
          },
          desc: {
            ar: "متابعة الطلبات والموافقات بسهولة.",
            en: "Easily track requests and approvals.",
          },
          icon: "assets/icons/icon-file-text.svg",
        },

        {
          title: {
            ar: "التقارير والتحليلات",
            en: "Reports & Analytics",
          },
          short: {
            ar: "التقارير",
            en: "Reports",
          },
          desc: {
            ar: "بيانات وتقارير تساعدك على متابعة فريقك.",
            en: "Data and reports that help you monitor your team.",
          },
          icon: "assets/icons/icon-shield.svg",
        },
      ],
    },

    hrApp: {
      title: {
        ar: "تطبيق الموارد البشرية",
        en: "HR App",
      },

      subtitle: {
        ar: "تجربة موظف رقمية في متناول اليد",
        en: "A digital employee experience at your fingertips",
      },

      desc: {
        ar: "تطبيق جوال سهل وسريع يتيح للموظف تقديم ومتابعة جميع طلباته، الاطلاع على كشوف الرواتب، واستقبال الإشعارات الفورية.",
        en: "A fast and easy mobile app that lets employees submit and track requests, view payslips, and receive instant notifications.",
      },

      panelIcon: "assets/icons/PhoneIcon.svg",

      features: [
        {
          title: {
            ar: "تقديم الطلبات بسهولة",
            en: "Easy Request Submission",
          },
          short: {
            ar: "الطلبات",
            en: "Requests",
          },
          desc: {
            ar: "إجازات، سلف، أذونات بضغطة زر واحدة",
            en: "Leaves, advances, and permissions with one tap",
          },
          icon: "assets/icons/icon-send.svg",
        },

        {
          title: {
            ar: "تسجيل الحضور الذكي",
            en: "Smart Attendance",
          },
          short: {
            ar: "الحضور",
            en: "Attendance",
          },
          desc: {
            ar: "تسجيل الحضور عبر الموقع الجغرافي للجوال",
            en: "Record attendance using mobile geolocation",
          },
          icon: "assets/icons/icon-calendar.svg",
        },

        {
          title: {
            ar: "كشف الراتب الفوري",
            en: "Instant Payslip",
          },
          short: {
            ar: "الراتب",
            en: "Payroll",
          },
          desc: {
            ar: "تحميل كشوف الرواتب ومفردات الاستحقاق",
            en: "Download payslips and salary details",
          },
          icon: "assets/icons/icon-wallet.svg",
        },

        {
          title: {
            ar: "إشعارات وتنبيهات مباشرة",
            en: "Instant Notifications & Alerts",
          },
          short: {
            ar: "الإشعارات",
            en: "Notifications",
          },
          desc: {
            ar: "تنبيهات فورية بحالة الطلبات والمهام",
            en: "Instant alerts about requests and tasks",
          },
          icon: "assets/icons/icon-bell.svg",
        },

        {
          title: {
            ar: "متابعة المهام والأداء",
            en: "Task & Performance Tracking",
          },
          short: {
            ar: "المهام",
            en: "Tasks",
          },
          desc: {
            ar: "نظرة سريعة على المهام اليومية والتقدم",
            en: "A quick view of daily tasks and progress",
          },
          icon: "assets/icons/icon-smile.svg",
        },

        {
          title: {
            ar: "الوصول السريع للبيانات",
            en: "Quick Data Access",
          },
          short: {
            ar: "البيانات",
            en: "Data",
          },
          desc: {
            ar: "تحديث البيانات الشخصية في أي وقت ومن أي مكان",
            en: "Update personal data anytime, anywhere",
          },
          icon: "assets/icons/icon-smartphone.svg",
        },
      ],
    },
  };

  /*
   * ============================================================
   * Language helper
   * ============================================================
   */

  function getCurrentLanguage() {
    const htmlLang = document.documentElement.lang?.toLowerCase();

    if (htmlLang === "en" || htmlLang === "en-us" || htmlLang === "en-gb") {
      return "en";
    }

    if (htmlLang === "ar" || htmlLang === "ar-eg") {
      return "ar";
    }

    const storedLang =
      localStorage.getItem("language") ||
      localStorage.getItem("lang") ||
      localStorage.getItem("siteLanguage");

    if (
      storedLang === "en" ||
      storedLang === "en-US" ||
      storedLang === "en-GB"
    ) {
      return "en";
    }

    return "ar";
  }

  function getText(value) {
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    return value[getCurrentLanguage()] || value.ar || value.en || "";
  }

  /*
   * ============================================================
   * DOM elements
   * ============================================================
   */

  const orbitVisual = document.querySelector(".orbit-visual-container");

  const orbitNodes = document.querySelectorAll(".orbit-node");
  const orbitAccents = document.querySelectorAll(".orbit-accent");
  const orbitHotspots = document.querySelectorAll(".orbit-node");

  const navRailBtns = document.querySelectorAll(".nav-rail-btn");

  const ecosystemPanel = document.querySelector(".ecosystem-panel");
  const panelIcon = document.querySelector(".glow-icon img");
  const panelTitle = document.querySelector(".panel-title-group h3");
  const panelSubtitle = document.querySelector(
    ".panel-title-group .panel-subtitle"
  );
  const panelDesc = document.querySelector(".panel-desc");
  const featuresGrid = document.querySelector(".ecosystem-features-grid");
  const fanLayer = document.querySelector(".orbit-fan-layer");

  let activeTab = "erp";

  let fanRemovalTimer = null;

  const FAN_TRANSITION_MS = 400;

  /*
   * ============================================================
   * Update complete ecosystem state
   * ============================================================
   */

  function updateEcosystem(key) {
    const item = data[key];

    if (!item) return;

    activeTab = key;

    /*
     * ----------------------------------------------------------
     * Switch orbit diagram state
     * ----------------------------------------------------------
     */

    orbitNodes.forEach((node) => {
      node.classList.toggle("is-active", node.dataset.tab === key);
    });

    orbitAccents.forEach((accent) => {
      accent.classList.toggle(
        "is-active",
        accent.dataset.accent === key
      );
    });

    /*
     * ----------------------------------------------------------
     * Update nav active state
     * ----------------------------------------------------------
     */

    navRailBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === key);
    });

    /*
     * ----------------------------------------------------------
     * Theme panel
     * ----------------------------------------------------------
     */

    if (ecosystemPanel) {
      ecosystemPanel.dataset.active = key;

      ecosystemPanel.classList.remove(
        "theme-erp",
        "theme-hrSystem",
        "theme-hrApp"
      );

      ecosystemPanel.classList.add(`theme-${key}`);
    }

    /*
     * ----------------------------------------------------------
     * Update panel icon
     * ----------------------------------------------------------
     */

    if (panelIcon) {
      panelIcon.src = item.panelIcon;
    }

    /*
     * ----------------------------------------------------------
     * Update panel title
     * ----------------------------------------------------------
     */

    if (panelTitle) {
      panelTitle.textContent = getText(item.title);
    }

    /*
     * ----------------------------------------------------------
     * Update panel subtitle
     * ----------------------------------------------------------
     */

    if (panelSubtitle) {
      panelSubtitle.textContent = getText(item.subtitle);
    }

    /*
     * ----------------------------------------------------------
     * Update panel description
     * ----------------------------------------------------------
     */

    if (panelDesc) {
      panelDesc.textContent = getText(item.desc);
    }

    /*
     * ----------------------------------------------------------
     * Update feature cards
     * ----------------------------------------------------------
     */

    if (featuresGrid) {
      featuresGrid.innerHTML = item.features
        .map(
          (feature) => `
            <div class="feature-tile">

              <div class="feature-tile-icon">
                <img
                  src="${feature.icon}"
                  alt=""
                  width="20"
                  height="20"
                />
              </div>

              <div class="feature-tile-info">
                <h5>${getText(feature.title)}</h5>
                <p>${getText(feature.desc)}</p>
              </div>

            </div>
          `
        )
        .join("");
    }
  }

  /*
   * ============================================================
   * Build feature fan
   * ============================================================
   */

  function buildFan(key) {
    if (!fanLayer || !orbitVisual) return;

    const item = data[key];

    if (!item) return;

    /*
     * Cancel previous removal
     */

    if (fanRemovalTimer) {
      clearTimeout(fanRemovalTimer);
      fanRemovalTimer = null;
    }

    fanLayer.innerHTML = "";

    const count = item.features.length;

    const startAngle = -75;
    const spread = 130;
    const radius = 118;

    item.features.forEach((feature, index) => {
      const angleDeg =
        startAngle +
        (spread / (count - 1)) * index;

      const angleRad =
        (angleDeg * Math.PI) / 180;

      const x =
        Math.cos(angleRad) * radius;

      const y =
        Math.sin(angleRad) * radius;

      /*
       * Connecting line
       */

      const line = document.createElement("div");

      line.className =
        `orbit-fan-line accent-${key}`;

      line.style.setProperty(
        "--fan-angle",
        `${angleDeg}deg`
      );

      line.style.setProperty(
        "--fan-len",
        `${radius}px`
      );

      fanLayer.appendChild(line);

      /*
       * Feature node
       */

      const node = document.createElement("div");

      node.className =
        `orbit-fan-node accent-${key}`;

      node.style.setProperty(
        "--fan-x",
        `${x}px`
      );

      node.style.setProperty(
        "--fan-y",
        `${y}px`
      );

      node.innerHTML = `
        <span>
          ${getText(feature.short)}
        </span>
      `;

      fanLayer.appendChild(node);

      /*
       * Stagger animation
       */

      window.requestAnimationFrame(() => {
        setTimeout(() => {
          line.classList.add("show");
          node.classList.add("show");
        }, index * 40);
      });
    });
  }

  /*
   * ============================================================
   * Clear feature fan
   * ============================================================
   */

  function clearFan() {
    if (!fanLayer) return;

    fanLayer
      .querySelectorAll(".show")
      .forEach((element) => {
        element.classList.remove("show");
      });

    if (fanRemovalTimer) {
      clearTimeout(fanRemovalTimer);
    }

    fanRemovalTimer = setTimeout(() => {
      fanLayer.innerHTML = "";
      fanRemovalTimer = null;
    }, FAN_TRANSITION_MS);
  }

  /*
   * ============================================================
   * Enter hover / deep mode
   * ============================================================
   */

  function enterDrill(key) {
    if (!orbitVisual) return;

    /*
     * Make sure the hovered tab becomes the active ecosystem
     */

    updateEcosystem(key);

    /*
     * Enter deep mode
     */

    orbitVisual.classList.add("deep-mode");

    /*
     * Build its own feature fan
     */

    buildFan(key);
  }

  /*
   * ============================================================
   * Leave hover / deep mode
   * ============================================================
   */

  function leaveDrill() {
    if (!orbitVisual) return;

    orbitVisual.classList.remove("deep-mode");

    clearFan();
  }

  /*
   * ============================================================
   * Orbit hover + click
   * ============================================================
   */

  orbitHotspots.forEach((hotspot) => {
    const tabKey = hotspot.dataset.tab;

    /*
     * Click
     */

    hotspot.addEventListener("click", () => {
      updateEcosystem(tabKey);
    });

    /*
     * Hover
     */

    hotspot.addEventListener("mouseenter", () => {
      enterDrill(tabKey);
    });

    hotspot.addEventListener("mouseleave", () => {
      leaveDrill();
    });
  });

  /*
   * ============================================================
   * Navigation rail click
   * ============================================================
   */

  navRailBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      updateEcosystem(btn.dataset.tab);
    });
  });

  /*
   * ============================================================
   * Re-render ecosystem when language changes
   * ============================================================
   *
   * This supports projects where the language switcher changes
   * <html lang="..."> or localStorage.
   */

  window.addEventListener("languageChanged", () => {
    updateEcosystem(activeTab);

    if (orbitVisual?.classList.contains("deep-mode")) {
      buildFan(activeTab);
    }
  });

  /*
   * Also watch the html lang attribute.
   * This makes the ecosystem update even if the existing
   * language switcher only changes document.documentElement.lang.
   */

  const languageObserver = new MutationObserver(() => {
    updateEcosystem(activeTab);

    if (orbitVisual?.classList.contains("deep-mode")) {
      buildFan(activeTab);
    }
  });

  languageObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang", "dir"],
  });

  /*
   * ============================================================
   * Initialize
   * ============================================================
   */

  updateEcosystem("erp");
}


/* --- Product Showcase Tabs (Laptop display switcher) --- */
/* =========================================================
   Raqm Showcase Slideshow
   ========================================================= */

function initShowcaseSlideshow() {
  const image = document.getElementById("showcaseImage");
  const imageWrapper = document.querySelector(".laptop-screen-switch");
  const details = document.querySelector(".showcase-details");

  const title = document.getElementById("showcaseTitle");
  const description = document.getElementById("showcaseDescription");
  const checklist = document.getElementById("showcaseChecklist");

  const tabs = document.querySelectorAll(".tab-pill");

  if (
    !image ||
    !imageWrapper ||
    !details ||
    !title ||
    !description ||
    !checklist
  ) {
    return;
  }

  let activeSystem = "erp";
  let activeSlide = 0;

  let timer = null;
  let transitionTimer = null;

  const SLIDE_DURATION = 5000;
  const TRANSITION_DURATION = 500;

  function updateContent(systemKey, slideIndex, animate = true) {
    const system = RAQM_SHOWCASE_DATA[systemKey];

    if (!system) return;

    const slide = system.slides[slideIndex];

    if (!slide) return;

    if (animate) {
      imageWrapper.classList.remove("is-entering");
      imageWrapper.classList.add("is-changing");

      details.classList.remove("showcase-entering");
      details.classList.add("showcase-changing");
    }

    clearTimeout(transitionTimer);

    transitionTimer = setTimeout(
      () => {
        /*
         * IMAGE
         */
        image.src = slide.image;
        image.alt = slide.title;

        /*
         * TEXT
         */
        title.textContent = slide.title;
        description.textContent = slide.description;

        /*
         * FEATURES
         */
        checklist.innerHTML = slide.features
          .map((feature) => `<li>${feature}</li>`)
          .join("");

        /*
         * ENTER ANIMATION
         */
        imageWrapper.classList.remove("is-changing");

        void imageWrapper.offsetWidth;

        imageWrapper.classList.add("is-entering");

        details.classList.remove("showcase-changing");

        void details.offsetWidth;

        details.classList.add("showcase-entering");

        setTimeout(() => {
          imageWrapper.classList.remove("is-entering");
          details.classList.remove("showcase-entering");
        }, TRANSITION_DURATION);
      },
      animate ? 300 : 0
    );
  }

  /*
   * =======================================================
   * START SLIDESHOW
   * =======================================================
   */

  function startSlideshow() {
    clearInterval(timer);

    timer = setInterval(() => {
      const system = RAQM_SHOWCASE_DATA[activeSystem];

      if (!system) return;

      activeSlide++;

      /*
       * بعد آخر Slide
       * نرجع لأول Slide
       */
      if (activeSlide >= system.slides.length) {
        activeSlide = 0;
      }

      updateContent(
        activeSystem,
        activeSlide,
        true
      );
    }, SLIDE_DURATION);
  }

  /*
   * =======================================================
   * CHANGE SYSTEM
   * =======================================================
   */

  function changeSystem(systemKey) {
    if (!RAQM_SHOWCASE_DATA[systemKey]) return;

    activeSystem = systemKey;
    activeSlide = 0;

    /*
     * Active tab
     */
    tabs.forEach((tab) => {
      tab.classList.toggle(
        "active",
        tab.dataset.showcase === systemKey
      );
    });

    /*
     * أول Slide للنظام الجديد
     */
    updateContent(
      activeSystem,
      activeSlide,
      true
    );

    /*
     * Restart timer
     */
    startSlideshow();
  }

  /*
   * =======================================================
   * TAB EVENTS
   * =======================================================
   */

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const systemKey = tab.dataset.showcase;

      if (systemKey === activeSystem) return;

      changeSystem(systemKey);
    });
  });

  /*
   * =======================================================
   * INITIAL STATE
   * =======================================================
   */

  updateContent(
    activeSystem,
    activeSlide,
    false
  );

  startSlideshow();
}


/*
 * Initialize Showcase
 */

document.addEventListener(
  "DOMContentLoaded",
  initShowcaseSlideshow
);

/*
 * Initialize
 */

document.addEventListener(
  "DOMContentLoaded",
  initShowcaseSlideshow
);

/* --- Animated Stats Counter on Scroll --- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-count');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(counter => {
          const target = parseInt(counter.dataset.target, 10);
          const duration = 1800; // ms
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.section-stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* --- FAQ Accordion --- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open accordions
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      btn.setAttribute('aria-expanded', String(!isActive));
    });
  });
}

/* --- Smooth Scroll for in-page anchor links --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
/* =============================================
   SCROLL REVEAL ANIMATIONS - Smooth & Slow
   ============================================= */

/* =============================================
   SCROLL REVEAL ANIMATIONS - Smooth & Slow
   ============================================= */

/* =============================================
   SCROLL REVEAL ANIMATIONS - Smooth & Slow
   ============================================= */

function initScrollReveal() {
  // Select all elements with reveal classes
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-stagger, .reveal-scale, .reveal-flip, .reveal-bounce, .reveal-fade, .reveal-glow'
  );

  // تأخير أبطأ للظهور
  const getDelayForElement = (element) => {
    if (element.classList.contains('reveal-glow')) {
      return 400 + Math.random() * 200;
    }
    if (element.classList.contains('reveal-scale') || element.classList.contains('reveal-flip')) {
      return 300 + Math.random() * 200;
    }
    if (element.classList.contains('reveal-bounce')) {
      return 250 + Math.random() * 150;
    }
    if (element.classList.contains('reveal-fade')) {
      return 200 + Math.random() * 150;
    }
    return 250 + Math.random() * 200;
  };

  // سرعة الحركة - أبطأ
  const getTransitionDuration = (element) => {
    if (element.classList.contains('reveal-glow')) {
      return '2.0s';
    }
    if (element.classList.contains('reveal-scale') || element.classList.contains('reveal-flip')) {
      return '1.6s';
    }
    if (element.classList.contains('reveal-bounce')) {
      return '1.4s';
    }
    if (element.classList.contains('reveal-fade')) {
      return '1.2s';
    }
    return '1.4s';
  };

  // تطبيق السرعة على كل عنصر
  revealElements.forEach(el => {
    const duration = getTransitionDuration(el);
    el.style.transition = `opacity ${duration} cubic-bezier(0.22, 1, 0.36, 1), transform ${duration} cubic-bezier(0.22, 1, 0.36, 1), filter ${duration} cubic-bezier(0.22, 1, 0.36, 1)`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = getDelayForElement(el);
        
        setTimeout(() => {
          el.classList.add('show');
        }, delay);
        
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  // معالجة الـ stagger - أبطأ
  const staggerElements = document.querySelectorAll('.reveal-stagger');
  staggerElements.forEach(parent => {
    const parentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          parent.classList.add('show');
          
          const children = parent.children;
          Array.from(children).forEach((child, index) => {
            const childDelay = 150 + (index * 150); // تأخير أطول
            child.style.transitionDelay = `${childDelay}ms`;
          });
          
          parentObserver.unobserve(parent);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });
    
    parentObserver.observe(parent);
  });
}

/* --- وظيفة مساعدة لإعادة تشغيل الأنيمشن --- */
function resetReveal(element) {
  if (!element) return;
  element.classList.remove('show');
  // إزالة أي transition-delay مضافة
  if (element.style.transitionDelay) {
    element.style.transitionDelay = '0ms';
  }
  // إعادة المراقبة
  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          element.classList.add('show');
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.12 });
    observer.observe(element);
  }, 100);
}

/* --- وظيفة لإعادة تشغيل كل الأنيمشنات في الصفحة --- */
function resetAllReveals() {
  const elements = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-scale, .reveal-flip, .reveal-bounce, .reveal-fade, .reveal-glow');
  elements.forEach(el => resetReveal(el));
}

/* --- Enhanced Stats Counter with Smooth Animation & Progress Bars --- */
/* --- Enhanced Stats Counter with Smooth Animation --- */
function initStatsCounterEnhanced() {
  const statsSection = document.querySelector(".stats-section");
  const statCards = document.querySelectorAll(".stats-card");
  const statDigits = document.querySelectorAll(".stats-digit");

  if (!statsSection) return;

  let animated = false;

  /* =====================================================
     ANIMATE ONE DIGIT
  ===================================================== */

  function animateDigit(digit, delay = 0) {
    const track = digit.querySelector(".stats-digit-track");

    if (!track) return;

    const numbers = track.querySelectorAll("span");

    if (!numbers.length) return;

    // آخر رقم داخل الـ track هو الرقم النهائي
    const targetIndex = numbers.length - 1;

    const digitHeight = 67.19;

    const finalPosition = -(targetIndex * digitHeight);

    track.style.setProperty(
      "--digit-offset",
      `${finalPosition}px`
    );

    setTimeout(() => {
      digit.classList.add("animate");
    }, delay);
  }


  /* =====================================================
     SHOW CARDS
  ===================================================== */

  function showCards() {
    statCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("show");
      }, index * 150);
    });
  }


  /* =====================================================
     START NUMBER ANIMATION
  ===================================================== */

  function startNumberAnimation() {
    statDigits.forEach((digit, index) => {

      // كل رقم يبدأ بعد اللي قبله
      const delay = 300 + index * 180;

      animateDigit(digit, delay);

    });
  }


  /* =====================================================
     OBSERVE SECTION
  ===================================================== */

  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting && !animated) {

          animated = true;

          // ظهور الكروت
          showCards();

          // حركة الأرقام
          startNumberAnimation();

          observer.unobserve(statsSection);
        }

      });

    },
    {
      threshold: 0.25,
      rootMargin: "0px 0px -50px 0px"
    }
  );


  observer.observe(statsSection);
}
/* --- Progress Bars Animation with Smooth Fill --- */
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.dataset.width || '75%';
        // Smooth fill with slight delay
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  progressBars.forEach(bar => observer.observe(bar));
}

/* --- Parallax reveal - elements move at different speeds --- */
function initParallaxReveal() {
  const parallaxElements = document.querySelectorAll('.parallax-reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  parallaxElements.forEach(el => observer.observe(el));
}

/* =============================================
   INIT ALL FUNCTIONS
   ============================================= */

// Make sure all functions are called after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // ... existing init functions ...
  initScrollReveal();
  initStatsCounterEnhanced();
  initProgressBars();
  initParallaxReveal();
});
/* --- إضافة تأثير بارالاكس خفيف للـ Navbar --- */
function initNavbarParallax() {
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const diff = currentScroll - lastScroll;
    
    // تأثير بارالاكس خفيف جداً
    if (currentScroll < 100) {
      const opacity = 1 - (currentScroll / 150);
      const translateY = currentScroll * 0.15;
      header.style.setProperty('--header-opacity', opacity);
      header.style.setProperty('--header-translate', `-${translateY}px`);
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

// استدعاء في DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...
  initNavbarParallax();
});
/* =========================================================
   RAQM - FRAMER-STYLE VERTICAL TESTIMONIAL TICKER
   ========================================================= */

function initRaqmTestimonialsTicker() {
  const columns = document.querySelectorAll(".testimonials-col");

  if (!columns.length) return;

  /*
   * The Framer version moves the whole vertical list with
   * transform: translateY(...) and uses cloned items for
   * the seamless loop. We reproduce the same structure here.
   */

  columns.forEach((column, columnIndex) => {
    if (column.dataset.tickerInitialized === "true") return;

    const cards = Array.from(
      column.querySelectorAll(":scope > .testimonial-card")
    );

    if (!cards.length) return;

    column.dataset.tickerInitialized = "true";
    column.classList.add("raqm-testimonial-ticker");

    /*
     * Create the same kind of moving vertical list that Framer
     * renders as its <ul>.
     */
    const track = document.createElement("div");
    track.className = "raqm-testimonials-ticker-track";

    /*
     * Move the original cards into the track.
     */
    cards.forEach((card, index) => {
      const item = document.createElement("div");

      item.className = "raqm-testimonial-item";
      item.setAttribute("aria-posinset", String(index + 1));
      item.setAttribute("aria-setsize", String(cards.length));

      item.appendChild(card);
      track.appendChild(item);
    });

    /*
     * Clone the complete original group.
     * Framer uses clone-item nodes for this exact purpose.
     */
    const originalItems = Array.from(
      track.querySelectorAll(".raqm-testimonial-item")
    );

    originalItems.forEach((item, index) => {
      const clone = item.cloneNode(true);

      clone.classList.add("is-clone");
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("aria-posinset", String(index + 1));
      clone.removeAttribute("aria-setsize");

      track.appendChild(clone);
    });

    column.appendChild(track);

    let currentY = 0;
    let lastTime = performance.now();
    let loopHeight = 0;
    let animationFrame = null;

    /*
     * Framer-like continuous speed.
     * Increase this value for a faster ticker.
     */
    const SPEED = 42;

    function getGap() {
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.rowGap || styles.gap || "24");

      return Number.isFinite(gap) ? gap : 24;
    }

    function calculateLoopHeight() {
      const gap = getGap();

      let height = 0;

      originalItems.forEach((item) => {
        height += item.getBoundingClientRect().height;
      });

      /*
       * There are:
       * original gaps + the gap between the original group
       * and the first clone.
       */
      loopHeight = height + gap * originalItems.length;
    }

    function resetPosition() {
      if (loopHeight <= 0) return;

      while (Math.abs(currentY) >= loopHeight) {
        currentY += loopHeight;
      }
    }

    function animate(time) {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      currentY -= SPEED * delta;

      resetPosition();

      /*
       * This intentionally mirrors the Framer DevTools output:
       *
       * transform: translateY(-113.288px);
       * will-change: transform;
       */
      track.style.transform = `translateY(${currentY}px)`;

      animationFrame = requestAnimationFrame(animate);
    }

    calculateLoopHeight();

    /*
     * Recalculate after fonts/images have settled because testimonial
     * card heights can change when the language or viewport changes.
     */
    window.addEventListener("load", calculateLoopHeight, {
      once: true
    });

    let resizeTimer;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        calculateLoopHeight();
        resetPosition();
      }, 100);
    });

    /*
     * Recalculate when fonts finish loading.
     */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        calculateLoopHeight();
        resetPosition();
      });
    }

    /*
     * Give the language switcher / dynamic text a chance to settle.
     */
    setTimeout(() => {
      calculateLoopHeight();
      resetPosition();
    }, 300);

    setTimeout(() => {
      calculateLoopHeight();
      resetPosition();
    }, 1000);

    /*
     * Start the animation.
     */
    animationFrame = requestAnimationFrame(animate);

    /*
     * Keep the reference available for debugging without exposing
     * anything to the page UI.
     */
    column._raqmTicker = {
      track,
      getPosition: () => currentY,
      getLoopHeight: () => loopHeight,
      animationFrame
    };
  });
}
