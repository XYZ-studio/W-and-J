export default function logOut(logOut) {
    
    fetch("/api/sign-out").then(req => {
        return req.text()
    }).then(content => {
        if(content === "ok") {
            logOut.token = ""
            logOut.login = false
        }
    })
}