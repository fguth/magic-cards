<script setup lang="ts">
const { isDark, toggleTheme, theme } = useArcadeTheme()

useHead({ title: 'Arcade — Component Library' })

const checkVal = ref(false)
const checkDisabled = ref(true)
const radioA = ref(true)
const radioB = ref(false)
const toggleOn = ref(true)
const toggleOff = ref(false)
const toggleDisabled = ref(true)

const segmentVal = ref('tab1')
const segments = [
  { id: 'tab1', label: 'First' },
  { id: 'tab2', label: 'Second' },
  { id: 'tab3', label: 'Third' }
]

const filterVal = ref('all')
const filters = [
  { id: 'all', label: 'All' },
  { id: 'payments', label: 'Payments' },
  { id: 'requests', label: 'Requests' },
  { id: 'bitcoin', label: 'Bitcoin' },
  { id: 'boosts', label: 'Boosts' }
]

const chipA = ref(true)
const chipB = ref(false)
const chipC = ref(false)

const inputText = ref('')
const inputArea = ref('')
const inputDropdown = ref('')
const searchVal = ref('')
const sliderVal = ref(40)
const progressVal = ref(65)

const inputCardA = ref(true)
const inputCardB = ref(false)

const avatars = [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Carol' },
  { name: 'Dave' },
  { name: 'Eve' },
  { name: 'Frank' },
  { name: 'Grace' }
]

const showModal = ref(false)
const showSheet = ref(false)
const showToast = ref(false)

const dropdownOptions = [
  { value: 'usd', label: 'US Dollar' },
  { value: 'eur', label: 'Euro' },
  { value: 'gbp', label: 'British Pound' },
  { value: 'btc', label: 'Bitcoin' }
]

const listUnorderedWithIcons = [
  { icon: 'discount-tag', label: '$35 per month + taxes' },
  { icon: 'personalized-payments', label: 'First month free for Green status' },
  { icon: 'time-infinite', label: 'Unlimited data & talk' }
]

const listUnorderedSubtle2Col = [
  { label: 'Send', value: '$7,500 per week' },
  { label: 'Receive', value: 'Unlimited' },
  { label: 'Add Cash', value: '$7,500 per week' },
  { label: 'Cash out', value: '$25,000 per week' }
]

const listUnorderedStandard2Col = [
  { label: 'Taco Bell Gift Card', value: '$5' },
  { label: 'Cash balance', value: '$15' },
  { label: 'Overdraft coverage', value: '$30' }
]

const listUnorderedWithBody = [
  { icon: 'time-hourglass', label: 'Expires in 4 Days' },
  { icon: 'savings', label: 'Minimum purchase of $1.50' },
  { icon: 'time', label: 'This is an example of what this would look like with multiple lines of text' }
]

const listUnorderedLargeWithBody = [
  { icon: 'insights', label: 'Identify top customers', body: 'Get a list of the customers who paid you most often so you can keep those relationships strong.' },
  { icon: 'location', label: 'Track every paycheck', body: 'Quickly double-check a summary of your payment and customer details.' },
  { icon: 'settings', label: 'Monitor changes over time', body: 'Filter earnings by month, year or from when you created a business account.' }
]

const listUnorderedBodyWithValue = [
  { label: 'Processing fees', value: '$10.40', body: '2% per sale' },
  { label: 'Total earnings', value: '$400', body: 'This is an example of what this would look like with multiple lines of text' },
  { label: 'Average return', value: '9.45%', body: 'How much this ETF has typically made (or lost) for investors over a specific time period.' }
]

const listOrdered = [
  { label: 'Download Cash App', body: 'Available on iOS and Android' },
  { label: 'Create your account' },
  { label: 'Add your bank or card' }
]
</script>

