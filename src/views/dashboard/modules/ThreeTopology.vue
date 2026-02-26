<template>
  <div ref="containerRef" class="topology-container">
    <canvas ref="canvasRef"></canvas>
    <!-- 信息面板 -->
    <div v-if="hoveredNode" class="info-panel" :style="infoPanelStyle">
      <div class="info-section" v-if="hoveredNode.attacks.length">
        <div class="info-title">网络攻击 ({{ hoveredNode.attacks.length }}个)</div>
        <div class="info-ip" v-for="(ip, i) in hoveredNode.attacks" :key="'a'+i">{{ ip }}</div>
      </div>
      <div class="info-section" v-if="hoveredNode.abnormal.length">
        <div class="info-title warning">异常访问 ({{ hoveredNode.abnormal.length }}个)</div>
        <div class="info-ip warning" v-for="(ip, i) in hoveredNode.abnormal" :key="'b'+i">{{ ip }}</div>
      </div>
    </div>
    <!-- 图例 -->
    <div class="legend">
      <div class="legend-item">
        <span class="legend-dot normal"></span>
        <span class="legend-text">访问正常</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot danger"></span>
        <span class="legend-text">访问异常</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'

// 节点数据接口
interface TopoNode {
  id: string
  name: string
  label: string
  value: number
  x: number // 逻辑坐标
  y: number
  isCenter?: boolean
  isDanger?: boolean
  attacks: string[]
  abnormal: string[]
}

// 连线数据
interface TopoLink {
  source: string
  target: string
  isDanger?: boolean
}

const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationId: number
let dpr = 1
let canvasWidth = 0
let canvasHeight = 0
let flowOffset = 0

// 悬浮节点
const hoveredNode = ref<TopoNode | null>(null)
const infoPanelStyle = reactive({ left: '20px', bottom: '60px' })

// 节点和连线数据
const nodes: TopoNode[] = [
  {
    id: 'center', name: 'XXXXX', label: '', value: 0,
    x: 0, y: 0, isCenter: true,
    attacks: [], abnormal: []
  },
  {
    id: 'n1', name: '节点A', label: '机构总数(家)', value: 18,
    x: -3.5, y: -0.5, isDanger: false,
    attacks: ['1.1.1.94', '172.160.0.1', '196.7.87.5'],
    abnormal: ['172.160.0.1', '172.1620.0.1']
  },
  {
    id: 'n2', name: '节点B', label: '机构总数(家)', value: 22,
    x: 0.5, y: -3, isDanger: false,
    attacks: [], abnormal: []
  },
  {
    id: 'n3', name: '节点C', label: '机构总数(家)', value: 22,
    x: 3.5, y: -0.5, isDanger: true,
    attacks: ['10.0.0.5'], abnormal: ['192.168.1.1']
  },
  {
    id: 'n4', name: '节点D', label: '机构总数(家)', value: 18,
    x: 1.5, y: 2, isDanger: false,
    attacks: [], abnormal: []
  },
]

const links: TopoLink[] = [
  { source: 'center', target: 'n1' },
  { source: 'center', target: 'n2' },
  { source: 'center', target: 'n3', isDanger: true },
  { source: 'center', target: 'n4' },
  { source: 'n1', target: 'n2' },
  { source: 'n2', target: 'n3' },
]

// ========== 等轴测坐标变换 ==========
const isoTransform = (lx: number, ly: number): [number, number] => {
  // 等轴测投影
  const angle = Math.PI / 6 // 30度
  const scaleX = canvasWidth / 10
  const scaleY = canvasHeight / 8
  const sx = (lx - ly) * Math.cos(angle) * scaleX
  const sy = (lx + ly) * Math.sin(angle) * scaleY
  return [canvasWidth / 2 + sx, canvasHeight / 2 + sy]
}

