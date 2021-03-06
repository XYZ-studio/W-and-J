import sleep from './sleep.js'
import login from './login.js'


export default async(Init) => {
    let session = await (await fetch("/api/sessions-data")).json()
    if(session.code) {
        let formdata = new FormData()
        formdata.append("password", session.data.Password)
        formdata.append("name", session.data.Account)
        let logindata = await (await fetch("/api/login", { method: "POST", body: formdata })).json()
        if(logindata.code) {
            Init.login = true
            Init.token = logindata.data.token
            Init.logindata = logindata.data
            Init.likes = JSON.parse(logindata.data.likelist).map(Number)
            if(!logindata.data.Verification) {
                Init.addMessage("未驗證Email請驗證", "email-verification")
            }
        }
    }
    Date.prototype.format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小時
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    let url = document.URL.split("#")
    await fetch("/api/paste-quantity", { mode: "cors" })
        .then(async(req) => {
            let json = await req.json()
            Init.number = json["paste-quantity"]
        })
    if (url.length === 2 && !isNaN(Number(url[1]))) {
        Init.switch = true
        Init.a = Init.number - (Number(url[1]) - 1)
        Init.q = (Math.floor(Init.a / 10)) + ((Init.a % 10 !== 0) ? 1 : 0)
        await fetch(`/api/all-paste?q=0&a=${Init.q*10}`, { mode: "cors" })
            .then(async(req) => {
                let json = await req.json()
                Init.pastes = json
                Init.switch = false
            })

    } else {
        await fetch("/api/all-paste?q=0", { mode: "cors" })
            .then(async(req) => {
                Init.pastes = await req.json()
            });
    }
    Init.$nextTick(
        _ => {
            $(function() { $("[data-toggle='tooltip']").tooltip({ html: true }); });
        }
    )
    

    document.getElementById("WandJ").onscroll = () => {
        let scrollT = document.getElementById("WandJ").scrollTop;
        let scrollH = document.getElementById("WandJ").scrollHeight;
        let clientH = document.getElementById("WandJ").clientHeight;
        if (scrollT > scrollH - clientH - 10) {
            if (Init.number >= Init.q * 10 + 10) {
                Init.q++;
                fetch(`/api/all-paste?q=${Init.q}`, { mode: "cors" })
                    .then(async(req) => {
                        let json = await req.json()
                        Init.pastes = Init.pastes.concat(json)

                        

                    })
            }
        }
    };


    (async() => {
        while (1) {

            // let pastearray = Init.pastes.map(x => x.Id)
            // if (!Init.switch) {
            //     try {
            //         await fetch("/api/all-paste?q=0", { mode: "cors" })
            //             .then(async(req) => {
            //                 let json = await req.json()
            //                 for (let i = json.length - 1; i >= 0; i--) {
            //                     if (!pastearray.includes(json[i].Id)) {
            //                         Init.pastes.unshift(json[i])
            //                         Init.number++;
            //                     }
            //                 }
            //             })
            //     } catch (error) {

            //     }

            // }
            $(function() { $("[data-toggle='tooltip']").tooltip({ html: true }); })
            await sleep(3000)
        }
    })();



    fetch("announcement.txt", { mode: "cors" })
        .then(async(req) => {
            let text = await req.text()
            Init.announcementText = text
        })
}