<template>
  <main class="arcade-page" :class="{ 'arcade-page--dark': isDark }">
    <header class="arcade-page__header">
      <div class="arcade-page__header-inner">
        <h1 class="arcade-page__title">Arcade</h1>
        <p class="arcade-page__subtitle">Component Library</p>
      </div>
      <button class="arcade-page__toggle" @click="toggleTheme">
        <span class="arcade-page__toggle-track" :class="{ 'arcade-page__toggle-track--dark': isDark }">
          <span class="arcade-page__toggle-icon" />
        </span>
        <span class="arcade-page__toggle-label">{{ theme }}</span>
      </button>
    </header>

    <div class="arcade-page__grid">

      <section class="arcade-section">
        <h2 class="arcade-section__title">Atoms</h2>

        <div class="arcade-row">
          <div class="arcade-card">
            <h3 class="arcade-card__title">Badge</h3>
            <div class="arcade-card__demo arcade-card__demo--row">
              <ArcadeBadge size="small" />
              <ArcadeBadge :count="3" />
              <ArcadeBadge :count="99" />
              <ArcadeBadge variant="critical" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Checkbox</h3>
            <div class="arcade-card__demo arcade-card__demo--row">
              <ArcadeCheckbox v-model="checkVal" />
              <ArcadeCheckbox :model-value="true" />
              <ArcadeCheckbox v-model="checkDisabled" disabled />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Radio</h3>
            <div class="arcade-card__demo arcade-card__demo--row">
              <ArcadeRadio v-model="radioA" />
              <ArcadeRadio v-model="radioB" />
              <ArcadeRadio :model-value="false" disabled />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Toggle</h3>
            <div class="arcade-card__demo arcade-card__demo--row">
              <ArcadeToggle v-model="toggleOn" />
              <ArcadeToggle v-model="toggleOff" />
              <ArcadeToggle v-model="toggleDisabled" disabled />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Text Inline Icon</h3>
            <div class="arcade-card__demo arcade-card__demo--col">
              <ArcadeTextInlineIcon text="Cash balance" icon="subtle-push" icon-position="trailing" size="medium" weight="medium" />
              <ArcadeTextInlineIcon text="See details" icon="subtle-push" icon-position="trailing" size="small" />
              <ArcadeTextInlineIcon text="Verified" icon="checkmark" icon-position="leading" size="medium" weight="medium" />
            </div>
          </div>
        </div>
      </section>

      <section class="arcade-section">
        <h2 class="arcade-section__title">Buttons</h2>

        <div class="arcade-row">
          <div class="arcade-card">
            <h3 class="arcade-card__title">Button CTA</h3>
            <div class="arcade-card__demo arcade-card__demo--col">
              <ArcadeButtonCta label="Continue" prominence="prominent" />
              <ArcadeButtonCta label="Maybe later" prominence="standard" />
              <ArcadeButtonCta label="Learn more" prominence="subtle" />
              <ArcadeButtonCta label="Loading..." prominence="prominent" loading />
              <ArcadeButtonCta label="Disabled" prominence="prominent" disabled />
              <ArcadeButtonCta label="Delete account" prominence="prominent" destructive />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Button Default</h3>
            <div class="arcade-card__demo arcade-card__demo--row" style="flex-wrap: wrap;">
              <ArcadeButtonDefault label="Default" />
              <ArcadeButtonDefault label="Prominent" prominence="prominent" />
              <ArcadeButtonDefault label="Subtle" prominence="subtle" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Button Compact</h3>
            <div class="arcade-card__demo arcade-card__demo--row">
              <ArcadeButtonCompact label="Start" />
              <ArcadeButtonCompact label="Join" prominence="prominent" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Button Icon</h3>
            <div class="arcade-card__demo arcade-card__demo--row">
              <ArcadeButtonIcon icon="like" />
              <ArcadeButtonIcon icon="settings" />
              <ArcadeButtonIcon icon="send" />
              <ArcadeButtonIcon icon="search" disabled />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Button Glass</h3>
            <div class="arcade-card__demo arcade-card__demo--row" style="font-size: 32px;">
              <ArcadeButtonGlass icon="close" />
              <ArcadeButtonGlass icon="back" />
              <ArcadeButtonGlass icon="help" />
              <ArcadeButtonGlass icon="share-ios" />
              <ArcadeButtonGlass icon="more" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Button Dropdown</h3>
            <div class="arcade-card__demo">
              <ArcadeButtonDropdown label="Select option" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Button CTA Group</h3>
            <div class="arcade-card__demo">
              <ArcadeButtonCtaGroup hairline disclaimer="By continuing you agree to the <b>Terms of Service</b>">
                <ArcadeButtonCta label="Accept" prominence="prominent" />
                <ArcadeButtonCta label="Decline" prominence="standard" />
              </ArcadeButtonCtaGroup>
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Button Default Group</h3>
            <div class="arcade-card__demo">
              <ArcadeButtonDefaultGroup orientation="horizontal">
                <ArcadeButtonDefault label="Cancel" />
                <ArcadeButtonDefault label="Save" prominence="prominent" />
              </ArcadeButtonDefaultGroup>
            </div>
          </div>
        </div>
      </section>

      <section class="arcade-section">
        <h2 class="arcade-section__title">Headers</h2>

        <div class="arcade-row">
          <div class="arcade-card">
            <h3 class="arcade-card__title">Header Hero</h3>
            <div class="arcade-card__demo">
              <ArcadeHeaderHero title="We've got the best phone plan for you" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Header Hero Numerics</h3>
            <div class="arcade-card__demo">
              <ArcadeHeaderHeroNumerics eyebrow="Cash balance" amount="$1,306.80" subtitle="+$12.40 this week" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Header Page</h3>
            <div class="arcade-card__demo">
              <ArcadeHeaderPage title="Activity" subtitle="Recent transactions" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Header Profile — Full</h3>
            <div class="arcade-card__demo">
              <ArcadeHeaderProfile name="John Doe" body="$johndoe" avatar-fallback="J" title-icon="business" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Header Profile — Avatar</h3>
            <div class="arcade-card__demo">
              <ArcadeHeaderProfile name="Jane Smith" body="Coffee shop" avatar-fallback="J" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Header Profile — Body only</h3>
            <div class="arcade-card__demo">
              <ArcadeHeaderProfile name="User/Business name" body="Description 1-3 words." />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Header Profile — Account icon</h3>
            <div class="arcade-card__demo">
              <ArcadeHeaderProfile name="User/Business name" body="Description 1-3 words." title-icon="business" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Header Profile — Text wrapping</h3>
            <div class="arcade-card__demo">
              <ArcadeHeaderProfile name="This is an example of a multi line user or business name" body="Description 1-3 words." avatar-fallback="T" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Header Section</h3>
            <div class="arcade-card__demo">
              <ArcadeHeaderSection title="More for you" action-label="See all" />
            </div>
          </div>
        </div>
      </section>

      <section class="arcade-section">
        <h2 class="arcade-section__title">Inputs</h2>

        <div class="arcade-row">
          <div class="arcade-card">
            <h3 class="arcade-card__title">Input Field</h3>
            <div class="arcade-card__demo">
              <ArcadeInputField v-model="inputText" label="Full name" placeholder="Enter your name" helper-text="As it appears on your ID" />
              <ArcadeInputField model-value="" label="Email" placeholder="email@example.com" error-text="This field is required" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Input Area</h3>
            <div class="arcade-card__demo">
              <ArcadeInputArea v-model="inputArea" label="Note" placeholder="Add a note..." :rows="3" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Input Dropdown</h3>
            <div class="arcade-card__demo">
              <ArcadeInputDropdown v-model="inputDropdown" label="Currency" placeholder="Select currency" :options="dropdownOptions" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Input Card</h3>
            <div class="arcade-card__demo arcade-card__demo--col" style="gap: 8px;">
              <ArcadeInputCard v-model="inputCardA" label="Standard delivery" body="5–7 business days" selection-type="radio" />
              <ArcadeInputCard v-model="inputCardB" label="Express delivery" body="1–2 business days" selection-type="radio" />
              <ArcadeInputCard :model-value="true" label="Email notifications" selection-type="checkbox" />
              <ArcadeInputCard :model-value="false" label="SMS notifications" selection-type="checkbox" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Input Chip / Chip Grid</h3>
            <div class="arcade-card__demo">
              <ArcadeInputChipGrid>
                <ArcadeInputChip label="$1" :selected="chipA" @click="chipA = !chipA" />
                <ArcadeInputChip label="$10" :selected="chipB" @click="chipB = !chipB" />
                <ArcadeInputChip label="$20" :selected="chipC" @click="chipC = !chipC" />
                <ArcadeInputChip label="$50" @click="() => {}" />
                <ArcadeInputChip label="$100" @click="() => {}" />
                <ArcadeInputChip label="···" @click="() => {}" />
              </ArcadeInputChipGrid>
            </div>
          </div>
        </div>
      </section>

      <section class="arcade-section">
        <h2 class="arcade-section__title">Lists</h2>

        <div class="arcade-row">
          <div class="arcade-card">
            <h3 class="arcade-card__title">Cell</h3>
            <div class="arcade-card__demo arcade-card__demo--col">
              <ArcadeCell label="Direct deposit" icon="deposit" accessory="push" />
              <ArcadeCell label="Notifications" body="Manage alerts" icon="notifications" accessory="push" show-divider />
              <ArcadeCell label="Privacy" icon="lock-locked" accessory="push" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">List Unordered — Standard + Icons</h3>
            <div class="arcade-card__demo">
              <ArcadeListUnordered :items="listUnorderedWithIcons" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">List Unordered — Subtle 2-Col</h3>
            <div class="arcade-card__demo">
              <ArcadeListUnordered :items="listUnorderedSubtle2Col" prominence="subtle" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">List Unordered — Standard 2-Col</h3>
            <div class="arcade-card__demo">
              <ArcadeListUnordered :items="listUnorderedStandard2Col" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">List Unordered — Standard + Icons (compact)</h3>
            <div class="arcade-card__demo">
              <ArcadeListUnordered :items="listUnorderedWithBody" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">List Unordered — Large + Icons + Body</h3>
            <div class="arcade-card__demo">
              <ArcadeListUnordered :items="listUnorderedLargeWithBody" size="large" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">List Unordered — Standard + Body + Value</h3>
            <div class="arcade-card__demo">
              <ArcadeListUnordered :items="listUnorderedBodyWithValue" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">List Ordered — Standard</h3>
            <div class="arcade-card__demo">
              <ArcadeListOrdered :items="listOrdered" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">List Ordered — Subtle</h3>
            <div class="arcade-card__demo">
              <ArcadeListOrdered :items="listOrdered" type="subtle" />
            </div>
          </div>
        </div>
      </section>

      <section class="arcade-section">
        <h2 class="arcade-section__title">Cards &amp; Tiles</h2>

        <div class="arcade-row">
          <div class="arcade-card">
            <h3 class="arcade-card__title">Card — Default</h3>
            <div class="arcade-card__demo">
              <ArcadeCard headline="On AT&T's network" body="Premium coverage on AT&T's network, the largest wireless network in North America." />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Card — With CTA</h3>
            <div class="arcade-card__demo">
              <ArcadeCard headline="Stream in HD" body="Watch your favorite shows and movies in full HD without data limits." cta-label="Learn more" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Card — Section</h3>
            <div class="arcade-card__demo">
              <ArcadeCard variant="section" headline="Everything else">
                <ArcadeCell label="Instant eSIM activation" icon="fpo-shrimp" />
                <ArcadeCell label="Keep your number" icon="fpo-shrimp" />
                <ArcadeCell label="24/7 support" icon="chat-smart" />
              </ArcadeCard>
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Tile</h3>
            <div class="arcade-card__demo">
              <ArcadeTile headline="Everything else">
                <ArcadeCell label="Instant eSIM activation" icon="fpo-shrimp" />
                <ArcadeCell label="Keep your number" icon="fpo-shrimp" />
              </ArcadeTile>
            </div>
          </div>
        </div>
      </section>

      <section class="arcade-section">
        <h2 class="arcade-section__title">Controls</h2>

        <div class="arcade-row">
          <div class="arcade-card">
            <h3 class="arcade-card__title">Segmented Control</h3>
            <div class="arcade-card__demo">
              <ArcadeSegmentedControl v-model="segmentVal" :segments="segments" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Filter Bar</h3>
            <div class="arcade-card__demo">
              <ArcadeFilterBar v-model="filterVal" :filters="filters" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Search Bar</h3>
            <div class="arcade-card__demo">
              <ArcadeSearchBar v-model="searchVal" placeholder="Search people..." />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Slider</h3>
            <div class="arcade-card__demo">
              <ArcadeSlider v-model="sliderVal" :min="0" :max="100" />
              <span class="arcade-card__value">{{ sliderVal }}%</span>
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Copy Code</h3>
            <div class="arcade-card__demo">
              <ArcadeCopyCode label="Referral code" body="CASHAPP2026" />
            </div>
          </div>
        </div>
      </section>

      <section class="arcade-section">
        <h2 class="arcade-section__title">Progress &amp; Timeline</h2>

        <div class="arcade-row">
          <div class="arcade-card">
            <h3 class="arcade-card__title">Progress Circular</h3>
            <div class="arcade-card__demo arcade-card__demo--row">
              <ArcadeProgressCircular size="small" />
              <ArcadeProgressCircular size="medium" />
              <ArcadeProgressCircular size="large" />
              <ArcadeProgressCircular :value="progressVal" size="large" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Timeline</h3>
            <div class="arcade-card__demo">
              <ArcadeTimeline>
                <ArcadeTimelineRow label="Order placed" body="Dec 15, 2025" active />
                <ArcadeTimelineRow label="Payment confirmed" body="Dec 15, 2025" active />
                <ArcadeTimelineRow label="Shipped" body="Estimated Dec 18" />
                <ArcadeTimelineRow label="Delivered" last />
              </ArcadeTimeline>
            </div>
          </div>
        </div>
      </section>

      <section class="arcade-section">
        <h2 class="arcade-section__title">Avatars</h2>

        <div class="arcade-row">
          <div class="arcade-card">
            <h3 class="arcade-card__title">Avatar Carousel</h3>
            <div class="arcade-card__demo">
              <ArcadeAvatarCarousel :avatars="avatars" size="medium" />
            </div>
          </div>
        </div>
      </section>

      <section class="arcade-section">
        <h2 class="arcade-section__title">Overlay</h2>

        <div class="arcade-row">
          <div class="arcade-card">
            <h3 class="arcade-card__title">Modal</h3>
            <div class="arcade-card__demo">
              <ArcadeButtonDefault label="Open modal" @click="showModal = true" />
              <ArcadeModal :visible="showModal" title="Confirm action" @close="showModal = false">
                <p class="arcade-card__body-text">Are you sure you want to proceed with this action?</p>
                <template #footer>
                  <ArcadeButtonDefaultGroup orientation="horizontal">
                    <ArcadeButtonDefault label="Cancel" @click="showModal = false" />
                    <ArcadeButtonDefault label="Confirm" prominence="prominent" @click="showModal = false" />
                  </ArcadeButtonDefaultGroup>
                </template>
              </ArcadeModal>
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Sheet</h3>
            <div class="arcade-card__demo">
              <ArcadeButtonDefault label="Open sheet" @click="showSheet = true" />
              <ArcadeSheet :visible="showSheet" title="Options" show-close @close="showSheet = false">
                <ArcadeCell label="Share" icon="send" accessory="push" />
                <ArcadeCell label="Copy link" icon="hyperlink" accessory="push" />
                <ArcadeCell label="Report" icon="alert-fill" accessory="push" />
              </ArcadeSheet>
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Toast</h3>
            <div class="arcade-card__demo">
              <ArcadeButtonDefault label="Show toast" @click="showToast = true" />
              <ArcadeToast
                headline="Payment sent"
                body="$50.00 to Alice"
                button-label="Undo"
                :visible="showToast"
                @dismiss="showToast = false"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="arcade-section">
        <h2 class="arcade-section__title">Navigation</h2>

        <div class="arcade-row">
          <div class="arcade-card">
            <h3 class="arcade-card__title">Title Bar — Parent / Default</h3>
            <div class="arcade-card__demo arcade-titlebar-demo">
              <ArcadeTitleBar type="parent" title="Page Title" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Title Bar — Child / Default</h3>
            <div class="arcade-card__demo arcade-titlebar-demo">
              <ArcadeTitleBar type="child" title="Details" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Title Bar — Parent / 1 Action</h3>
            <div class="arcade-card__demo arcade-titlebar-demo">
              <ArcadeTitleBar type="parent" title="Settings" :actions="['help']" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Title Bar — Child / 1 Action</h3>
            <div class="arcade-card__demo arcade-titlebar-demo">
              <ArcadeTitleBar type="child" title="Activity" :actions="['help']" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Title Bar — Child / 2 Actions (Pill)</h3>
            <div class="arcade-card__demo arcade-titlebar-demo">
              <ArcadeTitleBar type="child" title="Activity" :actions="['share-ios', 'more']" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Title Bar — No Title</h3>
            <div class="arcade-card__demo arcade-titlebar-demo">
              <ArcadeTitleBar type="parent" :show-title="false" :actions="['help']" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Title Bar — Transparent</h3>
            <div class="arcade-card__demo arcade-titlebar-demo arcade-titlebar-demo--gradient">
              <ArcadeTitleBar type="parent" variant="transparent" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Title Bar — Transparent / Actions</h3>
            <div class="arcade-card__demo arcade-titlebar-demo arcade-titlebar-demo--gradient">
              <ArcadeTitleBar type="child" variant="transparent" title="Explore" :actions="['share-ios', 'more']" />
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Title Bar — Title Truncation</h3>
            <div class="arcade-card__demo arcade-titlebar-demo">
              <ArcadeTitleBar type="child" title="This is a very long page title that should truncate" :actions="['help']" />
            </div>
          </div>
        </div>
      </section>

      <section class="arcade-section">
        <h2 class="arcade-section__title">Layout</h2>

        <div class="arcade-row">
          <div class="arcade-card">
            <h3 class="arcade-card__title">Divider</h3>
            <div class="arcade-card__demo arcade-card__demo--col">
              <span class="arcade-card__body-text">Above divider</span>
              <ArcadeDivider />
              <span class="arcade-card__body-text">Below divider</span>
            </div>
          </div>

          <div class="arcade-card">
            <h3 class="arcade-card__title">Spacer</h3>
            <div class="arcade-card__demo arcade-card__demo--col">
              <div class="arcade-spacer-demo"><ArcadeSpacer size="small" /><span>small</span></div>
              <div class="arcade-spacer-demo"><ArcadeSpacer size="medium" /><span>medium</span></div>
              <div class="arcade-spacer-demo"><ArcadeSpacer size="large" /><span>large</span></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </main>
