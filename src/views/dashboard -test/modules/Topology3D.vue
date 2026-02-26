<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationId = 0;

const hoverNode = ref<any>(null);
const mousePos = ref({ x: 0, y: 0 });

// Configuration for 2.5D Isometric drawing
const drawConfig = {
  centerX: 0,
  centerY: 0,
  scale: 1,
  angle: Math.PI / 6, // 30 degrees for isometric
  nodes: [
    { id: 'center', type: 'main', x: 0, y: 0, z: 0, label: '', bottomLabel: 'XXXXX', color: '#00D8FF' },
    { id: 'n1', type: 'sub', x: -250, y: -100, z: 0, label: '机构总数(家)\n18', color: '#00D8FF' },
    { id: 'n2', type: 'sub', x: 0, y: -250, z: 0, label: '机构总数(家)\n22', color: '#00D8FF' }, // removed green
    { id: 'n3', type: 'sub', x: 250, y: -100, z: 0, label: '机房总数(家)\n22', color: '#00D8FF' },
    { id: 'n4', type: 'sub', x: 150, y: 180, z: 0, label: '业务系统(个)\n18', color: '#00D8FF' },
    { id: 'n5', type: 'sub', x: -150, y: 180, z: 0, label: '核心设备(个)\n18', color: '#00D8FF' }
  ],
  particles: [] as any[]
};

// Convert 3D coordinates to 2D isometric coordinates
const isoProject = (x: number, y: number, z: number) => {
  const cos = Math.cos(drawConfig.angle);
  const sin = Math.sin(drawConfig.angle);
  const isoX = (x - y) * cos;
  const isoY = (x + y) * sin - z;
  return { 
    x: isoX * drawConfig.scale + drawConfig.centerX, 
    y: isoY * drawConfig.scale + drawConfig.centerY 
  };
};

const drawPrism = (ctx: CanvasRenderingContext2D, center: {x: number, y: number}, w: number, h: number, strokeColor: string, topColor: string, leftColor: string, rightColor: string) => {
  // Top face
  ctx.beginPath();
  ctx.moveTo(center.x, center.y - h);
  ctx.lineTo(center.x + w, center.y - h - w * 0.5);
  ctx.lineTo(center.x, center.y - h - w);
  ctx.lineTo(center.x - w, center.y - h - w * 0.5);
  ctx.closePath();
  ctx.fillStyle = topColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.stroke();

  // Left face
  ctx.beginPath();
  ctx.moveTo(center.x - w, center.y - h - w * 0.5);
  ctx.lineTo(center.x, center.y - h);
  ctx.lineTo(center.x, center.y);
  ctx.lineTo(center.x - w, center.y - w * 0.5);
  ctx.closePath();
  ctx.fillStyle = leftColor;
  ctx.fill();
  ctx.stroke();

  // Right face
  ctx.beginPath();
  ctx.moveTo(center.x + w, center.y - h - w * 0.5);
  ctx.lineTo(center.x, center.y - h);
  ctx.lineTo(center.x, center.y);
  ctx.lineTo(center.x + w, center.y - w * 0.5);
  ctx.closePath();
  ctx.fillStyle = rightColor; 
  ctx.fill();
  ctx.stroke();
};

