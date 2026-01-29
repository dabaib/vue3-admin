<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
</script>

<template>
  <section class="about-hero">
    <div class="hero-content">
      <h1 class="hero-title animate-up">
        Building the <span class="gradient-text">Future</span>,<br />
        Connecting <span class="gradient-text">You</span>.
      </h1>
      <p class="hero-subtitle animate-up delay-1">
        我们致力于通过创新技术，为您打造极致的数字化体验。
      </p>
      <div class="hero-actions animate-up delay-2">
        <el-button type="primary" size="large" class="cta-button">
          加入我们 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
        <el-button size="large" class="secondary-button" plain>
          了解更多
        </el-button>
      </div>
    </div>
    
    <div class="hero-background">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
    </div>
  </section>
</template>

<style scoped>
.about-hero {
  position: relative;
  height: 80vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(circle at center, #ffffff, #f0f2f5);
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 24px;
  color: #1a1a1a;
  letter-spacing: -1px;
}

.gradient-text {
  background: linear-gradient(135deg, #409eff 0%, #36d1dc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #606266;
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.cta-button {
  padding: 12px 32px;
  font-weight: 600;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.3);
}

.secondary-button {
  padding: 12px 32px;
  border-radius: 8px;
}

/* Background Animations */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 10s infinite ease-in-out;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: #409eff;
  top: -10%;
  left: -10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: #36d1dc;
  bottom: 10%;
  right: -5%;
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, 50px); }
}

/* Entry Animations */
.animate-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
}
</style>
