<template>
  <div id="WandJ">

    <div class="header">
      <div class="title">
        W and J靠北網
      </div>

      <div class="announcement" @click="openAnnouncement()">公告</div>
    </div>

    <div class="content">
      <div class="add-paste" :style="divheigth">
        
        <textarea v-model="text" id="texts"
        placeholder="你遇到的W and J的英勇事蹟" @input="inputtext()"
        :style="textheigth"></textarea>

        <input v-model="title" placeholder="標題">

        <input placeholder="暱稱" v-model="author">

        <label class="btn btn-default btn-sm center-block btn-file file">
          <i class="fa fa-upload fa-2x" aria-hidden="true"></i>
          <input type="file" style="display: none;" accept="image/png, image/jpeg">
        </label>
        <div class="button-container-3">
          <span class="mas">發文</span>
          <button type="button" name="Hover" @click="post">發文</button>
        </div>

        <div class="paste-q">目前{{number}}篇文章</div>

      </div>

      <div class="pastes">
        <div class="paste" v-for="i in pastes" :key="i">
          <div class="title">{{i.Title}}</div>

          <div class="contenttext">

              {{i.Content}}

          </div>

          <div class="contentimg" v-if="i.File !== null">
            <img  :src="'/img/'+i.File">
          </div>
          
          <div class="author">
            作者:{{i.Author}}
            <br/>
            <br/>
            時間:{{new Date(Number(i.Time)).toTimeString()}}
          </div>
          <div class="options">
            
            <div class="leave_comments">
              <div class="text">
                留言
              </div>
            </div>

            <div :class="(!likes.includes(i.Id)) ? 'like tooltip-test': 'like1 tooltip-test'" @click="like(i.Id)" 
             data-toggle="tooltip" :title="`<h5>${i.Likenumber}個讚</h5>`">
              <div class="heart">
                <div class="heart1"></div>
                <div class="heart2"></div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

    <div id="schedule" :style="scheduleswitch">
      <div id="len" :style="schedulelen"></div>
    </div>

    <div class="announcement-content" v-if="announcement" @click="closeAnnouncement()" :style="announcementde">
      <div id="content">

        <div class="title">
          公告
        </div>

        <div id="text">
          <div v-for="i in announcementText.split('\n')" :key="i">
            {{i}}
            <br/>
          </div>
        </div>

      </div>
    </div>

    <leave_comments></leave_comments>
  </div>
</template>

<script>
import main from "./assets/main.js"
export default main


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

html,body,#WandJ,#app
  width: 100%
  margin : 0px
  padding : 0px
  background-color : #131415
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
#schedule
  position: fixed

</style>