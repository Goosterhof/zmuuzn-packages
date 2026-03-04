<script setup lang="ts">
import { ref, computed } from "vue";
import type { ExperimentId, LocalNavItem } from "../src/types";
import { experiments } from "../src/experiments";
import LabBar from "../src/components/LabBar.vue";
import LabBarMobile from "../src/components/LabBarMobile.vue";
import BrandMark from "../src/components/BrandMark.vue";
import ExperimentSwitcher from "../src/components/ExperimentSwitcher.vue";
import UserMenu from "../src/components/UserMenu.vue";

const currentExperiment = ref<ExperimentId>("war-table");
const userName = ref("Mad Scientist");
const showLocalNav = ref(true);
const mobileForced = ref(false);

const user = computed(() => ({ name: userName.value }));

const localNav = computed<LocalNavItem[]>(() =>
  showLocalNav.value
    ? [
        { label: "Dashboard", to: "/", isActive: true },
        { label: "Missions", to: "/missions" },
        { label: "Operatives", to: "/operatives" },
        { label: "Settings", to: "/settings" },
      ]
    : [],
);

const accentColor = computed(
  () => experiments.find((e) => e.id === currentExperiment.value)?.accentColor ?? "#F5F0E8",
);

const handleLogout = () => {
  /* no-op in preview */
};
</script>

