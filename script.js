/**
 * GRURU MUSEUM (หนูรู้) — Presentation Engine & Data Booming Simulation
 * Handles Slide Navigation, Keyboard Shortcuts, Touch Events, and Interactive Graph Booming
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentSlide = 1;
  const totalSlides = 7;
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('dots-container');

  // 1. Initialize Indicator Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 1; i <= totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = `dot ${i === 1 ? 'active' : ''}`;
      dot.setAttribute('title', `Slide ${i}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  const dots = document.querySelectorAll('.dot');

  // 2. Slide Navigation Logic
  function updateSlides() {
    slides.forEach(slide => {
      const slideNum = parseInt(slide.getAttribute('data-slide'), 10);
      if (slideNum === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx + 1 === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    if (currentSlide < totalSlides) {
      currentSlide++;
      updateSlides();
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      currentSlide--;
      updateSlides();
    }
  }

  function goToSlide(num) {
    if (num >= 1 && num <= totalSlides) {
      currentSlide = num;
      updateSlides();
    }
  }

  // Attach functions to window for onclick handlers
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
  window.goToSlide = goToSlide;

  // 3. Keyboard Event Listeners
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(1);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides);
        break;
      default:
        break;
    }
  });

  // 4. Touch Gestures Support (Mobile / Tablet)
  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
  }, { passive: true });

  // 5. Interactive Data Booming Simulation
  let isBoomed = false;
  const sampleNodes = [
    { title: "ฟ้าทะลายโจร", cat: "🌿 สมุนไพร", color: "#34E89E", shape: "◆", takeaway: "สารแอนโดรกราโฟไลด์ ยับยั้งการแบ่งตัวของไวรัส" },
    { title: "ตำราโอสถพระนารายณ์", cat: "🏛️ ประวัติศาสตร์", color: "#FF5A1F", shape: "⬡", takeaway: "บันทึกสูตรยาหลวงสมัยอยุธยา มีการสกัดน้ำมันหอมระเหย" },
    { title: "โมเลกุลชีวเคมี", cat: "🔬 วิทยาศาสตร์", color: "#2EE6FF", shape: "⚪", takeaway: "โครงสร้างออกฤทธิ์ทางชีวภาพเทียบเท่ายาแผนปัจจุบัน" },
    { title: "AI Drug Discovery", cat: "💻 เทคโนโลยี", color: "#8C6BFF", shape: "◼", takeaway: "ระบบ AI ค้นหาสูตรยาต้านทานใหม่เร็วขึ้น 10 เท่า" },
    { title: "การแพทย์แผนไทย", cat: "🌾 วัฒนธรรม", color: "#FFC233", shape: "▲", takeaway: "ภูมิปัญญาการปรับสมดุลธาตุ 4 ในร่างกาย" },
    { title: "ฉลากสมาร์ทบรรจุภัณฑ์", cat: "🎨 ออกแบบ", color: "#FF5FA2", shape: "⭕", takeaway: "QR Code ตรวจสอบแหล่งเพาะปลูกแบบ Organic Traceability" }
  ];

  function triggerBooming() {
    const stage = document.getElementById('booming-stage');
    const hub = document.getElementById('booming-hub');
    const circle = document.getElementById('hub-circle');
    const status = document.getElementById('hub-status');
    const container = document.getElementById('subnodes-container');
    const svg = document.getElementById('booming-svg');
    const countEl = document.getElementById('connection-count');

    if (!stage || !hub || !circle || !status || !container || !svg || !countEl) return;

    if (!isBoomed) {
      // Explode outward!
      isBoomed = true;
      circle.style.boxShadow = '0 0 45px rgba(215, 255, 58, 0.9)';
      circle.style.transform = 'scale(1.15)';
      status.innerHTML = '⚡ กำลังสตรีมความสัมพันธ์...';

      container.innerHTML = '';
      svg.innerHTML = '';

      const rect = stage.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(centerX, centerY) * 0.65;

      let connections = 1;

      sampleNodes.forEach((node, index) => {
        setTimeout(() => {
          const angle = (index / sampleNodes.length) * 2 * Math.PI - (Math.PI / 2);
          const targetX = centerX + radius * Math.cos(angle);
          const targetY = centerY + radius * Math.sin(angle);

          // Draw SVG Relation Vector
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', centerX);
          line.setAttribute('y1', centerY);
          line.setAttribute('x2', targetX);
          line.setAttribute('y2', targetY);
          line.setAttribute('stroke', node.color);
          line.setAttribute('stroke-width', '2');
          line.setAttribute('stroke-dasharray', '4,4');
          line.setAttribute('opacity', '0.7');
          svg.appendChild(line);

          // Create Sub-Node Element
          const el = document.createElement('div');
          el.className = 'node-hub';
          el.style.left = `${targetX - 35}px`;
          el.style.top = `${targetY - 35}px`;
          el.style.pointerEvents = 'auto';
          el.style.opacity = '0';
          el.style.transform = 'scale(0.2)';

          el.innerHTML = `
            <div class="node-circle" style="width: 54px; height: 54px; font-size: 11px; background: #FFFFFF; color: #17171F; border: 2px solid ${node.color}; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <span>${node.shape}</span>
            </div>
            <div class="node-label" style="font-size: 11px; border-left: 3px solid ${node.color}; max-width: 130px; text-align: center;">
              <strong>${node.title}</strong><br>
              <span style="font-size: 9.5px; color: #555;">${node.cat}</span>
            </div>
          `;

          // Click on child node to reveal Everyday Takeaway
          el.onclick = (e) => {
            e.stopPropagation();
            alert(`[EVERYDAY TAKEAWAY]\n\nหัวข้อ: ${node.title}\nหมวด: ${node.cat}\nสาระนำไปใช้จริง: ${node.takeaway}\n\nแหล่งที่มา: คลังข้อมูลกลางดิจิทัล GRURU`);
          };

          container.appendChild(el);

          // Animate node pop
          requestAnimationFrame(() => {
            el.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
          });

          connections += 2;
          countEl.textContent = connections;

        }, index * 50);
      });

      setTimeout(() => {
        status.innerHTML = '✨ ระเบิดชั้นที่ 1 สมบูรณ์ (คลิกโหนดลูกเพื่อดู Takeaway)';
        countEl.textContent = '12';
      }, sampleNodes.length * 50 + 200);

    } else {
      // Reset Booming state
      isBoomed = false;
      circle.style.boxShadow = '0 0 25px rgba(215, 255, 58, 0.45)';
      circle.style.transform = 'scale(1)';
      status.innerHTML = 'กดเพื่อระเบิดความรู้ 💥';
      container.innerHTML = '';
      svg.innerHTML = '';
      countEl.textContent = '1';
    }
  }

  window.triggerBooming = triggerBooming;
});