// ========== 绘制菱形底座 ==========
const drawPlatform = (cx: number, cy: number, w: number, h: number, color: string) => {
  if (!ctx) return
  const hw = w / 2
  const hh = h / 2
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(cx, cy - hh)
  ctx.lineTo(cx + hw, cy)
  ctx.lineTo(cx, cy + hh)
  ctx.lineTo(cx - hw, cy)
  ctx.closePath()

  // 渐变填充
  const grad = ctx.createLinearGradient(cx - hw, cy, cx + hw, cy)
  grad.addColorStop(0, 'rgba(0, 60, 120, 0.6)')
  grad.addColorStop(0.5, color)
  grad.addColorStop(1, 'rgba(0, 60, 120, 0.6)')
  ctx.fillStyle = grad
  ctx.fill()

  // 发光边框
  ctx.strokeStyle = 'rgba(0, 200, 255, 0.5)'
  ctx.lineWidth = 1
  ctx.stroke()

  // 外层光晕
  ctx.shadowColor = 'rgba(0, 200, 255, 0.3)'
  ctx.shadowBlur = 15
  ctx.stroke()
  ctx.restore()
}

// ========== 绘制3D立方体（等轴测） ==========
const drawIsoCube = (cx: number, cy: number, size: number, height: number, topColor: string, leftColor: string, rightColor: string) => {
  if (!ctx) return
  const hs = size / 2
  const ratio = 0.5 // 等轴测高宽比

  // 顶面
  ctx.beginPath()
  ctx.moveTo(cx, cy - height)
  ctx.lineTo(cx + hs, cy - height + hs * ratio)
  ctx.lineTo(cx, cy - height + hs * ratio * 2)
  ctx.lineTo(cx - hs, cy - height + hs * ratio)
  ctx.closePath()
  ctx.fillStyle = topColor
  ctx.fill()
  ctx.strokeStyle = 'rgba(0, 200, 255, 0.4)'
  ctx.lineWidth = 0.5
  ctx.stroke()

  // 左面
  ctx.beginPath()
  ctx.moveTo(cx - hs, cy - height + hs * ratio)
  ctx.lineTo(cx, cy - height + hs * ratio * 2)
  ctx.lineTo(cx, cy + hs * ratio * 2 - height + height)
  ctx.lineTo(cx - hs, cy + hs * ratio - height + height)
  ctx.closePath()
  ctx.fillStyle = leftColor
  ctx.fill()
  ctx.strokeStyle = 'rgba(0, 200, 255, 0.3)'
  ctx.lineWidth = 0.5
  ctx.stroke()

  // 右面
  ctx.beginPath()
  ctx.moveTo(cx + hs, cy - height + hs * ratio)
  ctx.lineTo(cx, cy - height + hs * ratio * 2)
  ctx.lineTo(cx, cy + hs * ratio * 2 - height + height)
  ctx.lineTo(cx + hs, cy + hs * ratio - height + height)
  ctx.closePath()
  ctx.fillStyle = rightColor
  ctx.fill()
  ctx.strokeStyle = 'rgba(0, 200, 255, 0.3)'
  ctx.lineWidth = 0.5
  ctx.stroke()
}

// ========== 绘制服务器机柜（多层堆叠） ==========
const drawServerStack = (cx: number, cy: number, isCenter: boolean, isDanger: boolean) => {
  if (!ctx) return

  const layers = isCenter ? 4 : 3
  const cubeSize = isCenter ? 60 : 40
  const layerHeight = isCenter ? 14 : 10
  const platformW = isCenter ? 140 : 100
  const platformH = isCenter ? 70 : 50

  // 底座平台
  drawPlatform(cx, cy + 10, platformW, platformH, isDanger ? 'rgba(180, 40, 40, 0.3)' : 'rgba(0, 80, 160, 0.4)')

  // 多层立方体
  for (let i = 0; i < layers; i++) {
    const offsetY = i * layerHeight
    const topC = isDanger
      ? `rgba(180, ${60 + i * 20}, ${60 + i * 20}, 0.9)`
      : `rgba(0, ${140 + i * 25}, ${200 + i * 15}, 0.9)`
    const leftC = isDanger
      ? `rgba(120, ${30 + i * 10}, ${30 + i * 10}, 0.9)`
      : `rgba(0, ${80 + i * 15}, ${140 + i * 10}, 0.9)`
    const rightC = isDanger
      ? `rgba(150, ${40 + i * 15}, ${40 + i * 15}, 0.9)`
      : `rgba(0, ${100 + i * 20}, ${160 + i * 12}, 0.9)`

    drawIsoCube(cx, cy - offsetY, cubeSize, layerHeight, topC, leftC, rightC)
  }

  // 顶部发光效果
  ctx.save()
  ctx.shadowColor = isDanger ? 'rgba(255, 60, 60, 0.6)' : 'rgba(0, 220, 255, 0.6)'
  ctx.shadowBlur = 20
  const topY = cy - layers * layerHeight
  ctx.beginPath()
  ctx.arc(cx, topY, 3, 0, Math.PI * 2)
  ctx.fillStyle = isDanger ? '#FF4D4D' : '#00F0FF'
  ctx.fill()
  ctx.restore()
}

