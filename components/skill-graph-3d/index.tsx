import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface SkillItem {
  name: string
  level: number
  icon: string
}

interface SkillCategory {
  category: string
  icon: string
  description: string
  items: SkillItem[]
}

interface SkillGraph3DProps {
  skills: SkillCategory[]
}

const SkillGraph3D = ({ skills }: SkillGraph3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const controlsRef = useRef<OrbitControls>()

  useEffect(() => {
    if (!containerRef.current) return

    // 初始化场景
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // 设置相机
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 15
    cameraRef.current = camera

    // 设置渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 添加控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // 添加点光源
    const pointLight = new THREE.PointLight(0x6366f1, 1)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    // 创建技能节点
    const createSkillNode = (text: string, level: number, position: THREE.Vector3) => {
      const geometry = new THREE.SphereGeometry(level * 0.05 + 0.2, 32, 32)
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0x6366f1),
        transparent: true,
        opacity: 0.8,
      })
      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.copy(position)
      scene.add(sphere)

      // 添加发光效果
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          c: { value: 0.5 },
          p: { value: 1.4 },
          glowColor: { value: new THREE.Color(0x6366f1) },
          viewVector: { value: camera.position }
        },
        vertexShader: `
          uniform vec3 viewVector;
          varying float intensity;
          void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 vNormel = normalize(normalMatrix * viewVector);
            intensity = pow(0.5 - dot(vNormal, vNormel), 2.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying float intensity;
          void main() {
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4(glow, 1.0);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      })

      const glowSphere = new THREE.Mesh(
        new THREE.SphereGeometry(level * 0.05 + 0.3, 32, 32),
        glowMaterial
      )
      glowSphere.position.copy(position)
      scene.add(glowSphere)

      return { sphere, glowSphere }
    }

    // 布局技能节点
    let nodeIndex = 0
    skills.forEach((category, i) => {
      const categoryAngle = (i / skills.length) * Math.PI * 2
      const categoryRadius = 5
      const categoryPos = new THREE.Vector3(
        Math.cos(categoryAngle) * categoryRadius,
        Math.sin(categoryAngle) * categoryRadius,
        0
      )

      // 创建类别节点
      const categoryNode = createSkillNode(category.category, 100, categoryPos)

      // 布局技能项
      category.items.forEach((skill, j) => {
        const skillAngle = categoryAngle + ((j / category.items.length) - 0.5) * Math.PI * 0.5
        const skillRadius = categoryRadius * 0.6
        const skillPos = new THREE.Vector3(
          categoryPos.x + Math.cos(skillAngle) * skillRadius,
          categoryPos.y + Math.sin(skillAngle) * skillRadius,
          (Math.random() - 0.5) * 2
        )

        const skillNode = createSkillNode(skill.name, skill.level, skillPos)
        nodeIndex++
      })
    })

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()

      // 更新发光效果
      scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
          child.material.uniforms.viewVector.value = camera.position
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    // 处理窗口大小变化
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach((material: THREE.Material) => material.dispose())
          } else {
            child.material.dispose()
          }
        }
      })
    }
  }, [skills])

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )
}

export default SkillGraph3D 