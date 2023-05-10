const tabs = document.querySelectorAll('[data-tab-target]')
tabContents = document.querySelectorAll('[data-tab-content]')

tabs.forEach(tab => {
    tab.addEventListener(('click'), () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        tabs.forEach(temp => {
            temp.classList.remove('active')
        })
        tab.classList.add('active')
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })
        target.classList.add('active')
    })
})