// ========== 绘制弧形连线 ==========
const drawArcLink = (x1: number, y1: number, x2: number, y2: number, isDanger: boolean) => {
  if (!ctx) return

  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  // 控制点在两点中间偏上
  const cpx = midX
  const cpy = midY - Math.abs(x2 - x1) * 0.3 - 40

  // 基础线
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x1, y1 - 30) // 从服务器顶部出发
  ctx.quadraticCurveTo(cpx, cpy, x2, y2 - 30)
  ctx.strokeStyle = isDanger
    ? 'rgba(255, 77, 77, 0.4)'
    : 'rgba(0, 220, 200, 0.4)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.restore()

  // 流动光点
  drawFlowDot(x1, y1 - 30, cpx, cpy, x2, y2 - 30, isDanger)
}

// ========== 流动光点 ==========
const drawFlowDot = (x1: number, y1: number, cpx: number, cpy: number, x2: number, y2: number, isDanger: boolean) => {
  if (!ctx) return

  // 在曲线上计算多个光点位置
  const dotCount = 3
  for (let i = 0; i < dotCount; i++) {
    let t = ((flowOffset + i / dotCount) % 1)
    const invT = 1 - t
    const px = invT * invT * x1 + 2 * invT * t * cpx + t * t * x2
    const py = invT * invT * y1 + 2 * invT * t * cpy + t * t * y2

    ctx.save()
    ctx.beginPath()
    ctx.arc(px, py, 3, 0, Math.PI * 2)
    const color = isDanger ? '#FF4D4D' : '#00E0C8'
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.restore()
  }
}

// ========== 绘制节点标签 ==========
const drawLabel = (cx: number, cy: number, node: TopoNode) => {
  if (!ctx) return

  if (node.isCenter) {
    // 中心节点名称
    ctx.save()
    ctx.font = 'bold 14px "Microsoft YaHei", sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(node.name, cx, cy + 20)
    ctx.restore()
    return
  }

  // 卫星标签
  const labelY = cy - 70
  ctx.save()
  ctx.font = '12px "Microsoft YaHei", sans-serif'
  ctx.fillStyle = 'rgba(200, 220, 240, 0.8)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  ctx.fillText(node.label, cx, labelY)

  // 数值
  ctx.font = 'bold 22px "Courier New", monospace'
  ctx.fillStyle = node.isDanger ? '#FF4D4D' : '#00E09E'
  ctx.shadowColor = node.isDanger ? '#FF4D4D' : '#00E09E'
  ctx.shadowBlur = 8
  ctx.textBaseline = 'top'
  ctx.fillText(String(node.value), cx, labelY + 2)
  ctx.restore()
}

