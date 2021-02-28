export default function logOut(logOut) {
    
    fetch("/api/log-out").then(req => {
        return req.text()
    }).then(content => {
        if(content === "ok") {
            logOut.token = ""
            logOut.login = false
        }
    })
}