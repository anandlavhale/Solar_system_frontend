import * as THREE from 'three';
import { planetData } from '../data/planets';

export class SolarSystem {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private planets: { [key: string]: THREE.Group } = {};
  private planetMeshes: { [key: string]: THREE.Mesh } = {};
  private labels: { [key: string]: HTMLElement } = {};
  private clock: THREE.Clock;
  private isPaused: boolean = false;
  private planetSpeeds: { [key: string]: number } = {};
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private showLabels: boolean = true;
  private onPlanetClick: ((planet: string) => void) | null = null;
  private cameraMode: 'free' | 'follow' = 'free';
  private followTarget: string | null = null;
  private cameraControls: any;

  constructor(private canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Initialize planet speeds
    Object.keys(planetData).forEach(planet => {
      this.planetSpeeds[planet] = 1.0;
    });
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupLighting();
    this.createStarField();
    this.createSun();
    this.createPlanets();
    this.setupEventListeners();
    this.animate();
  }

  private setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  private setupCamera() {
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0, 0, 0);
  }

  private setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
    this.scene.add(ambientLight);

    // Sun light
    const sunLight = new THREE.PointLight(0xffffff, 2, 0, 0.1);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    this.scene.add(sunLight);
  }

  private createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8
    });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(stars);
  }

  private createSun() {
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5
    });
    
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.name = 'Sun';
    this.scene.add(sun);
    this.planetMeshes['Sun'] = sun;

    // Add sun glow effect
    const glowGeometry = new THREE.SphereGeometry(7, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.scene.add(glow);
  }

  private createPlanets() {
    Object.entries(planetData).forEach(([name, data]) => {
      const planetGroup = new THREE.Group();
      
      // Create planet mesh
      const geometry = new THREE.SphereGeometry(data.size, 32, 32);
      const material = new THREE.MeshLambertMaterial({ color: data.color });
      const planet = new THREE.Mesh(geometry, material);
      planet.name = name;
      planet.receiveShadow = true;
      planet.castShadow = true;
      
      // Position planet at orbital distance
      planet.position.x = data.distance;
      
      planetGroup.add(planet);
      this.scene.add(planetGroup);
      
      this.planets[name] = planetGroup;
      this.planetMeshes[name] = planet;
      
      // Create label
      this.createLabel(name, planet);
    });
  }

  private createLabel(planetName: string, planet: THREE.Mesh) {
    const label = document.createElement('div');
    label.className = 'absolute bg-black/75 text-white px-2 py-1 rounded text-xs pointer-events-none z-30';
    label.textContent = planetName;
    label.style.display = 'none';
    document.body.appendChild(label);
    this.labels[planetName] = label;
  }

  private setupEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.canvas.addEventListener('click', this.onMouseClick.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    
    // Simple camera controls
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    
    this.canvas.addEventListener('mousedown', (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    });
    
    this.canvas.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
    
    this.canvas.addEventListener('mousemove', (event) => {
      if (isMouseDown && this.cameraMode === 'free') {
        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;
        
        // Rotate camera around the origin
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(this.camera.position);
        spherical.theta -= deltaX * 0.01;
        spherical.phi += deltaY * 0.01;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
        
        this.camera.position.setFromSpherical(spherical);
        this.camera.lookAt(0, 0, 0);
        
        mouseX = event.clientX;
        mouseY = event.clientY;
      }
    });
    
    this.canvas.addEventListener('wheel', (event) => {
      if (this.cameraMode === 'free') {
        const distance = this.camera.position.length();
        const newDistance = Math.max(10, Math.min(500, distance + event.deltaY * 0.1));
        this.camera.position.multiplyScalar(newDistance / distance);
      }
    });
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onMouseClick(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(Object.values(this.planetMeshes));

    if (intersects.length > 0) {
      const clickedPlanet = intersects[0].object.name;
      if (this.onPlanetClick) {
        this.onPlanetClick(clickedPlanet);
      }
    }
  }

  private onMouseMove(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.updateLabels();
  }

  private updateLabels() {
    if (!this.showLabels) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(Object.values(this.planetMeshes));

    // Hide all labels first
    Object.values(this.labels).forEach(label => {
      label.style.display = 'none';
    });

    if (intersects.length > 0) {
      const hoveredPlanet = intersects[0].object.name;
      const label = this.labels[hoveredPlanet];
      if (label) {
        label.style.display = 'block';
        label.style.left = `${event.clientX + 10}px`;
        label.style.top = `${event.clientY - 10}px`;
      }
    }
  }

  private animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    if (!this.isPaused) {
      const delta = this.clock.getDelta();
      this.updatePlanets(delta);
    }
    
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
  }

  private updatePlanets(delta: number) {
    Object.entries(this.planets).forEach(([name, planetGroup]) => {
      const data = planetData[name];
      if (data) {
        const speed = this.planetSpeeds[name] * data.speed * delta;
        planetGroup.rotation.y += speed;
        
        // Planet self-rotation
        const planet = this.planetMeshes[name];
        if (planet) {
          planet.rotation.y += speed * 2;
        }
      }
    });
  }

  private updateCamera() {
    if (this.cameraMode === 'follow' && this.followTarget) {
      const planet = this.planetMeshes[this.followTarget];
      if (planet) {
        const worldPosition = new THREE.Vector3();
        planet.getWorldPosition(worldPosition);
        
        // Position camera behind and above the planet
        const offset = new THREE.Vector3(0, 10, 20);
        this.camera.position.copy(worldPosition).add(offset);
        this.camera.lookAt(worldPosition);
      }
    }
  }

  // Public methods
  togglePause() {
    this.isPaused = !this.isPaused;
  }

  resetPlanets() {
    Object.values(this.planets).forEach(planetGroup => {
      planetGroup.rotation.y = 0;
    });
    Object.values(this.planetMeshes).forEach(planet => {
      planet.rotation.y = 0;
    });
  }

  setPlanetSpeed(planet: string, speed: number) {
    this.planetSpeeds[planet] = speed;
  }

  setShowLabels(show: boolean) {
    this.showLabels = show;
    if (!show) {
      Object.values(this.labels).forEach(label => {
        label.style.display = 'none';
      });
    }
  }

  setOnPlanetClick(callback: (planet: string) => void) {
    this.onPlanetClick = callback;
  }

  setCameraMode(mode: 'free' | 'follow') {
    this.cameraMode = mode;
    if (mode === 'free') {
      this.followTarget = null;
    }
  }

  followPlanet(planet: string) {
    this.followTarget = planet;
    this.cameraMode = 'follow';
  }

  dispose() {
    // Clean up resources
    Object.values(this.labels).forEach(label => {
      document.body.removeChild(label);
    });
    
    this.renderer.dispose();
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }
}