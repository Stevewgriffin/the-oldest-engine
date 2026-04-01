/* ==============================
   THE OLDEST ENGINE — TIMELINE JS
   ============================== */

(function () {
  'use strict';

  const entries = document.querySelectorAll('.timeline-entry');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterCount = document.getElementById('filterCount');
  const toggleAllBtn = document.getElementById('toggleAllBtn');
  const totalEntries = entries.length;

  let allExpanded = false;

  // --- Expand / Collapse a single entry ---
  function toggleEntry(entry) {
    const isExpanded = entry.classList.contains('expanded');
    if (isExpanded) {
      entry.classList.remove('expanded');
      entry.setAttribute('aria-expanded', 'false');
    } else {
      entry.classList.add('expanded');
      entry.setAttribute('aria-expanded', 'true');
    }
    updateToggleAllLabel();
  }

  // --- Click handler for entries ---
  entries.forEach(function (entry) {
    entry.addEventListener('click', function (e) {
      // Don't toggle if user is selecting text
      if (window.getSelection().toString().length > 0) return;
      toggleEntry(entry);
    });

    entry.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleEntry(entry);
      }
    });
  });

  // --- Expand All / Collapse All ---
  function updateToggleAllLabel() {
    const visibleEntries = document.querySelectorAll('.timeline-entry:not(.hidden)');
    const expandedVisible = document.querySelectorAll('.timeline-entry:not(.hidden).expanded');
    allExpanded = visibleEntries.length > 0 && expandedVisible.length === visibleEntries.length;
    toggleAllBtn.textContent = allExpanded ? 'Collapse All' : 'Expand All';
    toggleAllBtn.setAttribute('aria-label', allExpanded ? 'Collapse all entries' : 'Expand all entries');
  }

  toggleAllBtn.addEventListener('click', function () {
    allExpanded = !allExpanded;
    entries.forEach(function (entry) {
      if (entry.classList.contains('hidden')) return;
      if (allExpanded) {
        entry.classList.add('expanded');
        entry.setAttribute('aria-expanded', 'true');
      } else {
        entry.classList.remove('expanded');
        entry.setAttribute('aria-expanded', 'false');
      }
    });
    updateToggleAllLabel();
  });

  // --- Era Filtering ---
  function updateCount() {
    const visible = document.querySelectorAll('.timeline-entry:not(.hidden)').length;
    filterCount.textContent = 'Showing ' + visible + ' of ' + totalEntries;
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active state
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      var era = btn.getAttribute('data-era');

      entries.forEach(function (entry) {
        if (era === 'ALL' || entry.getAttribute('data-era') === era) {
          entry.classList.remove('hidden');
        } else {
          entry.classList.add('hidden');
        }
      });

      updateCount();
      updateToggleAllLabel();
    });
  });

  // --- Scroll-based entrance animation ---
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (obsEntries) {
      obsEntries.forEach(function (obsEntry) {
        if (obsEntry.isIntersecting) {
          obsEntry.target.classList.add('visible');
          observer.unobserve(obsEntry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    entries.forEach(function (entry) {
      entry.classList.add('animate-in');
      observer.observe(entry);
    });

    // Fallback: reveal entries already in viewport after a short delay
    setTimeout(function () {
      entries.forEach(function (entry) {
        var rect = entry.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          entry.classList.add('visible');
        }
      });
    }, 100);
  } else {
    // No IntersectionObserver — show all immediately
    entries.forEach(function (entry) {
      entry.classList.add('visible');
    });
  }

  // Initialize
  updateCount();
  updateToggleAllLabel();
})();