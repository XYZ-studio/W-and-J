export default async(like, id) => {
    console.log(like.likes)
    let number = like.number - id
    if (!like.login) {
        like.addMessage("先登入喔")
        return
    } else if (!like.logindata.Verification) {
        like.addMessage("Email先驗證喔")
        return
    }
    if (!like.likes.includes(id)) {


        const content = await (await fetch(`/api/like?m=a&id=${id}`, 
            { mode: "cors", method: "POST", headers:{ Token: like.token } }
        )).text()
        if(content === "ok") {
            like.likes.push(id)
            like.pastes[number].Likenumber += 1
        }

    } else {

        const content = await (await fetch(`/api/like?m=r&id=${id}`, 
            { mode: "cors", method: "POST", headers:{ Token: like.token } }
        )).text()
        if(content === "ok") {
            let index = like.likes.indexOf(id);
            if (index > -1) {
                like.likes.splice(index, 1);
            }
            like.pastes[number].Likenumber -= 1
        }

    }
}