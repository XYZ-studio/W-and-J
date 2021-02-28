let token = null

function onloadCallback() {
    var onloadCallback = function(response) {
        token = response
    }
    
    var unloadCallback = function() {
        token = null
    }

    grecaptcha.render("g-recaptcha",
    { 
        callback: onloadCallback,
        "expired-callback": unloadCallback,
        "error-callback":unloadCallback 
    })
}