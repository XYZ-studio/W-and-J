
(() => {



    var onloadCallback = function(response) {
        token = response
    }
    
    var unloadCallback = function() {
        token = null
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
                            location.pathname = "/"
                        })
                        
                    })

                    grecaptcha.render("g-recaptcha",
                    { 
                        callback: onloadCallback,
                        "expired-callback": unloadCallback,
                        "error-callback":unloadCallback 
                    })
                }
            },
            {
                path :"/sign-out",
                fun :async function() {
                    return await (await fetch('/routers/sign-out.html')).text()
                },
                ready:function() {
                    grecaptcha.render("g-recaptcha",
                    { 
                        callback: onloadCallback,
                        "expired-callback": unloadCallback, 
                        "error-callback":unloadCallback 
                    })
                    
                    document.getElementById("buttons").addEventListener("click", e => {
                        console.log(token)

                    })
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