</template>

<style scoped>
.arcade-page {
  min-height: 100vh;
  background: var(--arcade-bg-app);
  color: var(--arcade-text-standard);
  padding: 48px 32px 96px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.arcade-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto 48px;
}

.arcade-page__title {
  font-family: var(--arcade-font-medium);
  font-size: 56px;
  line-height: 1;
  letter-spacing: -2px;
  margin: 0;
}

.arcade-page__subtitle {
  font-family: var(--arcade-font-regular);
  font-size: 20px;
  line-height: 1.4;
  color: var(--arcade-text-subtle);
  margin: 8px 0 0;
}

.arcade-page__toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 8px 0;
  flex-shrink: 0;
}

.arcade-page__toggle-track {
  width: 56px;
  height: 32px;
  border-radius: var(--arcade-radius-pill);
  background: var(--arcade-bg-standard);
  display: flex;
  align-items: center;
  padding: 0 4px;
  transition: background-color 0.2s ease;
}

.arcade-page__toggle-track--dark {
  background: var(--arcade-bg-prominent);
}

.arcade-page__toggle-icon {
  width: 24px;
  height: 24px;
  border-radius: var(--arcade-radius-circle);
  background: var(--arcade-bg-app);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.arcade-page__toggle-track--dark .arcade-page__toggle-icon {
  transform: translateX(24px);
}

.arcade-page__toggle-label {
  font-family: var(--arcade-font-medium);
  font-size: 14px;
  color: var(--arcade-text-subtle);
  text-transform: capitalize;
}

.arcade-page__grid {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.arcade-section__title {
  font-family: var(--arcade-font-medium);
  font-size: 28px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  margin: 0 0 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--arcade-border-subtle);
}

.arcade-row {
  display: flex;
  flex-direction: column;
}

.arcade-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid var(--arcade-border-subtle);
}

