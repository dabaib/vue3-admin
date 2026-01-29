<script setup lang="ts">
import AboutHero from './modules/AboutHero.vue'
import AboutStory from './modules/AboutStory.vue'
import AboutValues from './modules/AboutValues.vue'
import AboutTeam from './modules/AboutTeam.vue'
import AboutContact from './modules/AboutContact.vue'
</script>

<template>
  <div class="about-page">
    <AboutHero />
    <AboutStory />
    <AboutValues />
    <AboutTeam />
    <AboutContact />
    
    <!-- Simple Footer for the page -->
    <footer class="about-footer">
      <p>&copy; 2026 Innovation Inc. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.about-page {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
}

.about-footer {
  padding: 40px 0;
  text-align: center;
  color: #909399;
  font-size: 0.9rem;
  border-top: 1px solid #eba4a41a;
}
</style>
