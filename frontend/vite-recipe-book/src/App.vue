<template>
  <div id="WandJ">
    <br/>
    <div class="header">
      <div class="title">W and J靠北網</div>
      <a href="/login">
        <div class="login" v-if="!login">登入</div>
      </a>
      <div class="login" v-if="login" @click="logOut()">登出</div>
      <div class="announcement" @click="announcement = true">公告</div>
    </div>

    <div class="content">
      <div class="add-paste" v-if="login && logindata.Verification">
        <input v-model="title" placeholder="標題" />

        <textarea
          v-model="text"
          id="texts"
          placeholder="你遇到的W and J的英勇事蹟"
          @input="inputtext()"
          :style="textheigth"
        ></textarea>

        <label class="btn btn-default btn-sm center-block btn-file file">
          <i class="fa fa-upload fa-2x" aria-hidden="true"></i>
          <input
            type="file"
            style="display: none"
            accept="image/png, image/jpeg"
            multiple
          />
        </label>
        <div class="button-container-3">
          <span class="mas">發文</span>
          <button type="button" name="Hover" @click="post">發文</button>
        </div>

        <div class="paste-q">目前{{ number }}篇文章</div>
        <br/>
      </div>

      <div class="pastes">
        <div class="paste" v-for="i in pastes" :key="i">
          <div class="title"><a :href="'/#'+i.Id">{{ i.Title }}</a></div>

          <div class="contenttext">
            {{ i.Content }}
          </div>

          <div
            class="contentimg"
            v-if="i.File !== '[]' && i.File !== null && i.File !== 'null'"
          >
          <div class="imgs-1" v-if="JSON.parse(i.File).length === 1">
            <img :src="'/img/' + JSON.parse(i.File)[0]" />
          </div>
          <div class="imgs-2" v-if="JSON.parse(i.File).length >= 2" >
            <div v-for="x in imgs(i.File)" :key="x">

              <div v-if="typeof(x) !== 'string'">

                <div class="img">
                  <div class="cimg">
                    <img :src="'/img/' + x[0]">
                  </div>
                </div>

                <div class="img">
                  <div class="cimg">
                    <img :src="'/img/' + x[1]">
                  </div>
                </div>
              </div>

              <div v-else>
                <div class="imgone">
                    <img :src="'/img/' + x">
                </div>
              </div>
            </div>
          </div>
            
          </div>

          <div class="author">
            作者:{{ i.Author }}
          </div>

          <div class="time">
            {{ new Date(Number(i.Time)).format("yyyy-MM-dd hh:mm:ss") }}
          </div>

          <div class="options">
            <div class="leave_comments">
              <div class="text">留言</div>
            </div>

            <div
              :class="!likes.includes(i.Id) ? 'like tooltip-test' : 'like1 tooltip-test'"
              @click="like(i.Id)"
              data-toggle="tooltip"
              :data-original-title="`<h5>${i.Likenumber}個讚</h5>`"

            >
              <div class="heart">
                <div class="heart1"></div>
                <div class="heart2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="announcement">
      <div
        class="announcement-content"
        v-if="announcement"
        @click="announcement = false"
      >
        <div id="content">
          <div class="title">公告</div>

          <div id="text">
            <div v-for="i in announcementText.split('\n')" :key="i">
              {{ i }}
              <br />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="messages">

        <div class="message" v-for="i in messages" :key="i">
          <div class="message-x" @click="rMessage(i.id)">

            <div class="x"></div>

          </div>

          <div v-if="i.type =='message'">
            {{ i.message }}
          </div>

          <div v-if="i.type =='email-verification'">
            {{ i.message }}
          </div>

          <div v-else-if="i.type == 'download'">
            <div style="text-align: center">
              {{ i.message }}
            </div>

            <div class="schedule" v-if="i.message === '上傳中'">
              <div id="len" :style="schedulelen">

              </div>
            </div>
          </div>
          
        </div>

    </div>

    <leave_comments></leave_comments>

  </div>
</template>

<script>
import main from "./assets/main.js";
export default main;
</script>

<style lang="scss">
@import "./assets/sass/button.scss";
</style>

<style lang="sass">

@font-face
  font-family: SentyTEA
  src: url(./assets/SentyTEA-20190904.ttf)

@import "./assets/sass/content.sass"
@import "./assets/sass/header.sass"
@import "./assets/sass/announcement.sass"
@import "./assets/sass/messages.sass"

html, body, #WandJ, #app
  width: 100%
  margin: 0px
  padding: 0px
  height: 100%
  position: relative
  font-family:'SentyTEA'
  color: #ffffff
  max-width: 100%
  &::-webkit-scrollbar
    width: 15px
    background-color: #2E3338
    border-radius: 20px
  &::-webkit-scrollbar-thumb
    background-color: #202225
    border-radius: 20px

#app
  overflow-y: hidden
#WandJ
  overflow-y: auto

#app:before
  background-image: url(./assets/background.jpg)
  background-size: cover
  opacity: 1
  height: 100%
  position: absolute
  left: 0
  right: 0
  content: ""


.schedule
  width: 180px
  height: 5px
  border-radius: 20px
  background-color: rgb(100,100,100)
  margin: 10px auto
  #len
    background-color: rgb(200,200,200)
    border-radius: 20px
    height: 5px

</style>
