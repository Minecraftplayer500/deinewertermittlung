// ─── STEPPER ─────────────────────────────────────────────

const stepperState = {
  current: 1,
  total: 5,
  data: {
    typ: null,
    gewerbetyp: null,
    ort: '',
    flaeche: '',
    grundstueck: '',
    anlass: null,
    zeit: null
  }
};

// ─── DOM Refs ────────────────────────────────────────────

const stepperOverlay   = document.getElementById('stepperOverlay');
const stepperFill      = document.getElementById('stepperFill');
const stepperCount     = document.getElementById('stepperCount');
const stepperNext      = document.getElementById('stepperNext');
const stepperBack      = document.getElementById('stepperBack');
const stepperNav       = document.getElementById('stepperNav');
const gewerbeOptions   = document.getElementById('gewerbeOptions');
const stepperForm      = document.getElementById('stepperForm');
const stepperOrt       = document.getElementById('stepperOrt');
const stepperFlaeche   = document.getElementById('stepperFlaeche');
const stepperGrundstueck = document.getElementById('stepperGrundstueck');

// Hidden form fields
const hiddenTyp        = document.getElementById('hiddenTyp');
const hiddenOrt        = document.getElementById('hiddenOrt');
const hiddenFlaeche    = document.getElementById('hiddenFlaeche');
const hiddenGrundstueck = document.getElementById('hiddenGrundstueck');
const hiddenAnlass     = document.getElementById('hiddenAnlass');
const hiddenZeit       = document.getElementById('hiddenZeit');

// ─── Open / Close ─────────────────────────────────────────

function openStepper() {
  stepperOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  goToStep(1);
}

function closeStepper() {
  stepperOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Bind all open-stepper buttons
document.querySelectorAll('.open-stepper').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    openStepper();
  });
});

// Close button
document.getElementById('closeStepper').addEventListener('click', closeStepper);

// Click outside modal to close
stepperOverlay.addEventListener('click', function(e) {
  if (e.target === stepperOverlay) {
    closeStepper();
  }
});

// Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && stepperOverlay.classList.contains('open')) {
    closeStepper();
  }
});

// ─── Step Navigation ──────────────────────────────────────

function goToStep(n) {
  // Deactivate current step
  var currentEl = document.getElementById('step-' + stepperState.current);
  if (currentEl) {
    currentEl.classList.remove('active');
  }

  // Update state
  stepperState.current = n;

  // Activate new step
  var nextEl = document.getElementById('step-' + n);
  if (nextEl) {
    nextEl.classList.add('active');
  }

  updateProgress();
  updateNav();
  updateNextBtn();

  // Scroll modal to top on step change
  var modal = stepperOverlay.querySelector('.stepper-modal');
  if (modal) {
    modal.scrollTop = 0;
  }
}

function updateProgress() {
  var n = stepperState.current;

  if (n <= 5) {
    stepperFill.style.width = ((n / 5) * 100) + '%';
    stepperCount.textContent = 'Schritt ' + n + ' von 5';
    stepperNav.style.display = '';
  } else if (n === 6) {
    stepperFill.style.width = '100%';
    stepperCount.textContent = 'Fast geschafft';
    stepperNav.style.display = 'none';
  }
}

function updateNav() {
  stepperBack.disabled = stepperState.current === 1;
}

function updateNextBtn() {
  stepperNext.disabled = !canGoNext();
}

function canGoNext() {
  var n = stepperState.current;

  switch (n) {
    case 1:
      if (!stepperState.data.typ) return false;
      if (stepperState.data.typ === 'gewerbe' && !stepperState.data.gewerbetyp) return false;
      return true;
    case 2:
      return true;
    case 3:
      return stepperFlaeche && stepperFlaeche.value.trim() !== '';
    case 4:
      return stepperState.data.anlass !== null;
    case 5:
      return stepperState.data.zeit !== null;
    default:
      return true;
  }
}

// Next button
stepperNext.addEventListener('click', function() {
  if (stepperState.current < 5) {
    goToStep(stepperState.current + 1);
  } else {
    goToStep(6);
  }
});

// Back button
stepperBack.addEventListener('click', function() {
  if (stepperState.current === 6) {
    goToStep(5);
  } else if (stepperState.current > 1) {
    goToStep(stepperState.current - 1);
  }
});

// ─── Option Card Selection ────────────────────────────────

document.querySelectorAll('.option-card').forEach(function(card) {
  card.addEventListener('click', function() {
    var group = card.getAttribute('data-group');
    var value = card.getAttribute('data-value');

    // Deselect all cards in the same group
    document.querySelectorAll('.option-card[data-group="' + group + '"]').forEach(function(c) {
      c.classList.remove('selected');
    });

    // Select clicked card
    card.classList.add('selected');

    // Store value in state
    stepperState.data[group] = value;

    // Handle gewerbe sub-options
    if (group === 'typ') {
      if (value === 'gewerbe') {
        gewerbeOptions.removeAttribute('hidden');
      } else {
        gewerbeOptions.setAttribute('hidden', '');
        // Clear gewerbetyp selection
        stepperState.data.gewerbetyp = null;
        document.querySelectorAll('.option-card[data-group="gewerbetyp"]').forEach(function(c) {
          c.classList.remove('selected');
        });
      }
    }

    updateNextBtn();

    // Auto-advance logic
    if (group === 'typ' && value !== 'gewerbe') {
      setTimeout(function() { goToStep(2); }, 280);
    } else if (group === 'gewerbetyp') {
      setTimeout(function() { goToStep(2); }, 280);
    } else if (group === 'anlass') {
      setTimeout(function() { goToStep(5); }, 280);
    } else if (group === 'zeit') {
      setTimeout(function() { goToStep(6); }, 280);
    }
  });
});

// ─── Flaeche input → re-evaluate next button ─────────────

if (stepperFlaeche) {
  stepperFlaeche.addEventListener('input', updateNextBtn);
}

// ─── Form Submit ─────────────────────────────────────────

if (stepperForm) {
  stepperForm.addEventListener('submit', function(e) {
    // Populate hidden fields from state and input values
    var typParts = [stepperState.data.typ, stepperState.data.gewerbetyp].filter(Boolean);
    hiddenTyp.value         = typParts.join(' – ');
    hiddenOrt.value         = stepperOrt ? stepperOrt.value : '';
    hiddenFlaeche.value     = stepperFlaeche ? stepperFlaeche.value + ' m²' : '';
    hiddenGrundstueck.value = (stepperGrundstueck && stepperGrundstueck.value)
      ? stepperGrundstueck.value + ' m²'
      : 'k.A.';
    hiddenAnlass.value      = stepperState.data.anlass || '';
    hiddenZeit.value        = stepperState.data.zeit || '';
  });
}
