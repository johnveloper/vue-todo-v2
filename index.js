let app = new Vue({
  el: '#app',
  data: {
    text: '',
    items: [],
    modals: {
      settings: false,
      help: false,      
    },
    settings: {
      moveToBottom: true,
      moveToTop: true,
      inputRounded: false,
      itemsRounded: false
    },
    timeout: null
  },
  methods: {
    addItem: function() {
      if (this.text.length > 0) {
        this.items.unshift({
          id: Date.now(),
          text: this.text,
          done: false
        });
      }
      this.text = '';
    },
    handleItemTap: function(id, event) {
      const index = this.findIndexOfItemWithId(id);
      if (event.shiftKey) {
        this.removeItemAt(index);
      } else {
        let item = this.toggleItemAt(index);
        if (item.done && this.settings.moveToBottom) {
          this.items.push(this.items.splice(index, 1)[0]);
        } else if (!item.done && this.settings.moveToTop) {
          this.items.unshift(this.items.splice(index, 1)[0]);
        }
      }
    },
    findIndexOfItemWithId: function(id) {
      return this.items.findIndex(
        function(item) { return item.id == id; }
      );
    },
    toggleItemAt: function(index) {
      let item = this.items[index];
      item.done = !item.done;
      return item;
    },
    removeItemAt: function(index) {
      this.items.splice(index, 1);
    },
    toggleModal: function(modal) {
      this.modals[modal] = !this.modals[modal];
    },
    toggleSetting: function(setting) {
      this.settings[setting] = !this.settings[setting];
    },
    setTheme: function(color) {
      document.body.style.backgroundColor = color;
    },
    handleItemTouchStart: function(id) {
      this.timeout = setTimeout(function() {
        app.removeItemAt(app.findIndexOfItemWithId(id));
      }, 500);
    },
    handleItemTouchEnd: function() {
      clearTimeout(this.timeout);
    }
  }
});