// ========== 主绘制循环 ==========
const draw = () => {
  if (!ctx || !canvasRef.value) return

  ctx.clearRect(0, 0, canvasWidth * dpr, canvasHeight * dpr)
  ctx.save()
  ctx.scale(dpr, dpr)

  // 绘制背景网格（微弱的等轴测网格线增加科技感）
  drawGrid()

  // 计算屏幕坐标
  const screenNodes = nodes.map(n => {
    const [sx, sy] = isoTransform(n.x, n.y)
    return { ...n, sx, sy }
  })

  // 按 y 坐标排序（远处先画，近处后画）
  screenNodes.sort((a, b) => a.sy - b.sy)

  // 绘制连线（先于节点）
  for (const link of links) {
    const sNode = screenNodes.find(n => n.id === link.source)
    const tNode = screenNodes.find(n => n.id === link.target)
    if (sNode && tNode) {
      drawArcLink(sNode.sx, sNode.sy, tNode.sx, tNode.sy, !!link.isDanger)
    }
  }

  // 绘制节点
  for (const n of screenNodes) {
    drawServerStack(n.sx, n.sy, !!n.isCenter, !!n.isDanger)
    drawLabel(n.sx, n.sy, n)
  }

  ctx.restore()

  // 更新流动偏移
  flowOffset += 0.003
  if (flowOffset > 1) flowOffset -= 1

  animationId = requestAnimationFrame(draw)
}

// ========== 背景网格 ==========
const drawGrid = () => {
  if (!ctx) return
  ctx.save()
  ctx.strokeStyle = 'rgba(0, 100, 200, 0.06)'
  ctx.lineWidth = 0.5

  const step = 40
  // 水平线
  for (let y = 0; y < canvasHeight; y += step) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvasWidth, y)
    ctx.stroke()
  }
  // 垂直线
  for (let x = 0; x < canvasWidth; x += step) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvasHeight)
    ctx.stroke()
  }
  ctx.restore()
}

// ========== 初始化 ==========
const initCanvas = () => {
  if (!containerRef.value || !canvasRef.value) return

  dpr = window.devicePixelRatio || 1
  canvasWidth = containerRef.value.clientWidth
  canvasHeight = containerRef.value.clientHeight

  canvasRef.value.width = canvasWidth * dpr
  canvasRef.value.height = canvasHeight * dpr
  canvasRef.value.style.width = canvasWidth + 'px'
  canvasRef.value.style.height = canvasHeight + 'px'

  ctx = canvasRef.value.getContext('2d')

  // 默认显示第一个有数据的节点信息
  hoveredNode.value = nodes[1]
}

const handleResize = () => {
  initCanvas()
}

// 鼠标交互 - 检测 hover 到节点
const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top

  for (const node of nodes) {
    const [sx, sy] = isoTransform(node.x, node.y)
    const dist = Math.sqrt((mx - sx) ** 2 + (my - sy) ** 2)
    if (dist < 50 && !node.isCenter) {
      hoveredNode.value = node
      return
    }
  }
}

onMounted(async () => {
  await nextTick()
  initCanvas()
  draw()
  window.addEventListener('resize', handleResize)
  containerRef.value?.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  containerRef.value?.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped lang="scss">
.topology-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}

// 信息面板
.info-panel {
  position: absolute;
  left: 20px;
  bottom: 60px;
  min-width: 180px;
  background: rgba(5, 15, 40, 0.9);
  border: 1px solid rgba(0, 180, 255, 0.4);
  border-radius: 4px;
  padding: 10px 14px;
  pointer-events: none;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5), 0 0 8px rgba(0, 180, 255, 0.2);

  .info-section {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .info-title {
    color: #00F0FF;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 4px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(0, 240, 255, 0.2);

    &.warning {
      color: #FFA500;
      border-bottom-color: rgba(255, 165, 0, 0.2);
    }
  }

  .info-ip {
    color: #00E09E;
    font-size: 12px;
    font-family: 'Courier New', monospace;
    line-height: 1.8;

    &.warning {
      color: #FFA500;
    }
  }
}

// 图例
.legend {
  position: absolute;
  right: 20px;
  bottom: 15px;
  display: flex;
  gap: 15px;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.normal {
      background: #00E09E;
      box-shadow: 0 0 6px #00E09E;
    }

    &.danger {
      background: #FF4D4D;
      box-shadow: 0 0 6px #FF4D4D;
    }
  }

  .legend-text {
    color: rgba(200, 220, 240, 0.7);
    font-size: 12px;
  }
}
</style>
