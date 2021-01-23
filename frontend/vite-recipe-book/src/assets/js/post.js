import sleep from './sleep.js'


export default (Post) => {
    if (Post.switch) return
    let file = document.querySelector("#WandJ > div.content > div.add-paste > label > input[type=file]")
    let re = (text) => {
        return RegExp(`[(\n) ]{${text.length}}`).test(text)
    }

    if (Post.title.length > 10) {
        alert("標題字數超過10個字元瞜")
        return
    }
    if (Post.text.length > 2000) {
        alert("內容超過2000字元摟")
    }
    if (!re(Post.text) && !re(Post.title)) {
        Post.switch = true
        let author = (Post.author === "") ? "匿名發言者" : Post.author
        let filename = (file.files[0] === undefined) ? null : file.files[0].name
        let xhr = new XMLHttpRequest();
        xhr.open("post", `/api/add-paste?title=${Post.title}&content=${encodeURIComponent(Post.text)}&author=${author}&filename=${filename}`, true)
        xhr.onload = async(e) => {
            let json = JSON.parse(xhr.responseText)
            if (!json.code) {
                alert(json.message)
            } else {
                (async() => {
                    for (let i = 10; i > -50; i -= 4) {
                        Post.scheduleswitch = `bottom:${i}px;`
                        await sleep(50)
                    }
                })();
                Post.text = ""
                Post.title = ""
                Post.author = ""
                Post.number++
                    file.value = ""
                Post.schedulelen = "width: 0px"
            }
            console.log(json)
            Post.switch = false
        }
        xhr.upload.onprogress = (e) => {
            Post.schedulelen = `width: ${(e.loaded / e.total)*200}px`
        }
        xhr.onerror = async() => {
            for (let i = 10; i > -50; i -= 4) {
                Post.scheduleswitch = `bottom:${i}px;`
                await sleep(50)
            }
            Post.schedulelen = "width: 0px"
            alert("發文錯誤")
            Post.switch = false
        }
        Post.scheduleswitch = "bottom: 10px"
        xhr.send(file.files[0])
    } else {
        alert("請輸入內容跟標題")
    }
}