Vue.config.devtools = true;     // Vue Devtoolsのタブ表示されないため追加

Vue.component('chat-title', {
  template: '<h1 class="title">VueChat</h1>',
})

Vue.component('chat-list', {
  props: ['name', 'message', 'date', 'key'],
  template: '<li>{{ name }} {{ message }} {{ date }} <button @click="onDelete(key)">削除</button></li>',
  methods: {
    onDelete: function(key){
      this.$emit('del', key)
    }
  }
})

Vue.component('chat-form', {
  props: ['message', 'name'],
  template: '<div class="input"><input v-model="name" class="name" placeholder="名前..."><input v-model="message" class="message" placeholder="メッセージ..."><button @click="onSubmit" class="sendBtn">送信</button></div>',
  data: function() {
    return {
      message: '',
      name: ''
    }
  },
  methods: {
    onSubmit: function(){
      if (!this.name || !this.message) { return };
      this.$emit('sub', this.name, this.message);
      this.message =  '';
      this.name = '';
    }
  }
})

var chat = new Vue({
  el: '#chat',
  data: {
    lists: []
  },
  created: function(){
    this.listen();
    this.scrollBottom();
  },
  methods: {
    scrollBottom: function(){
      this.$nextTick(function() {
        window.scrollTo(0, document.body.clientHeight)
      })
    },
    listen: function(){
      var vue = this;
      firebase.database().ref('chat').limitToLast(20).on('value', function(chat) {
        vue.lists = chat.val();
      });
    },
    messageAdd: function(name, message){
      var nowDate = new Date();
      firebase.database().ref('chat').push({
        name: name,
        message: message,
        date: nowDate.getMonth() + 1 + '/' + nowDate.getDate() + ' ' + nowDate.getHours().toString().padStart(2, '0') + ':' + nowDate.getMinutes().toString().padStart(2, '0')
      });
      this.scrollBottom();
    },
    messageDelete: function(key){
      if(confirm('削除してもよろしいですか？')){
        firebase.database().ref('chat').child(key).remove();
        this.scrollBottom()
      }
    }
  }
})