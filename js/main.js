(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });


    // Hero Header carousel
    $(".header-carousel").owlCarousel({
        animateOut: 'fadeOut',
        items: 1,
        margin: 0,
        stagePadding: 0,
        autoplay: true,
        smartSpeed: 500,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
    });


    // attractions carousel
    $(".blog-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });


    // testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 5,
        time: 2000
    });


   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


})(jQuery);

  const socialToggle = document.getElementById("socialToggle");
  const socialSidebar = document.getElementById("socialSidebar");

  socialToggle.addEventListener("click", () => {
    socialSidebar.classList.toggle("show");
    socialToggle.classList.toggle("active")
  });


//  /*** single Service Page ***/

document.addEventListener("DOMContentLoaded", () => {
  const pageType =
    document.body.dataset.type || // preferred way
    (window.location.pathname.match(/(\w+)-tracking/i)?.[1] || "people").toLowerCase();

  console.log("Detected page type:", pageType);

  // Common elements
  const continueButton = document.getElementById("continue-button");
  const scopeSelectionSection = document.getElementById("scope-selection-section");
  const planSelectionSection = document.getElementById("plan-selection-section");
  const planCardsContainer = document.getElementById("plan-cards-container");
  const planSelectionTitle = document.getElementById("plan-selection-title");
  const configAndCostSection = document.getElementById("config-and-cost-section");
  const countInput = document.getElementById("user-count");
  const countLabel = document.getElementById("count-label");
  const countHelpText = document.getElementById("count-help-text");
  const deviceTypeSelect = document.getElementById("device-type");
  const costOutput = document.getElementById("cost-output");
  const loadingSpinner = document.getElementById("loading-spinner");
  const appContent = document.getElementById("app-content");

  let plansData = {};
  let deviceOptionsData = [];
  let selectedPlan = null;
  let selectedScope = null;
  let selectedTier = null;
  let costCalculated = false;

  // --- Label per page type ---
  const labels = {
    people: { item: "Users", single: "Person", plural: "People" },
    animal: { item: "Animals", single: "Animal", plural: "Animals" },
    vehicle: { item: "Vehicles", single: "Vehicle", plural: "Vehicles" },
    equipment: { item: "Assets", single: "Asset", plural: "Assets" },
  };

  const current = labels[pageType] || labels.people;

  // --- Fetch Data ---
  async function fetchConfigData() {
    try {
      const [plansResponse, devicesResponse] = await Promise.all([
        fetch("plans.json"),
        fetch("devices.json"),
      ]);

      if (!plansResponse.ok || !devicesResponse.ok)
        throw new Error("Missing plans.json or devices.json");

      plansData = await plansResponse.json();
      deviceOptionsData = await devicesResponse.json();

      loadingSpinner.classList.add("d-none");
      appContent.classList.remove("d-none");

      populateDeviceOptions();
    } catch (error) {
      loadingSpinner.innerHTML = `
        <div class="alert alert-danger">
          <strong>Error:</strong> ${error.message}
        </div>`;
    }
  }

  function resetSubsequentSteps() {
    scopeSelectionSection.classList.add("d-none");
    planSelectionSection.classList.add("d-none");
    configAndCostSection.classList.add("d-none");
    costOutput.classList.add("d-none");
    planCardsContainer.innerHTML = "";

    document.querySelectorAll('input[name="scope_type"]').forEach((r) => (r.checked = false));

    selectedScope = null;
    selectedTier = null;
    costCalculated = false;
    checkContinueButton();
  }

  // Step 1
  window.handlePlanSelection = function (planType) {
    selectedPlan = planType;
    resetSubsequentSteps();
    if (planType === "individual") scopeSelectionSection.classList.remove("d-none");
    else if (planType === "business") showPlanCards("business");
  };

  // Step 2
  window.handleScopeSelection = function (scopeType) {
    selectedScope = scopeType;
    selectedTier = null;
    checkContinueButton();
    resetCalculation();
    showPlanCards(scopeType);
  };

  // Step 3
  function showPlanCards(planKey) {
    planSelectionSection.classList.remove("d-none");
    planCardsContainer.innerHTML = "";
    const tierData = plansData[planKey];
    if (!tierData) return;

    planSelectionTitle.textContent = `3. Choose Your Plan Tier (${planKey.toUpperCase()})`;

    tierData.forEach((plan) => {
      const featuresHtml = plan.features
        .map(
          (f) => `
        <li class="d-flex align-items-center mb-1">
          <svg class="svg-icon text-warning me-2" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>${f}
        </li>`
        )
        .join("");

      planCardsContainer.innerHTML += `
        <div class="col-12 col-md-6">
          <div id="card-${plan.id}" 
              class="plan-card-option card p-3 rounded-3 h-100 ${plan.highlight ? "border-warning" : "border-secondary-subtle"}"
              onclick="selectPlanTier('${plan.id}', '${planKey}')">
              <div class="d-flex justify-content-between align-items-start mb-3">
                  <h3 class="fs-5 fw-bold text-primary">${plan.name}</h3>
                  <span class="fs-5 fw-bolder text-info">${plan.price}</span>
              </div>
              <p class="text-sm text-secondary mb-3">${current.item}: ${plan.countRange}</p>
              <ul class="list-unstyled text-sm text-dark">${featuresHtml}</ul>
          </div>
        </div>`;
    });
  }

  // Step 4
  window.selectPlanTier = function (tierId, planKey) {
    selectedTier = tierId;
    document.querySelectorAll(".plan-card-option").forEach((c) => c.classList.remove("plan-card-selected"));
    document.getElementById(`card-${tierId}`).classList.add("plan-card-selected");

    resetCalculation();
    configAndCostSection.classList.remove("d-none");

    const singleLabel = current.single;
    const pluralLabel = current.plural;

    if (planKey === "single") {
      Object.assign(countInput, { min: 1, max: 1, value: 1, disabled: true });
      countLabel.textContent = `Number of ${pluralLabel} to Track (Fixed at 1)`;
      countHelpText.textContent = `This plan supports exactly one ${singleLabel}.`;
    } else if (planKey === "family") {
      Object.assign(countInput, { min: 2, max: 10, value: 2, disabled: false });
      countLabel.textContent = `Number of ${pluralLabel} (2–10)`;
      countHelpText.textContent = `Select between 2 and 10 ${pluralLabel.toLowerCase()}.`;
    } else if (planKey === "business") {
      Object.assign(countInput, { min: 5, max: 999, value: 5, disabled: false });
      countLabel.textContent = `Number of ${pluralLabel} (5 or more)`;
      countHelpText.textContent = `Enter estimated ${pluralLabel.toLowerCase()} count (min 5).`;
    }
    checkContinueButton();
  };

  function populateDeviceOptions() {
    deviceTypeSelect.innerHTML = "";
    deviceOptionsData.forEach((device) => {
      const option = document.createElement("option");
      option.value = device.value;
      option.dataset.cost = device.cost;
      option.textContent = `${device.name} ($${device.cost.toFixed(2)} one-time)`;
      deviceTypeSelect.appendChild(option);
    });
  }

  function calculateCost() {
    const count = parseInt(countInput.value);
    const selectedDevice = deviceTypeSelect.options[deviceTypeSelect.selectedIndex];
    const deviceCost = parseFloat(selectedDevice.dataset.cost);
    const planKey = selectedPlan === "individual" ? selectedScope : selectedPlan;
    const currentPlan = plansData[planKey].find((p) => p.id === selectedTier);
    if (!currentPlan) return;

    let monthly = 0;
    let hardware = count * deviceCost;

    if (planKey === "single") monthly = currentPlan.rate;
    else if (planKey === "family") {
      const extra = Math.max(0, count - 2);
      monthly = currentPlan.rate + extra * (currentPlan.perUserAddOn || 0);
    } else if (planKey === "business") monthly = count * currentPlan.rate;

    document.getElementById("monthly-cost").textContent = `$${monthly.toFixed(2)}`;
    document.getElementById("hardware-cost").textContent = `$${hardware.toFixed(2)}`;
    document.getElementById("total-cost").textContent = `$${(monthly + hardware).toFixed(2)}`;

    costOutput.classList.remove("d-none");
    costCalculated = true;
    checkContinueButton();
  }

  window.calculateCost = calculateCost;

  function resetCalculation() {
    costOutput.classList.add("d-none");
    costCalculated = false;
    checkContinueButton();
  }

  function checkContinueButton() {
    continueButton.disabled = !(selectedTier && costCalculated);
    continueButton.classList.toggle("btn-primary", !continueButton.disabled);
    continueButton.classList.toggle("btn-secondary", continueButton.disabled);

    if (!continueButton.disabled) {
      continueButton.onclick = () => (window.location.href = "signin.html");
    }
  }

  window.goToHome = () => (window.location.href = "index.html");

  fetchConfigData();
});