const drawServerNode = (ctx: CanvasRenderingContext2D, center: {x: number, y: number}, size: number, color: string, isMain: boolean) => {
  const w = size;
  const h = isMain ? size * 1.8 : size * 1.2;
  
  // Inner racks
  const levels = isMain ? 4 : 3;
  const rackH = h / levels;
  for (let i = 0; i < levels; i++) {
    const rackY = center.y - i * rackH - (i > 0 ? 5 : 0);
    drawPrism(ctx, { x: center.x, y: rackY }, w * 0.85, rackH * 0.7, color, 
      `${color}AA`, 
      `${color}88`, 
      `${color}66`
    );
  }

  // Outer glass shell context
  ctx.lineWidth = 1;
  drawPrism(ctx, center, w, h + (isMain ? 20 : 15), 
      `rgba(0, 216, 255, 0.4)`, 
      `rgba(0, 216, 255, 0.05)`, 
      `rgba(0, 216, 255, 0.1)`, 
      `rgba(0, 216, 255, 0.15)`
  );
  
  // Glowing base
  ctx.beginPath();
  ctx.ellipse(center.x, center.y + 10, w * (isMain ? 2.5 : 1.5), w * (isMain ? 1.25 : 0.75), 0, 0, Math.PI * 2);
  const gradient = ctx.createRadialGradient(center.x, center.y + 10, 0, center.x, center.y + 10, w * (isMain ? 2.5 : 1.5));
  gradient.addColorStop(0, isMain ? `rgba(68, 136, 255, 0.5)` : `rgba(0, 216, 255, 0.4)`);
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fill();
};

const drawFloorBase = (ctx: CanvasRenderingContext2D, center: {x: number, y: number}, isMain: boolean) => {
   ctx.beginPath();
   const rw = isMain ? 160 : 80;
   const rh = rw * 0.5;
   ctx.moveTo(center.x, center.y - rh);
   ctx.lineTo(center.x + rw, center.y);
   ctx.lineTo(center.x, center.y + rh);
   ctx.lineTo(center.x - rw, center.y);
   ctx.closePath();
   ctx.fillStyle = 'rgba(5, 10, 20, 0.9)';
   ctx.fill();
   ctx.strokeStyle = isMain ? 'rgba(0, 216, 255, 0.3)' : 'rgba(50, 60, 80, 0.8)';
   ctx.lineWidth = 2;
   ctx.stroke();
   
   // Inner border
   ctx.beginPath();
   const iw = rw - 15;
   const ih = iw * 0.5;
   ctx.moveTo(center.x, center.y - ih);
   ctx.lineTo(center.x + iw, center.y);
   ctx.lineTo(center.x, center.y + ih);
   ctx.lineTo(center.x - iw, center.y);
   ctx.closePath();
   ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
   ctx.lineWidth = 1;
   ctx.stroke();
};

const addParticles = () => {
    const mainNode = drawConfig.nodes[0];
    for (let i = 1; i < drawConfig.nodes.length; i++) {
        if (Math.random() > 0.95) {
            drawConfig.particles.push({
                from: i,
                to: 0,
                progress: 0,
                speed: 0.01 + Math.random() * 0.01,
                color: Math.random() > 0.5 ? '#00D8FF' : '#FF4B4B'
            });
        }
    }
};

