/**
 * Royal Hair Salon - Barbearia Odivelas
 * Core Application Logic, Booking Engine, Before/After Slider & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Before & After Fade Transformation Slider ---
  const beforeAfterContainer = document.getElementById('beforeAfterContainer');
  const beforeAfterOverlay = document.getElementById('beforeAfterOverlay');
  const beforeAfterHandle = document.getElementById('beforeAfterHandle');

  if (beforeAfterContainer && beforeAfterOverlay && beforeAfterHandle) {
    let isDragging = false;

    const setPosition = (percentage) => {
      const p = Math.max(0, Math.min(100, percentage));
      beforeAfterOverlay.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
      beforeAfterOverlay.style.webkitClipPath = `inset(0 ${100 - p}% 0 0)`;
      beforeAfterHandle.style.left = `${p}%`;
    };

    const updateSlider = (clientX) => {
      const rect = beforeAfterContainer.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      const percentage = (offsetX / rect.width) * 100;
      setPosition(percentage);

      if (window.RoyalBarberFX && Math.random() < 0.05) {
        window.RoyalBarberFX.playClipperBuzz();
      }
    };

    const getClientX = (e) => {
      if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
      if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
      return e.clientX;
    };

    const onPointerDown = (e) => {
      isDragging = true;
      updateSlider(getClientX(e));
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      updateSlider(getClientX(e));
    };

    const onTouchDown = (e) => {
      isDragging = true;
      updateSlider(getClientX(e));
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      updateSlider(getClientX(e));
    };

    beforeAfterContainer.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    beforeAfterContainer.addEventListener('touchstart', onTouchDown, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchcancel', onPointerUp);

    // Initial 50% state
    setPosition(50);
  }

  // --- 2. Services Tab Filter ---
  const tabButtons = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card-item');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.classList.add('animate-fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 3. Interactive Multi-Step Booking Engine ---
  const bookingModal = document.getElementById('bookingModal');
  const openBookingBtns = document.querySelectorAll('.open-booking-modal');
  const closeBookingModalBtn = document.getElementById('closeBookingModal');
  const bookingForm = document.getElementById('royalBookingForm');

  // Booking Form State
  const bookingState = {
    service: 'Corte Royal & Fade de Precisão',
    barber: 'Marco Silva (Master Barber)',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    clientName: '',
    clientPhone: '',
    notes: ''
  };

  // Open modal
  const openModal = (preselectedService = null) => {
    if (preselectedService) {
      bookingState.service = preselectedService;

      // Select matching radio
      const serviceRadios = document.querySelectorAll('input[name="serviceSelection"]');
      serviceRadios.forEach((radio) => {
        if (radio.value.includes(preselectedService.split(' ')[0])) {
          radio.checked = true;
        }
      });
    }

    if (bookingModal) {
      bookingModal.classList.remove('hidden-modal');
      bookingModal.classList.remove('hidden');
      bookingModal.style.setProperty('display', 'flex', 'important');
      document.body.style.overflow = 'hidden';
      if (window.RoyalBarberFX) window.RoyalBarberFX.playSnipSound();
    }
  };

  const closeModal = () => {
    if (bookingModal) {
      bookingModal.classList.add('hidden-modal');
      bookingModal.classList.add('hidden');
      bookingModal.style.setProperty('display', 'none', 'important');
      document.body.style.overflow = '';
    }
  };

  // Strictly ensure modal is closed and hidden initially on load
  if (bookingModal) {
    bookingModal.classList.add('hidden-modal');
    bookingModal.classList.add('hidden');
    bookingModal.style.setProperty('display', 'none', 'important');
    document.body.style.overflow = '';
  }

  openBookingBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      openModal(serviceName);
    });
  });

  if (closeBookingModalBtn) {
    closeBookingModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }

  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
  if (closeSuccessModalBtn) {
    closeSuccessModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }

  // Close on backdrop click
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (lightboxModal) {
        lightboxModal.classList.add('hidden-modal', 'hidden');
        lightboxModal.style.setProperty('display', 'none', 'important');
        document.body.style.overflow = '';
      }
    }
  });

  // Booking Form Steps Navigation
  let currentStep = 1;
  const totalSteps = 3;

  const stepContents = document.querySelectorAll('.booking-step-pane');
  const stepIndicators = document.querySelectorAll('.step-indicator-dot');
  const prevStepBtn = document.getElementById('prevStepBtn');
  const nextStepBtn = document.getElementById('nextStepBtn');
  const submitBookingBtn = document.getElementById('submitBookingBtn');

  function updateStepView() {
    stepContents.forEach((pane, idx) => {
      pane.classList.toggle('hidden', idx + 1 !== currentStep);
    });

    stepIndicators.forEach((dot, idx) => {
      if (idx + 1 < currentStep) {
        dot.className = 'step-indicator-dot w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-amber-400 text-black border-2 border-amber-400';
        dot.innerHTML = '✓';
      } else if (idx + 1 === currentStep) {
        dot.className = 'step-indicator-dot w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-amber-400 text-black ring-4 ring-amber-400/20';
        dot.innerHTML = (idx + 1).toString();
      } else {
        dot.className = 'step-indicator-dot w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-gray-800 text-gray-400 border border-gray-700';
        dot.innerHTML = (idx + 1).toString();
      }
    });

    if (prevStepBtn) {
      prevStepBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    }

    if (currentStep === totalSteps) {
      if (nextStepBtn) nextStepBtn.classList.add('hidden');
      if (submitBookingBtn) submitBookingBtn.classList.remove('hidden');
    } else {
      if (nextStepBtn) nextStepBtn.classList.remove('hidden');
      if (submitBookingBtn) submitBookingBtn.classList.add('hidden');
    }
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepView();
        if (window.RoyalBarberFX) window.RoyalBarberFX.playSnipSound();
      }
    });
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepView();
      }
    });
  }

  // Time slot chips selection
  const timeSlots = document.querySelectorAll('.time-slot-btn');
  timeSlots.forEach((slot) => {
    slot.addEventListener('click', () => {
      timeSlots.forEach((s) => s.classList.remove('bg-amber-400', 'text-black', 'font-bold'));
      timeSlots.forEach((s) => s.classList.add('bg-neutral-900', 'text-gray-300'));
      slot.classList.remove('bg-neutral-900', 'text-gray-300');
      slot.classList.add('bg-amber-400', 'text-black', 'font-bold');
      bookingState.time = slot.getAttribute('data-time') || slot.textContent.trim();
      if (window.RoyalBarberFX) window.RoyalBarberFX.playSnipSound();
    });
  });

  // Date picker constraint (min today)
  const datePicker = document.getElementById('bookingDatePicker');
  if (datePicker) {
    const todayStr = new Date().toISOString().split('T')[0];
    datePicker.min = todayStr;
    datePicker.value = todayStr;
    datePicker.addEventListener('change', (e) => {
      bookingState.date = e.target.value;
    });
  }

  // Barber selector radio
  const barberRadios = document.querySelectorAll('input[name="barberSelection"]');
  barberRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      bookingState.barber = e.target.value;
    });
  });

  // Service radio
  const serviceRadios = document.querySelectorAll('input[name="serviceSelection"]');
  serviceRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      bookingState.service = e.target.value;
    });
  });

  // Form Submission & WhatsApp Link Generator with Real Phone
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('clientNameInput');
      const phoneInput = document.getElementById('clientPhoneInput');
      const notesInput = document.getElementById('clientNotesInput');

      bookingState.clientName = nameInput ? nameInput.value.trim() : 'Cliente VIP';
      bookingState.clientPhone = phoneInput ? phoneInput.value.trim() : '';
      bookingState.notes = notesInput ? notesInput.value.trim() : '';

      // Format date nicely (DD/MM/YYYY)
      const dateParts = bookingState.date.split('-');
      const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : bookingState.date;

      // Construct WhatsApp Message in Portuguese
      const whatsappText = `👑 *ROYAL HAIR SALON - AGENDAMENTO ONLINE*
---------------------------------------
📍 *Local:* Rua Alves Redol 10A, Odivelas
✂️ *Serviço:* ${bookingState.service}
💈 *Barbeiro:* ${bookingState.barber}
📅 *Data:* ${formattedDate}
⏰ *Horário:* ${bookingState.time}
👤 *Cliente:* ${bookingState.clientName}
📱 *Contacto:* ${bookingState.clientPhone || 'N/A'}
📝 *Notas:* ${bookingState.notes || 'Sem observações'}
---------------------------------------
Gostaria de confirmar esta marcação no Royal Hair Salon. Obrigado!`;

      const encodedMsg = encodeURIComponent(whatsappText);
      // Official WhatsApp Number: +351 939 558 041
      const whatsappUrl = `https://wa.me/351939558041?text=${encodedMsg}`;

      // Show Success Modal View
      const bookingBody = document.getElementById('bookingModalStepsBody');
      const bookingSuccess = document.getElementById('bookingModalSuccess');
      const successWhatsappBtn = document.getElementById('successWhatsappLink');
      const summaryDetails = document.getElementById('bookingSummaryDetails');

      if (summaryDetails) {
        summaryDetails.innerHTML = `
          <div class="bg-neutral-900/90 border border-amber-500/30 rounded-xl p-4 text-left space-y-2 text-sm">
            <div class="flex justify-between border-b border-neutral-800 pb-2">
              <span class="text-neutral-400">Serviço:</span>
              <span class="font-bold text-amber-300">${bookingState.service}</span>
            </div>
            <div class="flex justify-between border-b border-neutral-800 pb-2">
              <span class="text-neutral-400">Barbeiro:</span>
              <span class="font-bold text-white">${bookingState.barber}</span>
            </div>
            <div class="flex justify-between border-b border-neutral-800 pb-2">
              <span class="text-neutral-400">Data & Hora:</span>
              <span class="font-bold text-white">${formattedDate} às ${bookingState.time}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-400">Morada:</span>
              <span class="text-xs text-neutral-300">Rua Alves Redol 10A, Odivelas</span>
            </div>
          </div>
        `;
      }

      if (successWhatsappBtn) {
        successWhatsappBtn.href = whatsappUrl;
      }

      if (bookingBody && bookingSuccess) {
        bookingBody.classList.add('hidden');
        bookingSuccess.classList.remove('hidden');
      }

      if (window.RoyalBarberFX) {
        window.RoyalBarberFX.playSnipSound();
      }

      // Automatically open WhatsApp in new tab after slight delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 700);
    });
  }

  // Reset Booking Form for new booking
  const resetBookingBtn = document.getElementById('newBookingResetBtn');
  if (resetBookingBtn) {
    resetBookingBtn.addEventListener('click', () => {
      currentStep = 1;
      updateStepView();
      const bookingBody = document.getElementById('bookingModalStepsBody');
      const bookingSuccess = document.getElementById('bookingModalSuccess');
      if (bookingBody && bookingSuccess) {
        bookingBody.classList.remove('hidden');
        bookingSuccess.classList.add('hidden');
      }
    });
  }

  // --- 4. Gallery Category Filter & Lightbox ---
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('galleryLightboxModal');
  const lightboxImg = document.getElementById('galleryLightboxImg');
  const lightboxCaption = document.getElementById('galleryLightboxCaption');
  const closeLightboxBtn = document.getElementById('closeGalleryLightbox');

  galleryFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-gallery-filter');

      galleryItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category');
        if (cat === 'all' || itemCat === cat) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  if (lightboxModal) {
    lightboxModal.classList.add('hidden-modal', 'hidden');
    lightboxModal.style.setProperty('display', 'none', 'important');
  }

  // Open Lightbox
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || 'Royal Hair Salon - Odivelas';
      if (lightboxModal && lightboxImg && img) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = title;
        lightboxModal.classList.remove('hidden-modal', 'hidden');
        lightboxModal.style.setProperty('display', 'flex', 'important');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.add('hidden-modal', 'hidden');
      lightboxModal.style.setProperty('display', 'none', 'important');
      document.body.style.overflow = '';
    }
  };

  if (closeLightboxBtn && lightboxModal) {
    closeLightboxBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeLightbox();
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // --- 5. Mobile Navigation Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobileMenuToggle');
  const mobileMenuDrawer = document.getElementById('mobileNavDrawer');
  const closeMobileMenuBtn = document.getElementById('closeMobileNavDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.toggle('translate-x-full');
      document.body.style.overflow = mobileMenuDrawer.classList.contains('translate-x-full') ? '' : 'hidden';
    });
  }

  if (closeMobileMenuBtn && mobileMenuDrawer) {
    closeMobileMenuBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.add('translate-x-full');
      document.body.style.overflow = '';
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileMenuDrawer) {
        mobileMenuDrawer.classList.add('translate-x-full');
        document.body.style.overflow = '';
      }
    });
  });

  // --- 6. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item-toggle');
  faqItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close other FAQs
      faqItems.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherContent = otherBtn.nextElementSibling;
          const otherIcon = otherBtn.querySelector('.faq-icon');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        if (content) content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (content) content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // --- 7. Navbar Sticky Scroll Effect ---
  const mainNavbar = document.getElementById('mainNavbar');
  if (mainNavbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        mainNavbar.classList.add('bg-black/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-amber-500/20');
        mainNavbar.classList.remove('bg-transparent');
      } else {
        mainNavbar.classList.remove('bg-black/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-amber-500/20');
        mainNavbar.classList.add('bg-transparent');
      }
    });
  }

  // --- 8. Language Switcher (PT / EN) ---
  const langToggleBtn = document.getElementById('langToggleBtn');
  let currentLang = 'pt';

  const translations = {
    pt: {
      heroTitle: 'O Melhor Salão & Barbearia em Odivelas',
      heroSub: 'Cortes de precisão, skin fade milimétrico e o autêntico ritual de toalha quente na Rua Alves Redol. Uma experiência real de grooming masculino às portas de Lisboa.',
      bookNow: 'Agendar Horário',
      servicesTitle: 'Serviços de Corte & Barbearia em Odivelas',
      servicesSub: 'Técnicas artesanais de precisão, produtos de referência europeia e atendimento personalizado na Rua Alves Redol 10A.'
    },
    en: {
      heroTitle: 'The Premier Barbershop & Hair Salon in Odivelas',
      heroSub: 'Precision haircuts, flawless skin fade and authentic hot towel beard rituals on Rua Alves Redol. A royal grooming experience in Greater Lisbon.',
      bookNow: 'Book Appointment',
      servicesTitle: 'Haircut & Barber Services in Odivelas',
      servicesSub: 'Master craftsmanship, European grooming products, and tailored attention on Rua Alves Redol 10A.'
    }
  };

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'pt' ? 'en' : 'pt';
      
      const langFlag = document.getElementById('langFlag');
      if (langFlag) {
        langFlag.textContent = currentLang === 'pt' ? '🇵🇹' : '🇬🇧';
      } else {
        langToggleBtn.innerHTML = `<span class="text-[14px]">🌍</span> <span id="langFlag">${currentLang === 'pt' ? '🇵🇹' : '🇬🇧'}</span>`;
      }

      const heroTitleEl = document.getElementById('transHeroTitle');
      const heroSubEl = document.getElementById('transHeroSub');
      const transServicesTitle = document.getElementById('transServicesTitle');
      const transServicesSub = document.getElementById('transServicesSub');

      if (heroTitleEl) heroTitleEl.innerHTML = translations[currentLang].heroTitle;
      if (heroSubEl) heroSubEl.textContent = translations[currentLang].heroSub;
      if (transServicesTitle) transServicesTitle.textContent = translations[currentLang].servicesTitle;
      if (transServicesSub) transServicesSub.textContent = translations[currentLang].servicesSub;
    });
  }

  // --- 10. Theme Toggle (Light/Dark) ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  let isLightMode = false;

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      isLightMode = !isLightMode;
      if (isLightMode) {
        document.body.classList.add('light-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
      } else {
        document.body.classList.remove('light-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
      }
    });
  }
});
