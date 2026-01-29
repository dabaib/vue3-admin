<script setup lang="ts">
import { ref, onMounted } from 'vue'

const team = [
  {
    name: 'Alex Johnson',
    role: 'CEO & Founder',
    avatar: 'A'
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    avatar: 'S'
  },
  {
    name: 'Michael Brown',
    role: 'Design Lead',
    avatar: 'M'
  },
  {
    name: 'Emily Davis',
    role: 'Product Manager',
    avatar: 'E'
  }
]

const isVisible = ref(false)
const teamRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        isVisible.value = true
      }
    },
    { threshold: 0.1 }
  )
  if (teamRef.value) observer.observe(teamRef.value)
})
</script>

<template>
  <section class="about-team" ref="teamRef">
    <div class="container">
      <div class="section-header">
        <h2 class="title" :class="{ 'fade-in': isVisible }">Meet the Team</h2>
        <p class="subtitle" :class="{ 'fade-in': isVisible }">一群充满激情的技术专家</p>
      </div>
      
      <div class="team-grid">
        <div 
          v-for="(member, index) in team" 
          :key="index" 
          class="team-card"
          :class="{ 'scale-in': isVisible }"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="avatar-wrapper">
            <div class="avatar-pulse"></div>
            <div class="avatar-placeholder">{{ member.avatar }}</div>
            <div class="social-links">
              <span class="social-icon">In</span>
              <span class="social-icon">Tw</span>
            </div>
          </div>
          <h3 class="name">{{ member.name }}</h3>
          <p class="role">{{ member.role }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about-team {
  padding: 100px 0;
  background-color: #ffffff;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 80px;

    .title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #303133;
      margin-bottom: 16px;
      opacity: 0;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #909399;
      opacity: 0;
    }
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;

    .team-card {
      text-align: center;
      opacity: 0;

      .avatar-wrapper {
        position: relative;
        width: 140px;
        height: 140px;
        margin: 0 auto 24px;
        cursor: pointer;

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #e0eafc, #cfdef3);
          border-radius: 50%;
          border: 4px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 700;
          color: #a0cfff;
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .avatar-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(64, 158, 255, 0.4);
          z-index: 1;
          transform: scale(1);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .social-links {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: #fff;
          padding: 8px 16px;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          display: flex;
          gap: 12px;
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 3;

          .social-icon {
            font-size: 0.8rem;
            font-weight: bold;
            color: #606266;
            cursor: pointer;

            &:hover {
              color: #409eff;
            }
          }
        }

        &:hover {
          .avatar-placeholder {
            transform: translateY(-8px);
          }

          .avatar-pulse {
            animation: pulse 1.5s infinite;
          }

          .social-links {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      }

      .name {
        font-size: 1.25rem;
        font-weight: 600;
        color: #303133;
        margin-bottom: 8px;
      }

      .role {
        font-size: 0.9rem;
        color: #909399;
      }
    }
  }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.4); opacity: 0; }
}

/* Entry Animations */
.fade-in {
  animation: fadeIn 0.8s forwards;
}

.scale-in {
  animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes scaleIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 1024px) {
  .about-team .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
