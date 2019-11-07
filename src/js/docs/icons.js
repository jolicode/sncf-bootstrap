import {
  fontBuilderDownloadPath
} from './../config'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class IconsGenerator {
  constructor(element) {
    this.element = element
    const data = {}
    const container = element.querySelector('[data-role=container]')
    const colors = element.querySelectorAll('[data-role=color]')
    const icons = element.querySelectorAll('[data-role=icon')
    const downloadBtn = element.querySelector('[data-role=download]')
    const fontInput = document.getElementById('withFont')
    const pngInput = document.getElementById('withPng')
    const svgInput = document.getElementById('withSvg')
    const sizeInput = document.getElementById('withSize')
    const selectAllBtns = element.querySelectorAll('[data-role=selectall]')

    colors.forEach((elem) => {
      const color = elem.getAttribute('data-color')
      elem.addEventListener('click', () => {
        container.style.color = color
        data.withColor = color
      })
    })

    icons.forEach((elem) => {
      const icon = elem.getAttribute('data-icon')
      elem.addEventListener('click', () => {
        if (!data.icons || !Array.isArray(data.icons)) {
          data.icons = []
        }

        if (elem.classList.contains('selected')) {
          const index = data.icons.indexOf(icon)
          if (index > -1) {
            data.icons.splice(index, 1)
          }
        } else {
          data.icons.push(icon)
        }

        elem.classList.toggle('selected')
        this.handleBtnState(downloadBtn, data)
      })
    })

    downloadBtn.addEventListener('click', () => {
      this.handleDownload(downloadBtn, sizeInput, data)
    })

    fontInput.addEventListener('change', () => {
      if (fontInput.checked) {
        data.withFont = true
      } else {
        data.withFont = false
      }
      this.handleBtnState(downloadBtn, data)
    })

    pngInput.addEventListener('change', () => {
      if (pngInput.checked) {
        data.withPng = true
      } else {
        data.withPng = false
      }
      this.handleBtnState(downloadBtn, data)
    })

    svgInput.addEventListener('change', () => {
      if (svgInput.checked) {
        data.withSvg = true
      } else {
        data.withSvg = false
      }
      this.handleBtnState(downloadBtn, data)
    })

    selectAllBtns.forEach((selectAllBtn) => {
      const allIcons = JSON.parse(selectAllBtn.getAttribute('data-values'))

      selectAllBtn.addEventListener('click', () => {
        if (!data.icons || !Array.isArray(data.icons)) {
          data.icons = [...allIcons]
        } else {
          allIcons.forEach((icon) => {
            if (!data.icons.includes(icon)) {
              data.icons.push(icon)
            }
          })
        }

        icons.forEach((elem) => {
          if (data.icons.includes(elem.getAttribute('data-icon'))) {
            elem.classList.add('selected')
          }
        })
        this.handleBtnState(downloadBtn, data)
      })
    })
  }

  handleDownload(btn, sizeInput, data) {
    this.disableBtn(btn)


    if (sizeInput.value) {
      data.withSize = parseInt(sizeInput.value, 10)
    }

    window.fetch(fontBuilderDownloadPath, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        window.open(`${fontBuilderDownloadPath}/${data}`)
      })
  }

  disableBtn(btn) {
    btn.style['pointer-event'] = 'none'
  }

  enableBtn(btn) {
    btn.style['pointer-event'] = 'initial'
  }

  handleBtnState(btn, data) {
    if (data.icons && data.icons.length > 0 && (data.withSvg || data.withPng || data.withFont)) {
      btn.removeAttribute('disabled')
    } else {
      btn.setAttribute('disabled', true)
    }
  }
}

export default IconsGenerator
