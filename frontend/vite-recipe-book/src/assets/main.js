import post from './js/post.js'
import init from './js/init.js'
import sleep from './js/sleep.js'
import leave_comments from '../components/leave_comments.vue'
import likefun from './js/like.js'


export default {
    name: 'App',
    data() {
        return {
            textheigth: "height: 50px;",
            filepath: "",
            author: "",
            pastes: [],
            q: 0,
            title: "",
            text: "",
            number: 0,
            schedulelen: "width: 0px;",
            scheduleswitch: false,
            switch: false,
            announcement: false,
            announcementde: "opacity:1;",
            announcementText: "",
            a: 0,
            annswtich: false,
            likes: [],
            messages: [],
            messagenumber: 0
        }
    },
    components: {
        leave_comments
    },
    methods: {

        inputtext() {
            let number = this.text.match(/\n/g)
            if (number !== null) {
                this.textheigth = `height: ${number.length*29+50}px;`
            }
            if (this.text === "") {
                this.textheigth = "height: 50px;"
            }
        },
        post() {
            post(this)
        },
        like(id) {
            likefun(this, id)
        },
        imgs(json) {
            let x = []
            let data = JSON.parse(json)
            for (let i = 0; i < data.length; i += 2) {
                if (data[i] !== undefined && data[i + 1] !== undefined)
                    x.push([data[i], data[i + 1]])
            }
            if (x.length * 2 !== data.length) {
                x.push(data[data.length - 1])
            }
            return x
        },
        addMessage(message, type = "message") {
            let id = this.messagenumber
            this.messages.push({ "message": message, "id": id, "type": type })
            this.messagenumber++
                return id
        },
        rMessage(id) {
            for (let i = 0; i < this.messages.length; i++) {
                if (this.messages[i].id === id) {
                    this.messages.splice(i, 1);
                }
            }
        },
        modMessage(id, message) {
            for (let i = 0; i < this.messages.length; i++) {
                if (this.messages[i].id === id) {
                    this.messages[i].message = message
                }
            }
        }
    },
    beforeMount() {
        (async() => {
            for (let i = 0; i < 10; i++) {
                let number = (this.a > this.number) ? this.number : this.a
                console.log(number)
                if (document.querySelector(`#WandJ > div.content > div.pastes > div:nth-child(${number})`) !== null) {
                    document.querySelector(`#WandJ > div.content > div.pastes > div:nth-child(${number})`).scrollIntoView()
                    break
                }
                await sleep(1000)
            }
        })()
    },
    mounted() {
        init(this)
    }
}