const drawFrame = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear and set background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw nodes
  const projectedNodes = drawConfig.nodes.map(n => ({
    ...n,
    pos: isoProject(n.x, n.y, n.z)
  }));

  const mainNode = projectedNodes.find(n => n?.type === 'main') || projectedNodes[0];
  if (!mainNode) return;
  const mainNodePos = mainNode.pos;

  // Decide dynamically the state of each node link to maintain consistency in particles and line colors
  // For mock simulation, we can assign a random error state based on time
  const timeSec = Math.floor(Date.now() / 3000);

  // Mark nodes with dynamic runtime colors based on simulated state
  projectedNodes.forEach((node, i) => {
     if (!node) return;
     if (node.type !== 'main') {
         const isError = ((i + timeSec) % 5 === 0);
         node.color = isError ? '#FF4B4B' : '#00D8FF';
     }
  });

  // Draw background diamond bases first
  projectedNodes.forEach(node => {
     if (!node) return;
     drawFloorBase(ctx, node.pos, node.type === 'main');
  });

  // Draw lines
  ctx.lineWidth = 1;
  for (let i = 0; i < projectedNodes.length; i++) {
    const node = projectedNodes[i]!;
    if (node.type === 'main') continue; // Skip drawing line to itself

    // Line curve logic
    ctx.beginPath();
    const dH = 40;
    const mH = 80;
    ctx.moveTo(node.pos.x, node.pos.y - dH);
    
    // Draw an arc between nodes
    const midX = (node.pos.x + mainNodePos.x) / 2;
    const midY = (node.pos.y + mainNodePos.y) / 2 - 80; // Arch height
    
    ctx.quadraticCurveTo(midX, midY, mainNodePos.x, mainNodePos.y - mH);
    
    // Color line based on state
    const baseColor = node.color;
    const g = ctx.createLinearGradient(node.pos.x, node.pos.y, mainNodePos.x, mainNodePos.y);
    g.addColorStop(0, `${baseColor}AA`);
    g.addColorStop(1, `${mainNode.color || '#00D8FF'}AA`);
    ctx.strokeStyle = g;
    ctx.stroke();

    // Spawn Particles logic per line
    if (Math.random() > 0.96) {
        drawConfig.particles.push({
            from: i,
            progress: 0,
            speed: 0.008 + Math.random() * 0.005,
            color: node.color
        });
    }
  }

  // Draw Particles
  for (let i = drawConfig.particles.length - 1; i >= 0; i--) {
      const p = drawConfig.particles[i];
      p.progress += p.speed;
      if (p.progress >= 1) {
          drawConfig.particles.splice(i, 1);
          continue;
      }
      
      const pNode = projectedNodes[p.from]!;

      const dH = pNode.type === 'main' ? 60 : 40;
      const mH = 80;
      const start = { x: pNode.pos.x, y: pNode.pos.y - dH };
      const end = { x: mainNodePos.x, y: mainNodePos.y - mH };
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2 - 80;
      
      // Quadratic bezier calculation matching the lines
      const t = p.progress;
      const x = Math.pow(1 - t, 2) * start.x + 2 * (1 - t) * t * midX + Math.pow(t, 2) * end.x;
      const y = Math.pow(1 - t, 2) * start.y + 2 * (1 - t) * t * midY + Math.pow(t, 2) * end.y;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.shadowBlur = p.color === '#FF4B4B' ? 15 : 10;
      ctx.shadowColor = p.color;
      // Reset shadow
      ctx.shadowBlur = 0;
  }

  // Sort by Y to draw back-to-front
  projectedNodes.sort((a, b) => a!.pos.y - b!.pos.y);

  projectedNodes.forEach(node => {
     drawServerNode(ctx, node!.pos, node!.type === 'main' ? 50 : 35, node!.color, node!.type === 'main');
     
     // Draw Text
     ctx.textAlign = 'center';
     if ((node as any).bottomLabel) {
         ctx.fillStyle = '#fff';
         ctx.font = 'bold 16px Microsoft YaHei';
         ctx.fillText((node as any).bottomLabel, node!.pos.x, node!.pos.y + 40);
     }

     if (node!.label) {
         const lines = node!.label.split('\n');
         lines.forEach((line: string, i: number) => {
             const yOff = node!.type === 'main' ? -100 : -85;
             ctx.font = i === 1 ? 'bold 16px Microsoft YaHei' : '12px Microsoft YaHei';
             ctx.fillStyle = i === 1 ? '#00FF9D' : '#fff';
             ctx.fillText(line, node!.pos.x, node!.pos.y + yOff + i * 20);
         });
     }
  });

  animationId = requestAnimationFrame(drawFrame);
};

const handleResize = () => {
    if(!canvasRef.value) return;
    const parent = canvasRef.value.parentElement;
    if(parent) {
        canvasRef.value.width = parent.clientWidth;
        canvasRef.value.height = parent.clientHeight;
        drawConfig.centerX = canvasRef.value.width / 2;
        drawConfig.centerY = canvasRef.value.height / 2 + 50; // Offset down a bit
    }
};

const handleMouseMove = (e: MouseEvent) => {
  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  let found = null;
  for (let i = drawConfig.nodes.length - 1; i >= 0; i--) {
     const n = drawConfig.nodes[i]!;
     const pos = isoProject(n.x, n.y, n.z);
     const visualY = pos.y - (n.type === 'main' ? 20 : 15);
     const dx = x - pos.x;
     const dy = y - visualY;
     const dist = Math.sqrt(dx * dx + dy * dy);
     
     if (dist < (n.type === 'main' ? 40 : 25)) {
        found = n;
        break;
     }
  }
  
  if (found) {
     hoverNode.value = found;
     mousePos.value = { x, y };
     canvasRef.value.style.cursor = 'pointer';
  } else {
     hoverNode.value = null;
     canvasRef.value.style.cursor = 'default';
  }
};

