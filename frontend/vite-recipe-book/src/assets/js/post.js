import sleep from './sleep.js'


export default (Post) => {
    if (Post.switch) return
    let file = document.querySelector("#WandJ > div.content > div.add-paste > label > input[type=file]")
    let re = (text) => {
        return RegExp(`[(\n) ]{${text.length}}`).test(text)
    }

    if (Post.title.length > 10) {
        Post.addMessage("標題字數超過10個字元瞜")
        return
    }
    if (Post.text.length > 2000) {
        Post.addMessage("內容超過2000字元摟")
        return
    }
    if (!re(Post.text) && !re(Post.title)) {

        Post.switch = true
        let id = Post.addMessage("上傳中", "download")
        let xhr = new XMLHttpRequest();
        let formdata = new FormData()
        let files = null
        for (let i of file.files) {
            console.log(i.name, i)
            formdata.append(i.name, i)
            files = true
        }

        xhr.open("post",
         `/api/add-paste?title=${Post.title}&content=${encodeURIComponent(Post.text)}&files=${files}`, 
         true
        )
        xhr.setRequestHeader("Token", Post.token)
        xhr.onload = async(e) => {
            try {
                let json = JSON.parse(xhr.responseText)
                if (!json.code) {
                    Post.addMessage(json.message)
                } else {
                    Post.pastes.unshift(json.data)
                    Post.scheduleswitch = false
                    Post.text = ""
                    Post.title = ""
                    file.value = ""
                    Post.number++
                    Post.schedulelen = "width: 0px"
                }
    
                Post.modMessage(id, "上傳完畢")
                Post.switch = false 
            } catch (error) {
                Post.scheduleswitch = false
                Post.schedulelen = "width: 0px"
                Post.modMessage(id, "上傳錯誤")
                Post.switch = false
            }

        }
        xhr.upload.onprogress = (e) => {
            Post.schedulelen = `width: ${(e.loaded / e.total)*180}px`
        }
        xhr.onerror = async() => {
            Post.scheduleswitch = false
            Post.schedulelen = "width: 0px"
            Post.modMessage(id, "上傳錯誤")
            Post.switch = false
        }
        Post.scheduleswitch = true
        xhr.send(formdata)
    } else {
        Post.addMessage("請輸入內容跟標題")
    }
}