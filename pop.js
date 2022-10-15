(function () {
    // DO NOT MODIFY ANY VALUE
    const POP_TRIGGER = {
        "BACK_NAVIGATION": 1,
        "RANDOM_CLICK": 2,
    }

    const POP_MODE = {
        "QUEUE": 1,
        "RANDOM": 2,
        "SAFE_RANDOM": 3,
    }

    const POP_STATE = {
        "READY": false,
        "NAVIGATE": false,
    }

    // EDIT THIS CONFIG IS ALLOWED
    const POP_CONFIG = {
        "DELAY": 60, // In seconds
        "FIRST_RUN": false, // Attach pop immediately (only work for POP_TRIGGER.RANDOM_CLICK)
        "MODE": POP_MODE.SAFE_RANDOM, // Refer to POP_MODE variable
        "TRIGGER": POP_TRIGGER.RANDOM_CLICK, // Refer to POP_TRIGGER variable
        "OPTIONS": "menubar=1,resizable=1,width=450,height=300,top=100,left=100", // Fallback window.open options
    }

    const POP_STORAGE = {
        "TIMESTAMP": "_pop_timestamp",
        "LAST_POPPED_INDEX": "_pop_last_popped_index",
        "QUEUE": "_pop_queue",
    }

    const POP_DATA = [
        {
            "url": "https://shope.ee/4zy4f3UKln",
            "options": "menubar=1,resizable=1,width=450,height=300,top=100,left=100", // custom options
        },
        {
            "url": "https://shope.ee/8zUBzGcrLp",
        },
        {
            "url": "https://shope.ee/99ncBZcE0q",
        },
        {
            "url": "https://shope.ee/7zbenQgfNb",
        },
        {
            "url": "https://shope.ee/89v4zjg22c",
        },
        {
            "url": "https://shope.ee/8KEVC2fOhd",
        },
        {
            "url": "https://shope.ee/8UXvOLelMe",
        },
        {
            "url": "https://shope.ee/9zMjB6Z3Jv",
        },
        {
            "url": "https://shope.ee/99ncBZcE0q",
        },
        {
            "url": "https://shope.ee/AJzZZiXmdx",
        },
    ]

    if (!localStorage.getItem(POP_STORAGE.TIMESTAMP)) {
        localStorage.setItem(POP_STORAGE.TIMESTAMP, Date.now() + (POP_CONFIG.DELAY * 1000))
    }

    POP_STATE.READY = POP_CONFIG.TRIGGER == POP_TRIGGER.RANDOM_CLICK && POP_CONFIG.FIRST_RUN

    setInterval(function () {
        console.debug(POP_STATE)

        let lastPoppedTimestamp = localStorage.getItem(POP_STORAGE.TIMESTAMP)

        if (lastPoppedTimestamp != null && !POP_CONFIG.FIRST_RUN) {
            lastPoppedTimestamp = parseInt(lastPoppedTimestamp)

            if (Date.now() >= lastPoppedTimestamp && !POP_STATE.NAVIGATE) {
                POP_STATE.READY = true
            }
        }

        if (POP_CONFIG.TRIGGER == POP_TRIGGER.BACK_NAVIGATION && POP_STATE.READY && !POP_STATE.NAVIGATE) {
            history.replaceState(null, document.title, location.pathname + "#!/history")
            history.pushState(null, document.title, location.pathname)

            window.addEventListener("popstate", function () {
                if (location.hash === "#!/history") {
                    let [popData, _] = getPopData()

                    history.replaceState(null, document.title, location.pathname)

                    localStorage.setItem(POP_STORAGE.TIMESTAMP, Date.now() + (POP_CONFIG.DELAY * 1000))

                    POP_STATE.NAVIGATE = false

                    setTimeout(function () {
                        location.replace(popData.url)
                    }, 10)
                }
            }, {
                once: true
            })

            POP_STATE.NAVIGATE = true
            POP_STATE.READY = false
        }
    }, 1000)

    if (POP_CONFIG.TRIGGER == POP_TRIGGER.RANDOM_CLICK) {
        window.addEventListener("click", function () {
            if (POP_STATE.READY) {
                let [popData, _] = getPopData()
                const popOptions = (popData.hasOwnProperty("options") && popData.options) || POP_CONFIG.OPTIONS

                window.open(popData.url, "popup_" + (Math.random() * 100).toString(), popOptions)

                POP_STATE.READY = false

                localStorage.setItem(POP_STORAGE.TIMESTAMP, Date.now() + (POP_CONFIG.DELAY * 1000))

                if (POP_CONFIG.FIRST_RUN) {
                    POP_CONFIG.FIRST_RUN = false
                }
            }
        })
    }

    function generatePopDataIndex() {
        return Math.floor(Math.random() * POP_DATA.length)
    }

    function getPopData() {
        switch (POP_CONFIG.MODE) {
            case POP_MODE.RANDOM:
                const popIndex = generatePopDataIndex()

                return [POP_DATA[popIndex], popIndex]
            case POP_MODE.SAFE_RANDOM:
                {
                    let popIndex = generatePopDataIndex()
                    const lastPoppedIndex = localStorage.getItem(POP_STORAGE.LAST_POPPED_INDEX)

                    if (lastPoppedIndex) {
                        while (popIndex.toString() == lastPoppedIndex) {
                            popIndex = generatePopDataIndex()
                        }
                    }

                    localStorage.setItem(POP_STORAGE.LAST_POPPED_INDEX, popIndex)

                    return [POP_DATA[popIndex], popIndex]
                }
            case POP_MODE.QUEUE:
                {
                    let popIndex = 0
                    const lastPoppedIndex = parseInt(localStorage.getItem(POP_STORAGE.LAST_POPPED_INDEX) || "0")

                    if (lastPoppedIndex < (POP_DATA.length - 1)) {
                        popIndex = lastPoppedIndex + 1
                    }

                    localStorage.setItem(POP_STORAGE.LAST_POPPED_INDEX, popIndex)

                    return [POP_DATA[popIndex], popIndex]
                }
        }
    }
})()

// made by fb.com/composer.lock