const handleMouseLeave = () => {
    hoverNode.value = null;
    if (canvasRef.value) {
        canvasRef.value.style.cursor = 'default';
    }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  if (canvasRef.value) {
      canvasRef.value.addEventListener('mousemove', handleMouseMove);
      canvasRef.value.addEventListener('mouseleave', handleMouseLeave);
  }
  drawFrame();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (canvasRef.value) {
      canvasRef.value.removeEventListener('mousemove', handleMouseMove);
      canvasRef.value.removeEventListener('mouseleave', handleMouseLeave);
  }
  cancelAnimationFrame(animationId);
});
</script>

<template>
  <div class="topology-container">
    <canvas ref="canvasRef"></canvas>
    
    <!-- Floating Info Panel Mockup -->
    <transition name="fade">
      <div 
        class="info-panel" 
        v-if="hoverNode"
        :style="{ left: mousePos.x + 20 + 'px', top: mousePos.y + 20 + 'px' }"
      >
        <div class="panel-header">{{ hoverNode.label.replace('\n', ' ') || '节点' }}数据 (Mock)</div>
        <div class="panel-header" style="margin-top:10px;">网络攻击 (3个)</div>
        <div class="panel-content ip-list">
          <div class="ip-item">1.1.1.94</div>
          <div class="ip-item alert">172.160.0.1</div>
          <div class="ip-item alert">1567.87.5</div>
        </div>
        <div class="panel-header" style="margin-top:10px;">异常访问 (5个)</div>
        <div class="panel-content ip-list">
          <div class="ip-item alert">172.160.0.1</div>
          <div class="ip-item alert">172.1620.0.1</div>
          <div class="ip-item">170.450.0.4</div>
        </div>
      </div>
    </transition>

    <!-- Legend -->
    <div class="line-legend">
        <div class="legend-item"><span class="line normal"></span> 访问正常</div>
        <div class="legend-item"><span class="line error"></span> 访问异常</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.topology-container {
  width: 100%;
  height: 100%;
  position: relative;
  
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  .info-panel {
    position: absolute;
    pointer-events: none;
    z-index: 10;
    background: rgba(11, 38, 74, 0.7);
    border: 1px solid rgba(0, 216, 255, 0.3);
    padding: 15px;
    border-radius: 4px;
    backdrop-filter: blur(4px);
    box-shadow: 0 0 20px rgba(0, 216, 255, 0.1);
    
    &::before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      width: 10px;
      height: 10px;
      border-top: 2px solid #00D8FF;
      border-left: 2px solid #00D8FF;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 10px;
      height: 10px;
      border-bottom: 2px solid #00D8FF;
      border-right: 2px solid #00D8FF;
    }

    .panel-header {
      font-size: 14px;
      color: #fff;
      margin-bottom: 8px;
    }

    .ip-list {
      .ip-item {
        font-size: 13px;
        color: #79A3CE;
        margin-bottom: 5px;
        font-family: 'Consolas', monospace;
        
        &.alert {
          color: #FF4B4B;
        }
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .line-legend {
    position: absolute;
    bottom: 20px;
    right: 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .legend-item {
      display: flex;
      align-items: center;
      font-size: 13px;
      color: #bbccdd;

      .line {
        display: inline-block;
        width: 24px;
        height: 2px;
        margin-right: 8px;
        
        &.normal {
          background-color: #00D8FF;
          box-shadow: 0 0 5px #00D8FF;
        }
        
        &.error {
          background-color: #FF4B4B;
          box-shadow: 0 0 5px #FF4B4B;
        }
      }
    }
  }
}
</style>
