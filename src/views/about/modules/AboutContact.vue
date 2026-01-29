<script setup lang="ts">
import { Message } from '@element-plus/icons-vue'
</script>

<template>
  <section class="about-contact">
    <div class="contact-banner">
      <div class="content">
        <h2 class="title">Ready to start your journey?</h2>
        <p class="desc">Join us in building the next generation of digital experiences.</p>
        <el-button type="primary" size="large" class="glow-button">
          <el-icon class="el-icon--left"><Message /></el-icon>
          Get in Touch
        </el-button>
      </div>
      
      <!-- Decorative circles -->
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>
  </section>
</template>

<style scoped>
.about-contact {
  padding: 100px 24px;
  background: #ffffff;
  display: flex;
  justify-content: center;
}

.contact-banner {
  width: 100%;
  max-width: 1000px;
  background: linear-gradient(135deg, #1e2024, #2d3036);
  border-radius: 24px;
  padding: 80px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  color: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.content {
  position: relative;
  z-index: 10;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #fff, #b3c0d1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.desc {
  font-size: 1.1rem;
  color: #a0a5ad;
  margin-bottom: 40px;
}

.glow-button {
  padding: 12px 36px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  position: relative;
  overflow: hidden;
  border: none;
  background: #409eff;
  transition: all 0.3s ease;
}

.glow-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.6), 0 0 60px rgba(64, 158, 255, 0.3);
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.2;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: #409eff;
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 250px;
  height: 250px;
  background: #36d1dc;
  bottom: -50px;
  right: -50px;
}
</style>
