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

 /*** single Service Page ***/

        const continueButton = document.getElementById('continue-button');
        const scopeSelectionSection = document.getElementById('scope-selection-section');
        const planSelectionSection = document.getElementById('plan-selection-section');
        const planCardsContainer = document.getElementById('plan-cards-container');
        const planSelectionTitle = document.getElementById('plan-selection-title');
        const configAndCostSection = document.getElementById('config-and-cost-section');
        const countInput = document.getElementById('user-count');
        const countLabel = document.getElementById('count-label');
        const countHelpText = document.getElementById('count-help-text');
        const deviceTypeSelect = document.getElementById('device-type');
        const costOutput = document.getElementById('cost-output');

        // Internal state trackers
        let selectedPlan = null;
        let selectedScope = null;
        let selectedTier = null;
        let costCalculated = false;

        // --- Data Definitions ---

        // Plan Tier details
        const plans = {
            single: [
                { id: 'single_basic', name: 'Basic Tier', countRange: '1', price: '$9.99/mo', rate: 9.99, features: ['Real-time GPS', '30-Day History'] },
                { id: 'single_premium', name: 'Premium Tier', countRange: '1', price: '$14.99/mo', rate: 14.99, features: ['Unlimited Geofencing', 'SOS Alerts'], highlight: true }
            ],
            family: [
                { id: 'family_starter', name: 'Family Starter', countRange: '2-5', price: 'Starts at $19.99/mo', rate: 19.99, perUserAddOn: 5.00, features: ['Base for 2 users', '60-Day History'] },
                { id: 'family_premium', name: 'Family Unlimited', countRange: '2-5', price: 'Starts at $29.99/mo', rate: 29.99, perUserAddOn: 7.50, features: ['Unlimited History', 'Parental Controls'], highlight: true }
            ],
            business: [
                { id: 'biz_team', name: 'Team Essentials', countRange: '5+', price: '$5/user/mo', rate: 5.00, features: ['Admin Dashboard', 'Activity Reports'] },
                // Enterprise plan with standard per-user rate
                { id: 'biz_enterprise', name: 'Enterprise', countRange: '5+', price: '$10/user/mo', rate: 10.00, features: ['Custom Integrations', 'Dedicated Account Manager'], highlight: true }
            ]
        };

        // Device costs (One-Time Charge)
        const deviceOptions = [
            { value: 'app', cost: 0.00, name: 'Smartphone App (BYOD)' },
            { value: 'basic', cost: 49.99, name: 'Wearable Tracker (Basic)' },
            { value: 'advanced', cost: 99.99, name: 'Dedicated GPS Device (Advanced)' }
        ];

        // --- Core Functions ---

        /** Resets all steps after Step 1 and disables continue button. */
        function resetSubsequentSteps() {
            // Replaced 'hidden' with Bootstrap's 'd-none'
            scopeSelectionSection.classList.add('d-none');
            planSelectionSection.classList.add('d-none');
            configAndCostSection.classList.add('d-none');
            costOutput.classList.add('d-none');

            planCardsContainer.innerHTML = '';
            
            document.querySelectorAll('input[name="scope_type"]').forEach(radio => radio.checked = false);
            selectedScope = null;
            selectedTier = null;
            costCalculated = false;
            checkContinueButton();
            populateDeviceOptions();
        }

        /** Handles the selection of the primary plan type (Step 1). */
        function handlePlanSelection(planType) {
            selectedPlan = planType;
            resetSubsequentSteps();

            if (planType === 'individual') {
                scopeSelectionSection.classList.remove('d-none');
            } else if (planType === 'business') {
                showPlanCards('business');
            }
        }
        
        /** Handles the selection of the Individual Scope (Step 2) and displays the plans (Step 3). */
        function handleScopeSelection(scopeType) {
            selectedScope = scopeType;
            selectedTier = null;
            checkContinueButton();
            resetCalculation(); 
            
            showPlanCards(scopeType);
        }

        /** Dynamically generates and displays the Plan Cards (Step 3). */
        function showPlanCards(planKey) {
            planSelectionSection.classList.remove('d-none');
            planCardsContainer.innerHTML = '';

            const tierData = plans[planKey];
            planSelectionTitle.textContent = `3. Choose Your Plan Tier (${planKey === 'business' ? 'BUSINESS' : planKey.toUpperCase()})`;

            tierData.forEach(plan => {
                const isSelected = plan.id === selectedTier;
                const featuresHtml = plan.features.map(f => 
                    // Using Bootstrap list structure and custom styles
                    `<li class="d-flex align-items-center mb-1"><svg class="svg-icon text-warning me-2" style="width: 1rem; height: 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>${f}</li>`
                ).join('');
                
                // Using Bootstrap card structure with custom plan-card classes
                const cardHtml = `
                    <div class="col-12 col-md-6">
                        <div id="card-${plan.id}" class="plan-card-option card p-3 rounded-3 h-100 ${plan.highlight ? 'border-warning' : 'border-secondary-subtle'} ${isSelected ? 'plan-card-selected' : ''}" 
                            onclick="selectPlanTier('${plan.id}', '${planKey}')">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <h3 class="fs-5 fw-bold text-primary">${plan.name}</h3>
                                <span class="fs-5 fw-bolder text-info">${plan.price}</span>
                            </div>
                            <p class="text-sm text-secondary mb-3">Users: ${plan.countRange}</p>
                            <ul class="list-unstyled text-sm text-dark">
                                ${featuresHtml}
                            </ul>
                        </div>
                    </div>
                `;
                planCardsContainer.innerHTML += cardHtml;
            });
            
            if(selectedTier) {
                document.getElementById(`card-${selectedTier}`).classList.add('plan-card-selected');
            }
        }

        /** Handles the selection of a specific plan tier (Step 3) and configures Step 4. */
        function selectPlanTier(tierId, planKey) {
            selectedTier = tierId;
            const currentPlan = plans[planKey].find(p => p.id === tierId);

            // Visual update
            document.querySelectorAll('.plan-card-option').forEach(card => card.classList.remove('plan-card-selected'));
            document.getElementById(`card-${tierId}`).classList.add('plan-card-selected');
            resetCalculation();

            // Handle Step 4 visibility and count configuration
            configAndCostSection.classList.remove('d-none');

            if (planKey === 'single') {
                countInput.min = "1";
                countInput.max = "1";
                countInput.value = "1";
                countInput.disabled = true;
                countLabel.textContent = "Number of Users to Track (Fixed at 1)";
                countHelpText.textContent = "The Single Person plan supports exactly 1 user.";
            } else if (planKey === 'family') {
                countInput.min = "2";
                countInput.max = "5";
                countInput.value = "2"; // Default to min
                countInput.disabled = false;
                countLabel.textContent = `Number of Users in your Family/Group (2-5)`;
                countHelpText.textContent = "Select between 2 and 5 users for this family plan.";
            } else if (planKey === 'business') {
                countInput.min = "5";
                countInput.max = "999";
                countInput.value = "5"; // Default to min
                countInput.disabled = false;
                countLabel.textContent = `Number of Users/Team Members (5 or more)`;
                countHelpText.textContent = "Enter your estimated user count (min 5).";
            }
            
            checkContinueButton();
        }

        /** Populates the device selection dropdown. */
        function populateDeviceOptions() {
            deviceTypeSelect.innerHTML = '';
            deviceOptions.forEach(device => {
                const option = document.createElement('option');
                option.value = device.value;
                option.setAttribute('data-cost', device.cost);
                option.textContent = `${device.name} ($${device.cost.toFixed(2)} one-time)`;
                deviceTypeSelect.appendChild(option);
            });
        }

        /** Clears cost output and disables continue button. */
        function resetCalculation() {
            costOutput.classList.add('d-none'); // Replaced 'hidden' with 'd-none'
            costCalculated = false;
            checkContinueButton();
        }

        /** Calculates the total cost and updates the output display. */
        function calculateCost() {
            const userCount = parseInt(countInput.value);
            const selectedDevice = deviceTypeSelect.options[deviceTypeSelect.selectedIndex];
            const deviceCost = parseFloat(selectedDevice.getAttribute('data-cost'));
            const planKey = selectedPlan === 'individual' ? selectedScope : selectedPlan;
            const currentPlan = plans[planKey].find(p => p.id === selectedTier);

            let monthlySubscriptionCost = 0.00;
            let oneTimeHardwareCost = userCount * deviceCost;

            if (planKey === 'single') {
                monthlySubscriptionCost = currentPlan.rate; 
            } else if (planKey === 'family') {
                const baseUsers = 2;
                const extraUsers = Math.max(0, userCount - baseUsers);
                monthlySubscriptionCost = currentPlan.rate + (extraUsers * currentPlan.perUserAddOn);
            } else if (planKey === 'business') {
                monthlySubscriptionCost = userCount * currentPlan.rate; 
            }
            
            const totalDueToday = monthlySubscriptionCost + oneTimeHardwareCost;

            // Update output display
            document.getElementById('monthly-cost').textContent = `$${monthlySubscriptionCost.toFixed(2)}`;
            document.getElementById('hardware-cost').textContent = `$${oneTimeHardwareCost.toFixed(2)}`;
            document.getElementById('total-cost').textContent = `$${totalDueToday.toFixed(2)}`;
            
            costOutput.classList.remove('d-none'); // Replaced 'hidden' with 'd-none'
            costCalculated = true;
            checkContinueButton();
        }

        /** Checks the validity of the inputs and enables/disables the continue button. */
        function checkContinueButton() {
            let isValid = selectedTier && costCalculated;
            
            continueButton.disabled = !isValid;
            
            if (isValid) {
                // Enabled state: use primary color
                continueButton.classList.remove('btn-secondary');
                continueButton.classList.add('btn-primary');
                setContinueAction();
            } else {
                // Disabled state: use secondary color
                continueButton.classList.remove('btn-primary');
                continueButton.classList.add('btn-secondary');
            }
        }
        
        /** Defines the action for the continue button (Sign In / Create Account) - redirects to signin.html. */
        function setContinueAction() {
            continueButton.onclick = () => {
                // Log details to console before redirecting
                console.log(`Plan Selection Confirmed. Redirecting to signin.html.`);
                // Direct navigation to signin.html as requested
                window.location.href = 'signin.html';
            };
        }

        /** Mock function for navigating to the home page - redirects to index.html. */
        function goToHome() {
            // Direct navigation to index.html as requested
            window.location.href = 'index.html';
        }
        
        // Initial setup
        populateDeviceOptions();
        

 /*** single Service Page ***/