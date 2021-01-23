import sleep from './sleep.js'



export default async(Init) => {
    let url = document.URL.split("#")
    if (url.length === 2 && !isNaN(Number(url[1]))) {
        Init.switch = true
        Init.announcement = false
        Init.a = Number(url[1])
        Init.q = (Math.floor(Init.a / 10)) + ((Init.a % 10 !== 0) ? 1 : 0)
        await fetch(`/api/all-paste?q=0&a=${Init.q*10}`, { mode: "cors" })
            .then(async(req) => {
                let json = await req.json()
                Init.pastes = json

                console.log(json, Init.q);
                Init.switch = false
            })

    } else {
        await fetch("/api/all-paste?q=0", { mode: "cors" })
            .then(async(req) => {
                Init.pastes = await req.json()
            });
    }

    document.onscroll = () => {
        let scrollT = document.documentElement.scrollTop || document.body.scrollTop;
        let scrollH = document.documentElement.scrollHeight || document.body.scrollHeight;
        let clientH = document.documentElement.clientHeight || document.body.clientHeight;
        if (scrollT > scrollH - clientH - 10) {
            if (Init.number >= Init.q * 10 + 10) {
                Init.q++
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
            let pastearray = Init.pastes.map(x => x.Id)
            if (!Init.switch) {
                fetch("/api/all-paste?q=0", { mode: "cors" })
                    .then(async(req) => {
                        let json = await req.json()
                        for (let i = json.length - 1; i >= 0; i--) {
                            if (!pastearray.includes(json[i].Id)) {
                                Init.pastes.unshift(json[i])
                                Init.number++
                            }
                        }
                    })
            }
            await sleep(5000)
        }
    })();

    fetch("/api/paste-quantity", { mode: "cors" })
        .then(async(req) => {
            let json = await req.json()
            Init.number = json["paste-quantity"]
        })

    fetch("announcement.txt", { mode: "cors" })
        .then(async(req) => {
            let text = await req.text()
            Init.announcementText = text
        })
}