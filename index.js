Vue.component('todo-input', {
  props: ['value', 'rounded'],
  template: `
    <input
      :value="value"
      @input="$emit('input', $event.target.value)"
      @keydown.enter="$emit('enter')" 
      class="Input"
      :class="{ 'Input--rounded': rounded }"
      placeholder="Type here..." 
      spellcheck="false"
      autocomplete="off"
      autofocus 
      novalidate
    >
  `
});

Vue.component('modal', {
  props: ['headerText', 'visible'],
  template: `
    <div class="Modal" v-if="visible" @click.self="$emit('close')">
      <div class="Modal-content">
        <div class="Modal-header">{{ headerText }}</div>
        <slot></slot>
      </div>
    </div>
  `
});

Vue.component('setting', {
  props: ['checked'],
  template: `
    <div class="Modal-row">
      <div 
        class="Modal-switch"
        :class="{ 'Modal-switch--active': checked }"
        @click="$emit('toggle')"
      ></div>
      <slot></slot>
    </div>
  `
});

Vue.component('todo-item', {
  props: ['done', 'rounded', 'shift'],
  template: `
    <div class="Item" :class="{ 
        'Item--done': done, 
        'Item--rounded': rounded,
        'Item--deletable': shift
      }"
      @click="$emit('click')"
      @touchstart="$emit('touchstart')"
      @touchend="$emit('touchend')"
    >
      <slot></slot>
    </div>
  `
});



let app = new Vue({
  el: '#app',
  data: {
    text: '',
    items: [],
    modals: {
      settings: false,
      help: false,
      confirmation: null
    },
    settings: {
      moveToBottom: {
        label: 'Move finished tasks to the bottom',
        state: false
      },
      moveToTop: {
        label: 'Move unfinished tasks to the top',
        state: false
      },
      inputRounded: {
        label: 'Rounded input corners',
        state: true
      },
      itemsRounded: {
        label: 'Rounded items corners',
        state: true
      },
    },
    timeout: null,
    shiftPressed: false
  },
  mounted: function() {
    window.addEventListener('keydown', function(event) {
      if (event.key == 'Shift') {
        app.shiftPressed = true;
      }
    }); 
    window.addEventListener('keyup', function(event) {
      if (event.key == 'Shift') {
        app.shiftPressed = false;
      }
    });
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
    handleItemTap: function(id) {
      const index = this.findIndexOfItemWithId(id);
      if (this.shiftPressed) {
        this.removeItemAt(index);
      } else {
        let item = this.toggleItemAt(index);
        if (item.done && this.settings.moveToBottom.state) {
          this.items.push(this.items.splice(index, 1)[0]);
        } else if (!item.done && this.settings.moveToTop.state) {
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
      this.settings[setting].state = !this.settings[setting].state;
    },
    setTheme: function(color) {
      document.body.style.backgroundColor = color;
    },
    handleItemTouchStart: function(id) {
      this.timeout = setTimeout(function() {
        app.modals.confirmation = id;
      }, 500);
    },
    confirmItemDeletion: function() {
      app.removeItemAt(app.findIndexOfItemWithId(app.modals.confirmation));
      app.modals.confirmation = null;
    },
    cancelItemDeletion: function() {
      app.modals.confirmation = null;
    },
    handleItemTouchEnd: function() {
      clearTimeout(this.timeout);
    },
    handleItemMouseOver: function(event) {
      event.target.style.backgroundColor = 'red';
    },
    handleItemShift: function(event) {
      alert(event);
      event.target.style.backgroundColor = 'red';
    },
    handleItemMouseLeave: function(event) {
      event.target.style.backgroundColor = 'rgba(0,0,0,0)';
    }
  }
});