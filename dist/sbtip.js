(function (window) {
  try {
    let options = {
      pad: 16,
      hidden: 'hidden',
      sidebar: '.sidebar',
    }

    if (window.sbtip && typeof window.sbtip === 'object') {
      options = { ...options, ...window.sbtip }
    }

    if (typeof options.pad !== 'number') {
      console.error('sbtip: pad option must be a number.')
      return
    }

    if (options.pad < 0) {
      console.error('sbtip: pad option must be a postive number.')
      return
    }

    if (typeof options.hidden !== 'boolean' && typeof options.hidden !== 'string') {
      console.error('sbtip: hidden option must be a boolean or a string.')
      return
    }

    let sbtip = document.querySelector('.sbtip')

    if (!sbtip) {
      sbtip = document.createElement('div')
      sbtip.classList.add('sbtip')
      sbtip.style.position = 'absolute'
      document.body.appendChild(sbtip)
    }

    let sidebar = document.querySelector(options.sidebar)

    if (!sidebar) {
      console.error(`sbtip: sidebar element not found using the ${options.sidebar} selector.`)
      return
    }

    let tips = document.querySelectorAll("[role='tooltip']")

    if (!tips.length) {
      return
    }

    let showingSbtip = false
    let sbtipX = 0
    let sbtipY = 0

    if (options.hidden) {
      if (typeof options.hidden === 'string') {
        sbtip.classList.add(options.hidden.trim())
      } else {
        sbtip.classList.add('hidden')
      }
    }

    tips.forEach((tip) => {
      tip.addEventListener('mouseenter', () => {
        let tooltip = tip.getAttribute('aria-label')
        let rect = tip.getBoundingClientRect()
        sbtipY = rect.top + 'px'
        sbtipX = options.pad + tip.clientWidth + rect.left + 'px'
        sbtip.innerHTML = tooltip
        sbtip.classList.remove('hidden')
        showingSbtip = true
      })
      tip.addEventListener('mouseleave', () => {
        resetSbtip()
      })
    })

    function resetSbtip() {
      sbtip.innerHTML = ''
      sbtip.classList.add('hidden')
      showingSbtip = false
      sbtipY = 0
      sbtipX = 0
    }

    function move() {
      sbtip.style.left = sbtipX
      sbtip.style.top = sbtipY
    }

    function handleTouchMove(e) {
      if (showingSbtip) {
        move(e)
      }
    }

    function handleMouseMove(e) {
      if (showingSbtip) {
        move(e)
      }
    }

    function handleScroll() {
      if (showingSbtip) {
        resetSbtip()
      }
    }

    sidebar.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
  } catch (error) {
    console.error('sbtip:', error)
  }
})(window)
