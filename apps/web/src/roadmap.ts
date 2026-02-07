/**
 * 🗺️ HARMONI OS V3 - PRODUCT ROADMAP
 * 
 * Strategic development phases for neurodevelopment intelligence platform
 */

export const HarmoniRoadmap = {
  phase1: {
    name: 'Neuro Normalization & Risk Engine',
    status: 'in_progress',
    features: [
      '✅ Z-Score Engine (age-based normalization)',
      '✅ Statistical Risk Model (multi-factor calculation)',
      '✅ Explainability Layer (human-readable insights)',
      '✅ NeuroNormTable (population data)',
      '✅ ChildNeuroZProfile (weekly Z-scores)',
      '✅ NeuroRiskProfile (risk scoring)',
    ],
    timeline: 'Q1 2024',
  },

  phase2: {
    name: 'Parent Dashboard & Visualizations',
    status: 'planned',
    features: [
      '📊 Radar Chart Component (10-domain visualization)',
      '📈 Z-Score Trend Lines (weekly progression)',
      '🚦 Risk Badge System (traffic light indicators)',
      '📱 Mobile-Optimized Parent View',
      '💬 Enhanced AI Summaries (V3 format)',
      '🎨 Glassmorphism UI Cards',
    ],
    timeline: 'Q2 2024',
  },

  phase3: {
    name: 'Predictive Alerts & Teacher Recommendations',
    status: 'planned',
    features: [
      '🔮 Predictive Risk Modeling (ML-based)',
      '📋 Teacher Activity Recommendations (domain-specific)',
      '⚡ Real-time Alert System',
      '📊 Class-level Analytics',
      '🤖 AI-Powered Intervention Suggestions',
      '📈 Population Benchmarking',
    ],
    timeline: 'Q3 2024',
  },

  phase4: {
    name: 'Population Analytics & Research',
    status: 'planned',
    features: [
      '🌍 Regional Anonymized Statistics',
      '📊 Research Data Export (anonymized)',
      '🔬 Longitudinal Studies Support',
      '📈 Population Norm Refinement',
      '🤝 Research Institution Partnerships',
      '📚 Publication-Ready Analytics',
    ],
    timeline: 'Q4 2024',
  },
}

export type RoadmapPhase = keyof typeof HarmoniRoadmap

