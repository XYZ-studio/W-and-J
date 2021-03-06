
(() => {

    var onloadCallback = function(response) {
        token = response
    }
    
    var unloadCallback = function() {
        token = null
    }

    const reloadrecaptcha = function() {
        grecaptcha.render("g-recaptcha",
        { 
            callback: onloadCallback,
            "expired-callback": unloadCallback,
            "error-callback":unloadCallback 
        })
    }
    
    const router = async() => {
        const routers = [
            {
                path :"/login",
                fun :async function() {
                    return await (await fetch('/routers/login.html')).text()
                },
                ready:function() {


                    document.getElementById("buttons").addEventListener("click", e => {
                        const name = document.getElementById("name").value
                        const password = document.getElementById("password").value
                        const fromdata = new FormData()

                        if (name === '' || password === '') {
                            alert("請填寫完整")
                            return
                        }
                        if (token === null) {
                            alert("請勾選驗證")
                            return
                        }

                        fromdata.append("password", password)
                        fromdata.append("name", name)
                        fromdata.append("recaptcha", token)

                        fetch("/api/login", { method: "POST", body: fromdata })
                        .then(req => {
                            return req.json()
                        }).then(json => {
                            console.log(json)
                            if(json.code) {
                                location.pathname = "/"
                            } else {
                                alert("登入資訊錯誤")
                                reloadrecaptcha()
                            }
                            
                        })
                        
                    })

                    reloadrecaptcha()
                }
            },
            {
                path :"/sign-up",
                fun :async function() {
                    return await (await fetch('/routers/sign-up.html')).text()
                },
                ready:function() {

                    document.getElementById("buttons").addEventListener("click", e => {

                        const name = document.getElementById("name").value
                        const password = document.getElementById("password").value
                        const email = document.getElementById("email").value
                        const fromdata = new FormData()
                        if (name === '' || password === '' || email === '') {
                            alert("請填寫完整")
                            return
                        }
                        if (token === null) {
                            alert("請勾選驗證")
                            return
                        }
                        fromdata.append("password", password)
                        fromdata.append("name", name)
                        fromdata.append("email", email)
                        fromdata.append("recaptcha", token)

                        fetch("/api/sign-up", { method: "POST", body: fromdata })
                        .then(req => {
                            return req.json()
                        }).then(json => {
                            console.log(json)
                            if(json.code) {
                                alert("驗證Email")
                                location.pathname = "/"
                            } else if (json.message === "Used") {
                                alert("此Email或名稱已註冊過")
                                reloadrecaptcha()
                            } else {
                                alert("註冊失敗")
                                reloadrecaptcha()
                            }
                            
                        })
                    })

                    reloadrecaptcha()
                }
            }
        ]

        const matchs = routers.map(router => {
            router["match"] = router.path === location.pathname
            return router
        })

        const match = matchs.find(match => match.match)
        document.getElementById("content").innerHTML = await match.fun()

        if (match.ready != undefined) {
            try {
                match.ready()
            } catch (error) {
                
            }
            
        }
        token = null
    }

    window.addEventListener("popstate", () => {
        console.log("w")
        router()
    })

    document.addEventListener("DOMContentLoaded", () => {
        document.body.addEventListener("click", e => {
            if(e.target.matches("[data-link]")) {
                e.preventDefault()
                history.pushState(null, null, e.target.href)
                router()
            }
        })
        router()
    })
    
})()