.arcade-card:last-child {
  border-bottom: none;
}

.arcade-card__title {
  font-family: var(--arcade-font-mono-medium);
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--arcade-text-subtle);
  margin: 0;
}

.arcade-card__demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 12.1875rem;
}

.arcade-card__demo--row {
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.arcade-card__demo--col {
  flex-direction: column;
  gap: 12px;
}

.arcade-card__body-text {
  font-family: var(--arcade-font-regular);
  font-size: 14px;
  line-height: 1.5;
  color: var(--arcade-text-standard);
  margin: 0;
}

.arcade-card__value {
  font-family: var(--arcade-font-mono-medium);
  font-size: 13px;
  color: var(--arcade-text-subtle);
}

.arcade-titlebar-demo {
  font-size: 32px;
}

.arcade-titlebar-demo--gradient {
  background: linear-gradient(135deg, #a8e063 0%, #56ab2f 100%);
  border-radius: 12px;
  padding: 8px 0;
}

.arcade-spacer-demo {
  display: flex;
  align-items: stretch;
  gap: 8px;
}

.arcade-spacer-demo :deep(.arcade-spacer) {
  background: var(--arcade-brand);
  opacity: 0.25;
  border-radius: 4px;
  width: 40px;
}

.arcade-spacer-demo span {
  font-family: var(--arcade-font-mono-medium);
  font-size: 11px;
  color: var(--arcade-text-subtle);
  display: flex;
  align-items: center;
}
</style>
