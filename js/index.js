// Vue.config.devtools = true;     // Vue Devtoolsのタブ表示されないため追加

Vue.component('chat-title', {
  template: '<h1>VueChat</h1>',
})

Vue.component('chat-list', {
  props: ['name', 'message', 'date'],
  template: '<li> {{ message }} {{ name }} {{ date }}</li>'
})

Vue.component('chat-form', {
  props: ['message', 'name'],
  template: '<div>名前: <input v-model="name"> コメント:<textarea v-model="message"></textarea><button @click="onSubmit">送信</button></div>',
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
  },
  methods: {
    listAdd: function(name, message){
      var nowDate = new Date();
      firebase.database().ref('chat').push({
      // this.lists.push({
        name: name,
        message: message,
        date: nowDate.getMonth() + 1 + '/' + nowDate.getDate() + ' ' + nowDate.getHours().toString().padStart(2, '0') + ':' + nowDate.getMinutes().toString().padStart(2, '0')
      })
    },
    listen: function(){
      var vue = this;
      firebase.database().ref('chat').on('value', function(chat) {
        vue.lists = chat.val();
        // if (chat) {
        //   const rootList = chat.val();
        //   let listenList = [];
        //   Object.keys(rootList).forEach((val, key) => {
        //     rootList[val].id = val;
        //     listenList.push(rootList[val]);
        //   });
        //   vue.lists = listenList;
        // }
      });
    }
  }
})