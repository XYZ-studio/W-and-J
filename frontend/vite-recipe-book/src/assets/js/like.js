export default (like, id) => {
    console.log(id)
    if (!like.likes.includes(id)) {
        like.likes.push(id)
    } else {
        let index = like.likes.indexOf(id);
        if (index > -1) {
            like.likes.splice(index, 1);
        }
    }
}