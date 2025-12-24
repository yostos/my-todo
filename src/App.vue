<template>
  <div class="container">
    <h1>TODO アプリ</h1>

    <!-- 入力フォーム -->
    <div class="input-section">
      <input
        v-model="newTodoText"
        type="text"
        placeholder="新しいTODOを入力..."
        class="todo-input"
        @keyup.enter="addTodo"
      >
      <select
        v-model="newTodoPriority"
        class="priority-select"
      >
        <option value="low">
          低
        </option>
        <option
          value="medium"
          selected
        >
          中
        </option>
        <option value="high">
          高
        </option>
      </select>
      <button
        class="add-btn"
        @click="addTodo"
      >
        追加
      </button>
    </div>

    <!-- フィルタボタン -->
    <div class="filter-section">
      <button
        :class="{ active: filter === 'all' }"
        class="filter-btn"
        @click="filter = 'all'"
      >
        全て ({{ todos.length }})
      </button>
      <button
        :class="{ active: filter === 'active' }"
        class="filter-btn"
        @click="filter = 'active'"
      >
        未完了 ({{ activeTodosCount }})
      </button>
      <button
        :class="{ active: filter === 'completed' }"
        class="filter-btn"
        @click="filter = 'completed'"
      >
        完了済み ({{ completedTodosCount }})
      </button>
    </div>

    <!-- TODOリスト -->
    <div class="todo-list">
      <div
        v-for="todo in filteredTodos"
        :key="todo.id"
        :class="['todo-item', `priority-${todo.priority}`, { completed: todo.completed }]"
      >
        <input
          type="checkbox"
          :checked="todo.completed"
          class="todo-checkbox"
          @change="toggleComplete(todo.id)"
        >

        <div class="todo-content">
          <input
            v-if="editingId === todo.id"
            ref="editInput"
            v-model="editingText"
            class="edit-input"
            @keyup.enter="updateTodo(todo.id)"
            @keyup.esc="cancelEdit"
            @blur="updateTodo(todo.id)"
          >
          <span
            v-else
            class="todo-text"
            @dblclick="editTodo(todo)"
          >
            {{ todo.text }}
          </span>

          <span :class="['priority-badge', `priority-${todo.priority}`]">
            {{ priorityLabel(todo.priority) }}
          </span>
        </div>

        <div class="todo-actions">
          <select
            :value="todo.priority"
            class="priority-select-small"
            @change="setPriority(todo.id, $event.target.value)"
          >
            <option value="low">
              低
            </option>
            <option value="medium">
              中
            </option>
            <option value="high">
              高
            </option>
          </select>
          <button
            v-if="editingId !== todo.id"
            class="edit-btn"
            @click="editTodo(todo)"
          >
            編集
          </button>
          <button
            class="delete-btn"
            @click="deleteTodo(todo.id)"
          >
            削除
          </button>
        </div>
      </div>

      <div
        v-if="filteredTodos.length === 0"
        class="empty-state"
      >
        <p v-if="filter === 'all'">
          TODOがありません。新しいTODOを追加してください。
        </p>
        <p v-else-if="filter === 'active'">
          未完了のTODOがありません。
        </p>
        <p v-else>
          完了済みのTODOがありません。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      todos: [],
      newTodoText: '',
      newTodoPriority: 'medium',
      filter: 'all',
      editingId: null,
      editingText: ''
    }
  },
  computed: {
    filteredTodos() {
      switch (this.filter) {
        case 'active':
          return this.todos.filter(todo => !todo.completed)
        case 'completed':
          return this.todos.filter(todo => todo.completed)
        default:
          return this.todos
      }
    },
    activeTodosCount() {
      return this.todos.filter(todo => !todo.completed).length
    },
    completedTodosCount() {
      return this.todos.filter(todo => todo.completed).length
    }
  },
  mounted() {
    this.loadFromLocalStorage()
  },
  methods: {
    addTodo() {
      const text = this.newTodoText.trim()
      if (!text) return

      const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: this.newTodoPriority,
        createdAt: Date.now()
      }

      this.todos.push(todo)
      this.newTodoText = ''
      this.newTodoPriority = 'medium'
      this.saveToLocalStorage()
    },
    deleteTodo(id) {
      this.todos = this.todos.filter(todo => todo.id !== id)
      this.saveToLocalStorage()
    },
    toggleComplete(id) {
      const todo = this.todos.find(todo => todo.id === id)
      if (todo) {
        todo.completed = !todo.completed
        this.saveToLocalStorage()
      }
    },
    editTodo(todo) {
      this.editingId = todo.id
      this.editingText = todo.text
      this.$nextTick(() => {
        const inputs = this.$refs.editInput
        if (inputs) {
          const input = Array.isArray(inputs) ? inputs[0] : inputs
          if (input) input.focus()
        }
      })
    },
    updateTodo(id) {
      const text = this.editingText.trim()
      if (!text) {
        this.cancelEdit()
        return
      }

      const todo = this.todos.find(todo => todo.id === id)
      if (todo) {
        todo.text = text
        this.saveToLocalStorage()
      }
      this.cancelEdit()
    },
    cancelEdit() {
      this.editingId = null
      this.editingText = ''
    },
    setPriority(id, priority) {
      const todo = this.todos.find(todo => todo.id === id)
      if (todo) {
        todo.priority = priority
        this.saveToLocalStorage()
      }
    },
    priorityLabel(priority) {
      const labels = {
        high: '高',
        medium: '中',
        low: '低'
      }
      return labels[priority] || priority
    },
    saveToLocalStorage() {
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },
    loadFromLocalStorage() {
      const stored = localStorage.getItem('todos')
      if (stored) {
        try {
          this.todos = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to load todos from localStorage:', e)
          this.todos = []
        }
      }
    }
  }
}
</script>
