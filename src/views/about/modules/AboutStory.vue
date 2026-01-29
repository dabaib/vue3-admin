<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const storyRef = ref<HTMLElement | null>(null)

// 简单的 IntersectionObserver 实现滚动触发动画
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    { threshold: 0.2 }
  )
  
  if (storyRef.value) {
    observer.observe(storyRef.value)
  }
})
</script>

<template>
  <section class="about-story" ref="storyRef">
    <div class="container">
      <div class="story-grid">
        <div class="story-image" :class="{ 'slide-in-left': isVisible }">
          <div class="image-placeholder">
            <div class="overlay"></div>
            <span class="placeholder-text">Our Journey</span>
          </div>
        </div>
        <div class="story-content" :class="{ 'slide-in-right': isVisible }">
          <h2 class="section-title">由于热爱，<br>所以坚持</h2>
          <p class="story-text">
            自成立以来，我们始终秉持着“技术驱动创新”的理念。从最初的一个小团队，发展成为行业的领跑者，每一步都凝聚着对极致体验的追求。
          </p>
          <p class="story-text">
            我们不仅仅是代码的搬运工，更是数字世界的建筑师。我们相信，通过优秀的设计和稳健的架构，能够为用户创造真正的价值。
          </p>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-number">5+</span>
              <span class="stat-label">年经验</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">100+</span>
              <span class="stat-label">项目交付</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">20+</span>
              <span class="stat-label">合作伙伴</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about-story {
  padding: 100px 0;
  background-color: #ffffff;
  overflow: hidden;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .story-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  .image-placeholder {
    width: 100%;
    aspect-ratio: 4/3;
    background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(54, 209, 220, 0.1));
    }

    .placeholder-text {
      font-size: 1.5rem;
      font-weight: 600;
      color: #909399;
      z-index: 1;
    }
  }

  .story-content {
    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 32px;
      color: #303133;
    }

    .story-text {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #606266;
      margin-bottom: 24px;
    }

    .stats-row {
      display: flex;
      gap: 48px;
      margin-top: 40px;
      padding-top: 32px;
      border-top: 1px solid #eba4a41a; /* visual fix */

      .stat-item {
        display: flex;
        flex-direction: column;

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #409eff;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #909399;
          margin-top: 4px;
        }
      }
    }
  }
}

/* Animations */
.slide-in-left {
  opacity: 0;
  transform: translateX(-50px);
  animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.slide-in-right {
  opacity: 0;
  transform: translateX(50px);
  animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .about-story {
    .story-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    
    .section-title {
      font-size: 2rem;
    }
  }
}
</style>
