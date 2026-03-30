'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function FlowerShop() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; char: string }>>([])
  const magnetButtons = useRef<Array<HTMLButtonElement | null>>([])

  const textRollItems = [
    'Свежие розы каждый день',
    'Букеты ручной работы',
    'Доставка по городу за 2 часа',
    'Композиции для любого события',
  ]

  const jobs = [
    {
      id: 1,
      title: 'Флорист-дизайнер',
      location: 'Москва',
      type: 'Полная занятость',
      salary: 'от 80 000 ₽',
      description: 'Создание авторских букетов и цветочных композиций',
    },
    {
      id: 2,
      title: 'Курьер-доставщик',
      location: 'Москва',
      type: 'Гибкий график',
      salary: 'от 60 000 ₽',
      description: 'Доставка цветов клиентам с заботой и вниманием',
    },
    {
      id: 3,
      title: 'Администратор салона',
      location: 'Санкт-Петербург',
      type: 'Полная занятость',
      salary: 'от 70 000 ₽',
      description: 'Работа с клиентами, консультации по выбору букетов',
    },
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % textRollItems.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleMagnetize = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const button = magnetButtons.current[index]
    if (!button) return

    const rect = button.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

    if (distance < 100) {
      const strength = (100 - distance) / 100
      button.style.transform = `translate(${distanceX * strength * 0.3}px, ${distanceY * strength * 0.3}px)`
    }
  }

  const handleMagnetizeLeave = (index: number) => {
    const button = magnetButtons.current[index]
    if (button) {
      button.style.transform = 'translate(0, 0)'
    }
  }

  const createParticles = (text: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const newParticles = text.split('').map((char, i) => ({
      id: Date.now() + i,
      x: rect.left + (rect.width / text.length) * i,
      y: rect.top + rect.height / 2,
      char,
    }))
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Gradient */}
      <div
        className="fixed inset-0 opacity-60 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.2), transparent 50%)`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-sm sticky top-0">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            🌸 Флора
          </h1>
          <ul className="flex gap-4 md:gap-8 text-sm md:text-base">
            <li><a href="#catalog" className="hover:text-pink-500 transition">Каталог</a></li>
            <li><a href="#about" className="hover:text-pink-500 transition">О нас</a></li>
            <li><a href="#jobs" className="hover:text-pink-500 transition">Вакансии</a></li>
          </ul>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero Section with Text Roll */}
        <section className="container mx-auto px-4 py-12 md:py-24">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-800">
              Волшебство цветов
            </h2>
            <div className="h-16 md:h-20 flex items-center justify-center overflow-hidden">
              <p
                className="text-xl md:text-2xl text-pink-600 font-medium transition-all duration-500 transform"
                style={{
                  transform: `translateY(${currentTextIndex * -100}%)`,
                }}
              >
                {textRollItems.map((text, index) => (
                  <span
                    key={index}
                    className="block h-16 md:h-20 flex items-center justify-center"
                  >
                    {text}
                  </span>
                ))}
              </p>
            </div>
            
            {/* Particle Text Effect */}
            <div className="relative inline-block mt-8">
              <button
                onMouseEnter={(e) => createParticles('ЗАКАЗАТЬ БУКЕТ', e)}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                ЗАКАЗАТЬ БУКЕТ
              </button>
              {particles.map((particle) => (
                <span
                  key={particle.id}
                  className="absolute text-pink-500 font-bold text-xl pointer-events-none animate-ping"
                  style={{
                    left: particle.x,
                    top: particle.y,
                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) forwards',
                  }}
                >
                  {particle.char}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Catalog Section with Magnetize Buttons */}
        <section id="catalog" className="bg-white/50 backdrop-blur-sm py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800">
              Популярные букеты
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['Романтика', 'Весна', 'Элегантность'].map((name, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  onMouseMove={(e) => handleMagnetize(e, index)}
                  onMouseLeave={() => handleMagnetizeLeave(index)}
                >
                  <div className="h-64 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center text-6xl">
                    {index === 0 ? '🌹' : index === 1 ? '🌷' : '🌺'}
                  </div>
                  <div className="p-6">
                    <h4 className="text-2xl font-bold mb-2 text-slate-800">{name}</h4>
                    <p className="text-slate-600 mb-4">
                      Изысканная композиция из свежих цветов
                    </p>
                    <p className="text-2xl font-bold text-pink-600 mb-4">
                      {index === 0 ? '3 500' : index === 1 ? '2 800' : '4 200'} ₽
                    </p>
                    <button
                      ref={(el) => {
                        magnetButtons.current[index] = el
                      }}
                      className="w-full py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-all duration-300"
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">О нас</h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              Мы — команда профессиональных флористов с 10-летним опытом. Каждый букет создается с любовью
              и вниманием к деталям. Используем только свежие цветы от проверенных поставщиков.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Наша миссия — дарить радость и создавать незабываемые моменты через красоту цветов.
            </p>
          </div>
        </section>

        {/* Job Listing Section */}
        <section id="jobs" className="bg-white/50 backdrop-blur-sm py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800">
              Присоединяйтесь к нашей команде
            </h3>
            <div className="max-w-4xl mx-auto space-y-6">
              {jobs.map((job, index) => (
                <article
                  key={job.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-pink-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-slate-800 mb-2">{job.title}</h4>
                      <p className="text-slate-600 mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full">
                          📍 {job.location}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                          ⏰ {job.type}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          💰 {job.salary}
                        </span>
                      </div>
                    </div>
                    <button
                      ref={(el) => {
                        magnetButtons.current[index + 3] = el
                      }}
                      onMouseMove={(e) => handleMagnetize(e, index + 3)}
                      onMouseLeave={() => handleMagnetizeLeave(index + 3)}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                    >
                      Откликнуться
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-2">🌸 Флора — цветы с душой</p>
          <p className="text-slate-400 text-sm">© 2024 Все права защищены</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-pink-400 transition">Telegram</a>
            <a href="#" className="hover:text-pink-400 transition">Instagram</a>
            <a href="#" className="hover:text-pink-400 transition">VK</a>
          </div>
        </div>
      </footer>
    </div>
  )
}