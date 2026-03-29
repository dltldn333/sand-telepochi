class SandwichRenderer {
  constructor(options = {}) {
    this.frontSelector = options.frontSelector || '.front';
    this.midId = options.midId || 'mid';
    this.items = []; 
  }

  init() {
    this.createLayers();
    this.setupMidLayer();
    this.hijackFrontElements();
    this.syncPositions();
    this.setupObservers();
  }


  createLayers() {

    this.midLayer = document.createElement('div');
    this.midLayer.id = 'sandwich-layer-mid';
    Object.assign(this.midLayer.style, {
      position: 'fixed', inset: '0', zIndex: '9998', pointerEvents: 'none'
    });


    this.frontLayer = document.createElement('div');
    this.frontLayer.id = 'sandwich-layer-front';
    Object.assign(this.frontLayer.style, {
      position: 'fixed', inset: '0', zIndex: '9999', pointerEvents: 'none'
    });

    document.body.appendChild(this.midLayer);
    document.body.appendChild(this.frontLayer);
  }


  setupMidLayer() {
    const midElement = document.getElementById(this.midId);
    if (midElement) {
      this.midLayer.appendChild(midElement);
      midElement.style.pointerEvents = 'auto'; // 내부 클릭 허용
    }
  }


  hijackFrontElements() {
    const frontElements = document.querySelectorAll(this.frontSelector);

    frontElements.forEach((el) => {

      const placeholder = document.createElement('div');
      placeholder.className = 'sandwich-placeholder';

      placeholder.style.display = window.getComputedStyle(el).display; 
      

      el.parentNode.insertBefore(placeholder, el);


      this.frontLayer.appendChild(el);
      Object.assign(el.style, {
        position: 'absolute', 
        margin: '0',
        pointerEvents: 'auto' 
      });


      this.items.push({ placeholder, original: el });
    });
  }


  syncPositions = () => {
    this.items.forEach(({ placeholder, original }) => {
      const rect = placeholder.getBoundingClientRect();

      original.style.top = `${rect.top}px`;
      original.style.left = `${rect.left}px`;
      original.style.width = `${rect.width}px`;
      original.style.height = `${rect.height}px`;
    });
  };


  setupObservers() {
    window.addEventListener('scroll', this.syncPositions, { passive: true });
    window.addEventListener('resize', this.syncPositions, { passive: true });

    const resizeObserver = new ResizeObserver(this.syncPositions);
    this.items.forEach(({ placeholder }) => {
      resizeObserver.observe(placeholder);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const renderer = new SandwichRenderer({ 
    frontSelector: '.front', 
    midId: 'mid' 
  });
  renderer.init();
});