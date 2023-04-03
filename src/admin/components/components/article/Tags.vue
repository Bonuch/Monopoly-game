<template>
  <v-combobox
    v-model="model"
    :filter="filter"
    :hide-no-data="!search"
    :items="items"
    :search-input.sync="search"
    hide-selected
    :label="label"
    multiple
    small-chips
    class="tags"
  >
    <template v-slot:no-data>
      <v-list-item>
        <span class="subheading">Create: &nbsp; </span>
        <v-chip
          color="purple"
          label
          small
        >
          {{ search }}
        </v-chip>
        &nbsp;
        <em><small>(Нажмите Enter)</small></em>
      </v-list-item>
    </template>
    <template v-slot:selection="{ attrs, item, parent, selected }">
      <v-chip
        v-if="item === String(item)"
        v-bind="attrs"
        :color="randomColor()"
        :input-value="selected"
        label
        small
        dark
      >
        <span class="pr-2">
          {{ item }}
        </span>
        <v-icon
          small
          @click="parent.selectItem(item)"
        >
          fa-close
        </v-icon>
      </v-chip>
    </template>
    <!-- <template v-slot:item="{ index, item }">
      <v-text-field
        v-if="editing === item"
        v-model="editing"
        autofocus
        flat
        background-color="transparent"
        hide-details
        solo
        @keyup.enter="edit(index, item)"
      ></v-text-field>
      <v-chip
        v-else
        color="indigo"
        dark
        label
        small
      >
        {{ item }}
      </v-chip>
      <v-spacer></v-spacer>
      <v-list-item-action @click.stop>
        <v-btn
          icon
          @click.stop.prevent="edit(index, item)"
        >
          <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
        </v-btn>
      </v-list-item-action>
    </template> -->
  </v-combobox>
</template>

<script>
  export default {
    props: {
      value: {
        type: Array,
        required: true
      },
      label: {
        type: String,
        default: 'Теги'
      },
      tags: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      activator: null,
      attach: null,
      colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
      editing: null,
      editingIndex: -1,
      items: [
        { header: 'Выберите тег или создайте новый (Enter)' },
      ],
      menu: false,
      model: [
        'Foo',
      ],
      x: 0,
      search: null,
      y: 0,
    }),

    watch: {
      model (val, prev) {
        if (val.length === prev.length) return

        this.model = val.map(v => {
          if (typeof v === 'string') {

            this.items.push(v)

          }

          return v
        })
        this.$emit('input', this.model)
      },
    },

    methods: {
      edit (index, item) {
        if (!this.editing) {
          this.editing = item
          this.editingIndex = index
        } else {
          this.editing = null
          this.editingIndex = -1
        }
      },
      filter (item, queryText, itemText) {
        if (item.header) return false

        const hasValue = val => val != null ? val : ''

        const text = hasValue(itemText)
        const query = hasValue(queryText)

        return text.toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      },
      randomColor() {
        return this.colors[Math.ceil(Math.random() * this.colors.length) - 1]
      }
    },
    mounted() {
      this.model = this.value
      this.items = [{ header: 'Выберите тег или создайте новый (Enter)' }].concat(this.tags)
    }
  }
</script>

<style>
  .tags .v-label.v-label--active {
    top: 0;
  }
</style>