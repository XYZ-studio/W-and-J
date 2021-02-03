export default async(like, id) => {
    let number = like.number - id
    if (!like.likes.includes(id)) {
        like.likes.push(id)
        like.pastes[number].Likenumber += 1
        await fetch(`/api/like?m=a&id=${id}`, { mode: "cors", method: "POST" })
    } else {
        let index = like.likes.indexOf(id);
        if (index > -1) {
            like.likes.splice(index, 1);
        }
        like.pastes[number].Likenumber -= 1
        await fetch(`/api/like?m=r&id=${id}`, { mode: "cors", method: "POST" })
    }
}