<template>
  <!-- ============================================================ -->
  <!-- LIVE PREVIEW: Real nav at the top                            -->
  <!-- ============================================================ -->
  <div v-if="!mobileForced">
    <LabBar
      :current-experiment="currentExperiment"
      :user="user"
      :local-nav="localNav"
      @logout="handleLogout"
    />
    <LabBarMobile
      :current-experiment="currentExperiment"
      :user="user"
      :local-nav="localNav"
      @logout="handleLogout"
    />
  </div>
  <div v-else>
    <div block>
      <LabBarMobile
        :current-experiment="currentExperiment"
        :user="user"
        :local-nav="localNav"
        @logout="handleLogout"
      />
    </div>
  </div>

  <!-- ============================================================ -->
  <!-- SHOWCASE: The laboratory specimen display                     -->
  <!-- ============================================================ -->
  <main
    min-h-screen
    :style="{
      backgroundColor: '#0F0F1F',
      fontFamily: 'IBM Plex Mono, ui-monospace, monospace',
    }"
  >
    <!-- Page Header -->
    <div px-8 pt-10 pb-6>
      <h1
        m-0
        mb-2
        :style="{
          fontFamily: 'Epilogue, ui-sans-serif, system-ui, sans-serif',
          fontWeight: 900,
          fontSize: '42px',
          letterSpacing: '-1px',
          color: '#F0D040',
          lineHeight: 1.1,
          textTransform: 'uppercase',
        }"
      >
        Lab Nav
      </h1>
      <p
        m-0
        :style="{
          color: '#9E9EBF',
          fontSize: '14px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: 600,
        }"
      >
        The Shared Nervous System &mdash; Component Preview
      </p>
    </div>

    <!-- ======================================================== -->
    <!-- CONTROLS PANEL                                            -->
    <!-- ======================================================== -->
    <div px-8 mb-10>
      <div
        p-6
        :style="{
          backgroundColor: '#1A1A2E',
          border: '3px solid #2E2E52',
          boxShadow: '4px 4px 0 #000',
        }"
      >
        <p
          m-0
          mb-5
          :style="{
            fontFamily: 'Epilogue, ui-sans-serif, system-ui, sans-serif',
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#F0D040',
          }"
        >
          Controls
        </p>

        <div flex flex-wrap gap-8 items-start>
          <!-- Experiment Selector -->
          <div>
            <label
              block
              mb-2
              :style="{
                color: '#9E9EBF',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }"
            >
              Experiment
            </label>
            <div flex gap-2>
              <button
                v-for="exp in experiments"
                :key="exp.id"
                :style="{
                  backgroundColor: currentExperiment === exp.id ? exp.accentColor : '#0F0F1F',
                  color: currentExperiment === exp.id ? '#0F0F1F' : '#9E9EBF',
                  border:
                    '3px solid ' + (currentExperiment === exp.id ? exp.accentColor : '#2E2E52'),
                  boxShadow: currentExperiment === exp.id ? 'none' : '2px 2px 0 #000',
                  transform: currentExperiment === exp.id ? 'translate(2px, 2px)' : 'none',
                  padding: '8px 16px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '12px',
                  fontWeight: currentExperiment === exp.id ? 700 : 500,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }"
                @click="currentExperiment = exp.id"
              >
                {{ exp.label }}
              </button>
            </div>
          </div>

          <!-- Local Nav Toggle -->
          <div>
            <label
              block
              mb-2
              :style="{
                color: '#9E9EBF',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }"
            >
              Local Nav
            </label>
            <div flex gap-2>
              <button
                v-for="opt in [
                  { label: 'ON', value: true },
                  { label: 'OFF', value: false },
                ]"
                :key="String(opt.value)"
                :style="{
                  backgroundColor: showLocalNav === opt.value ? '#F0D040' : '#0F0F1F',
                  color: showLocalNav === opt.value ? '#0F0F1F' : '#9E9EBF',
                  border: '3px solid ' + (showLocalNav === opt.value ? '#F0D040' : '#2E2E52'),
                  boxShadow: showLocalNav === opt.value ? 'none' : '2px 2px 0 #000',
                  transform: showLocalNav === opt.value ? 'translate(2px, 2px)' : 'none',
                  padding: '8px 16px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '12px',
                  fontWeight: showLocalNav === opt.value ? 700 : 500,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }"
                @click="showLocalNav = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Mobile Force Toggle -->
          <div>
            <label
              block
              mb-2
              :style="{
                color: '#9E9EBF',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }"
            >
              Force Mobile
            </label>
            <div flex gap-2>
              <button
                v-for="opt in [
                  { label: 'OFF', value: false },
                  { label: 'ON', value: true },
                ]"
                :key="String(opt.value)"
                :style="{
                  backgroundColor: mobileForced === opt.value ? '#C8102E' : '#0F0F1F',
                  color: mobileForced === opt.value ? '#F5F0E8' : '#9E9EBF',
                  border: '3px solid ' + (mobileForced === opt.value ? '#C8102E' : '#2E2E52'),
                  boxShadow: mobileForced === opt.value ? 'none' : '2px 2px 0 #000',
                  transform: mobileForced === opt.value ? 'translate(2px, 2px)' : 'none',
                  padding: '8px 16px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '12px',
                  fontWeight: mobileForced === opt.value ? 700 : 500,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }"
                @click="mobileForced = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- User Name -->
          <div>
            <label
              block
              mb-2
              :style="{
                color: '#9E9EBF',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }"
            >
              User Name
            </label>
            <input
              v-model="userName"
              :style="{
                backgroundColor: '#0F0F1F',
                color: '#F5F0E8',
                border: '3px solid #2E2E52',
                padding: '8px 12px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '13px',
                width: '180px',
                outline: 'none',
              }"
              @focus="($event.target as HTMLInputElement).style.borderColor = '#F0D040'"
              @blur="($event.target as HTMLInputElement).style.borderColor = '#2E2E52'"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- SPECIMEN GRID                                             -->
    <!-- ======================================================== -->
    <div px-8 pb-16>
      <div
        :style="{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
        }"
      >
        <!-- Specimen: BrandMark -->
        <div
          :style="{
            backgroundColor: '#1A1A2E',
            border: '3px solid #2E2E52',
            boxShadow: '4px 4px 0 #000',
          }"
        >
          <div px-5 py-3 :style="{ borderBottom: '3px solid #2E2E52' }">
            <span
              :style="{
                fontFamily: 'Epilogue, ui-sans-serif, system-ui, sans-serif',
                fontWeight: 800,
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#F0D040',
              }"
            >
              BrandMark
            </span>
          </div>
          <div p-6 flex flex-col gap-6>
            <!-- SM variant with experiment -->
            <div>
              <p
                m-0
                mb-3
                :style="{
                  color: '#9E9EBF',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }"
              >
                SM &mdash; with experiment
              </p>
              <BrandMark size="sm" :current-experiment="currentExperiment" />
            </div>
            <!-- XS variant with experiment -->
            <div>
              <p
                m-0
                mb-3
                :style="{
                  color: '#9E9EBF',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }"
              >
                XS &mdash; with experiment
              </p>
              <BrandMark size="xs" :current-experiment="currentExperiment" />
            </div>
            <!-- SM without experiment -->
            <div>
              <p
                m-0
                mb-3
                :style="{
                  color: '#9E9EBF',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }"
              >
                SM &mdash; standalone
              </p>
              <BrandMark size="sm" />
            </div>
            <!-- XS without experiment -->
            <div>
              <p
                m-0
                mb-3
                :style="{
                  color: '#9E9EBF',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }"
              >
                XS &mdash; standalone
              </p>
              <BrandMark size="xs" />
            </div>
            <!-- All experiments side by side -->
            <div>
              <p
                m-0
                mb-3
                :style="{
                  color: '#9E9EBF',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }"
              >
                All experiments (SM)
              </p>
              <div flex flex-col gap-3>
                <BrandMark
                  v-for="exp in experiments"
                  :key="exp.id"
                  size="sm"
                  :current-experiment="exp.id"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Specimen: ExperimentSwitcher -->
        <div
          :style="{
            backgroundColor: '#1A1A2E',
            border: '3px solid #2E2E52',
            boxShadow: '4px 4px 0 #000',
          }"
        >
          <div px-5 py-3 :style="{ borderBottom: '3px solid #2E2E52' }">
            <span
              :style="{
                fontFamily: 'Epilogue, ui-sans-serif, system-ui, sans-serif',
                fontWeight: 800,
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#F0D040',
              }"
            >
              ExperimentSwitcher
            </span>
          </div>
          <div p-6 flex flex-col gap-6>
            <!-- Current selection -->
            <div>
              <p
                m-0
                mb-3
                :style="{
                  color: '#9E9EBF',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }"
              >
                Active: {{ currentExperiment }}
              </p>
              <div
                p-4
                :style="{
                  backgroundColor: '#0F0F1F',
                  border: '1px solid #2E2E52',
                }"
              >
                <ExperimentSwitcher :current-experiment="currentExperiment" />
              </div>
            </div>
            <!-- All three active states -->
            <div>
              <p
                m-0
                mb-3
                :style="{
                  color: '#9E9EBF',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }"
              >
                All active states
              </p>
              <div flex flex-col gap-3>
                <div
                  v-for="exp in experiments"
                  :key="exp.id"
                  p-4
                  :style="{
                    backgroundColor: '#0F0F1F',
                    border: '1px solid #2E2E52',
                  }"
                >
                  <ExperimentSwitcher :current-experiment="exp.id" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Specimen: UserMenu -->
        <div
          :style="{
            backgroundColor: '#1A1A2E',
            border: '3px solid #2E2E52',
            boxShadow: '4px 4px 0 #000',
          }"
        >
          <div px-5 py-3 :style="{ borderBottom: '3px solid #2E2E52' }">
            <span
              :style="{
                fontFamily: 'Epilogue, ui-sans-serif, system-ui, sans-serif',
                fontWeight: 800,
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#F0D040',
              }"
            >
              UserMenu
            </span>
          </div>
          <div p-6 flex flex-col gap-6>
            <div>
              <p
                m-0
                mb-3
                :style="{
                  color: '#9E9EBF',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }"
              >
                Interactive &mdash; click to toggle dropdown
              </p>
              <div
                p-4
                flex
                justify-end
                :style="{
                  backgroundColor: '#0F0F1F',
                  border: '1px solid #2E2E52',
                }"
              >
                <UserMenu :user="user" @logout="handleLogout" />
              </div>
            </div>
          </div>
        </div>

        <!-- Specimen: Design Tokens -->
        <div
          :style="{
            backgroundColor: '#1A1A2E',
            border: '3px solid #2E2E52',
            boxShadow: '4px 4px 0 #000',
          }"
        >
          <div px-5 py-3 :style="{ borderBottom: '3px solid #2E2E52' }">
            <span
              :style="{
                fontFamily: 'Epilogue, ui-sans-serif, system-ui, sans-serif',
                fontWeight: 800,
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#F0D040',
              }"
            >
              Design Tokens
            </span>
          </div>
          <div p-6>
            <!-- Color Palette -->
            <p
              m-0
              mb-3
              :style="{
                color: '#9E9EBF',
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }"
            >
              Surface Colors
            </p>
            <div flex flex-wrap gap-3 mb-6>
              <div
                v-for="color in [
                  { name: 'lab-bg', hex: '#0F0F1F' },
                  { name: 'lab-surface', hex: '#1A1A2E' },
                  { name: 'lab-border', hex: '#2E2E52' },
                ]"
                :key="color.name"
                flex
                items-center
                gap-3
              >
                <div
                  :style="{
                    width: '40px',
                    height: '40px',
                    backgroundColor: color.hex,
                    border: '2px solid #2E2E52',
                  }"
                />
                <div>
                  <div :style="{ color: '#F5F0E8', fontSize: '12px', fontWeight: 500 }">
                    {{ color.name }}
                  </div>
                  <div :style="{ color: '#9E9EBF', fontSize: '11px' }">
                    {{ color.hex }}
                  </div>
                </div>
              </div>
            </div>

            <p
              m-0
              mb-3
              :style="{
                color: '#9E9EBF',
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }"
            >
              Text Colors
            </p>
            <div flex flex-wrap gap-3 mb-6>
              <div
                v-for="color in [
                  { name: 'lab-active', hex: '#F5F0E8' },
                  { name: 'lab-muted', hex: '#9E9EBF' },
                  { name: 'lab-gold', hex: '#F0D040' },
                ]"
                :key="color.name"
                flex
                items-center
                gap-3
              >
                <div
                  :style="{
                    width: '40px',
                    height: '40px',
                    backgroundColor: color.hex,
                    border: '2px solid #2E2E52',
                  }"
                />
                <div>
                  <div :style="{ color: '#F5F0E8', fontSize: '12px', fontWeight: 500 }">
                    {{ color.name }}
                  </div>
                  <div :style="{ color: '#9E9EBF', fontSize: '11px' }">
                    {{ color.hex }}
                  </div>
                </div>
              </div>
            </div>

            <p
              m-0
              mb-3
              :style="{
                color: '#9E9EBF',
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }"
            >
              Experiment Accents
            </p>
            <div flex flex-wrap gap-3 mb-6>
              <div v-for="exp in experiments" :key="exp.id" flex items-center gap-3>
                <div
                  :style="{
                    width: '40px',
                    height: '40px',
                    backgroundColor: exp.accentColor,
                    border: '2px solid #2E2E52',
                    boxShadow:
                      exp.id === currentExperiment ? `0 0 12px ${exp.accentColor}` : 'none',
                    transition: 'box-shadow 300ms',
                  }"
                />
                <div>
                  <div :style="{ color: '#F5F0E8', fontSize: '12px', fontWeight: 500 }">
                    {{ exp.label }}
                  </div>
                  <div :style="{ color: '#9E9EBF', fontSize: '11px' }">
                    {{ exp.accentColor }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Typography -->
            <p
              m-0
              mb-3
              :style="{
                color: '#9E9EBF',
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }"
            >
              Typography
            </p>
            <div flex flex-col gap-3>
              <div
                :style="{
                  fontFamily: 'Epilogue, ui-sans-serif, system-ui, sans-serif',
                  fontWeight: 900,
                  fontSize: '20px',
                  color: '#F5F0E8',
                }"
              >
                Epilogue 900 &mdash; Display
              </div>
              <div
                :style="{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontWeight: 400,
                  fontSize: '14px',
                  color: '#F5F0E8',
                }"
              >
                IBM Plex Mono 400 &mdash; Body
              </div>
              <div
                :style="{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#9E9EBF',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }"
              >
                IBM Plex Mono 600 &mdash; Section Label
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- ACCENT STRIPE                                             -->
    <!-- ======================================================== -->
    <div
      :style="{
        height: '4px',
        backgroundColor: accentColor,
        boxShadow: `0 0 20px ${accentColor}66`,
        transition: 'all 300ms',
      }"
    />
  </main>
</template>
