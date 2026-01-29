<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Monitor, Lock, Star } from '@element-plus/icons-vue'

const values = [
  {
    icon: Monitor,
    title: '持续创新',
    desc: '永远保持好奇心，探索技术的边界。拥抱变化，用创造性的思维解决复杂问题。'
  },
  {
    icon: Lock,
    title: '安全可靠',
    desc: '将数据安全视为生命线。通过严谨的架构和测试，确保每一行代码都值得信赖。'
  },
  {
    icon: Star,
    title: '追求卓越',
    desc: '不妥协于平庸。在细节中打磨品质，致力于提供超越用户预期的产品体验。'
  }
]

const isVisible = ref(false)
const valuesRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      // 只要有一部分进入都触发
      if (entries[0].isIntersecting) {
        isVisible.value = true
      }
    },
    { threshold: 0.1 }
  )
  
  if (valuesRef.value) {
    observer.observe(valuesRef.value)
  }
})
</script>

<template>
  <section class="about-values" ref="valuesRef">
    <div class="container">
      <div class="section-header">
        <h2 class="title">核心价值观</h2>
        <p class="subtitle">是什么指引着我们前行</p>
      </div>
      
      <div class="values-grid">
        <div 
          v-for="(item, index) in values" 
          :key="index"
          class="value-card"
          :class="{ 'animate-in': isVisible }"
          :style="{ animationDelay: `${index * 0.15}s` }"
        >
          <div class="icon-wrapper">
            <el-icon class="icon"><component :is="item.icon" /></el-icon>
          </div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-values {
  padding: 100px 0;
  background-color: #f5f7fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #303133;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 1.1rem;
  color: #909399;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.value-card {
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  transition: all 0.4s ease;
  opacity: 0; /* 初始隐藏 */
  transform: translateY(30px);
}

.value-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  background: #ecf5ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: transform 0.4s ease, background-color 0.4s ease;
}

.value-card:hover .icon-wrapper {
  transform: rotate(10deg);
  background: #409eff;
}

.icon {
  font-size: 32px;
  color: #409eff;
  transition: color 0.4s ease;
}

.value-card:hover .icon {
  color: #ffffff;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.card-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: #606266;
}

/* Animations */
.animate-in {
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .values-grid {
    grid-template-columns: 1fr;
  }
}
</style>
