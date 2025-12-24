import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App.vue', () => {
  let wrapper

  beforeEach(() => {
    localStorage.clear()
    wrapper = mount(App)
  })

  describe('TODO追加', () => {
    it('新しいTODOを追加できる', async () => {
      const input = wrapper.find('.todo-input')
      const button = wrapper.find('.add-btn')

      await input.setValue('テストTODO')
      await button.trigger('click')

      expect(wrapper.vm.todos).toHaveLength(1)
      expect(wrapper.vm.todos[0].text).toBe('テストTODO')
      expect(wrapper.vm.todos[0].completed).toBe(false)
      expect(wrapper.vm.todos[0].priority).toBe('medium')
    })

    it('空のTODOは追加されない', async () => {
      const input = wrapper.find('.todo-input')
      const button = wrapper.find('.add-btn')

      await input.setValue('   ')
      await button.trigger('click')

      expect(wrapper.vm.todos).toHaveLength(0)
    })

    it('優先度を設定してTODOを追加できる', async () => {
      const input = wrapper.find('.todo-input')
      const select = wrapper.find('.priority-select')
      const button = wrapper.find('.add-btn')

      await input.setValue('高優先度タスク')
      await select.setValue('high')
      await button.trigger('click')

      expect(wrapper.vm.todos[0].priority).toBe('high')
    })

    it('TODO追加後、入力フィールドがクリアされる', async () => {
      const input = wrapper.find('.todo-input')
      const button = wrapper.find('.add-btn')

      await input.setValue('テストTODO')
      await button.trigger('click')

      expect(wrapper.vm.newTodoText).toBe('')
      expect(wrapper.vm.newTodoPriority).toBe('medium')
    })
  })

  describe('TODO削除', () => {
    it('TODOを削除できる', async () => {
      wrapper.vm.todos = [
        { id: 1, text: 'TODO 1', completed: false, priority: 'medium' }
      ]
      await wrapper.vm.$nextTick()

      wrapper.vm.deleteTodo(1)

      expect(wrapper.vm.todos).toHaveLength(0)
    })
  })

  describe('TODO完了切り替え', () => {
    it('TODOの完了状態を切り替えられる', async () => {
      wrapper.vm.todos = [
        { id: 1, text: 'TODO 1', completed: false, priority: 'medium' }
      ]
      await wrapper.vm.$nextTick()

      wrapper.vm.toggleComplete(1)
      expect(wrapper.vm.todos[0].completed).toBe(true)

      wrapper.vm.toggleComplete(1)
      expect(wrapper.vm.todos[0].completed).toBe(false)
    })
  })

  describe('TODO編集', () => {
    it('TODOを編集できる', async () => {
      wrapper.vm.todos = [
        { id: 1, text: 'TODO 1', completed: false, priority: 'medium' }
      ]
      await wrapper.vm.$nextTick()

      wrapper.vm.editTodo(wrapper.vm.todos[0])
      expect(wrapper.vm.editingId).toBe(1)
      expect(wrapper.vm.editingText).toBe('TODO 1')

      wrapper.vm.editingText = '編集後のTODO'
      wrapper.vm.updateTodo(1)

      expect(wrapper.vm.todos[0].text).toBe('編集後のTODO')
      expect(wrapper.vm.editingId).toBe(null)
    })

    it('空の編集内容では更新されない', async () => {
      wrapper.vm.todos = [
        { id: 1, text: 'TODO 1', completed: false, priority: 'medium' }
      ]
      await wrapper.vm.$nextTick()

      wrapper.vm.editTodo(wrapper.vm.todos[0])
      wrapper.vm.editingText = '   '
      wrapper.vm.updateTodo(1)

      expect(wrapper.vm.todos[0].text).toBe('TODO 1')
      expect(wrapper.vm.editingId).toBe(null)
    })
  })

  describe('優先度設定', () => {
    it('TODOの優先度を変更できる', async () => {
      wrapper.vm.todos = [
        { id: 1, text: 'TODO 1', completed: false, priority: 'medium' }
      ]
      await wrapper.vm.$nextTick()

      wrapper.vm.setPriority(1, 'high')

      expect(wrapper.vm.todos[0].priority).toBe('high')
    })
  })

  describe('フィルタリング', () => {
    beforeEach(() => {
      wrapper.vm.todos = [
        { id: 1, text: 'TODO 1', completed: false, priority: 'medium' },
        { id: 2, text: 'TODO 2', completed: true, priority: 'high' },
        { id: 3, text: 'TODO 3', completed: false, priority: 'low' }
      ]
    })

    it('全てのTODOを表示できる', async () => {
      wrapper.vm.filter = 'all'
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.filteredTodos).toHaveLength(3)
    })

    it('未完了のTODOのみ表示できる', async () => {
      wrapper.vm.filter = 'active'
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.filteredTodos).toHaveLength(2)
      expect(wrapper.vm.filteredTodos.every(todo => !todo.completed)).toBe(true)
    })

    it('完了済みのTODOのみ表示できる', async () => {
      wrapper.vm.filter = 'completed'
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.filteredTodos).toHaveLength(1)
      expect(wrapper.vm.filteredTodos.every(todo => todo.completed)).toBe(true)
    })
  })

  describe('カウント', () => {
    beforeEach(() => {
      wrapper.vm.todos = [
        { id: 1, text: 'TODO 1', completed: false, priority: 'medium' },
        { id: 2, text: 'TODO 2', completed: true, priority: 'high' },
        { id: 3, text: 'TODO 3', completed: false, priority: 'low' }
      ]
    })

    it('未完了TODOの数をカウントできる', () => {
      expect(wrapper.vm.activeTodosCount).toBe(2)
    })

    it('完了済みTODOの数をカウントできる', () => {
      expect(wrapper.vm.completedTodosCount).toBe(1)
    })
  })

  describe('LocalStorage連携', () => {
    it('TODOをLocalStorageに保存できる', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

      wrapper.vm.todos = [
        { id: 1, text: 'TODO 1', completed: false, priority: 'medium' }
      ]
      wrapper.vm.saveToLocalStorage()

      expect(setItemSpy).toHaveBeenCalledWith('todos', JSON.stringify(wrapper.vm.todos))
    })

    it('LocalStorageからTODOを読み込める', () => {
      const testTodos = [
        { id: 1, text: 'TODO 1', completed: false, priority: 'medium' }
      ]
      localStorage.setItem('todos', JSON.stringify(testTodos))

      wrapper.vm.loadFromLocalStorage()

      expect(wrapper.vm.todos).toEqual(testTodos)
    })

    it('不正なデータの場合は空配列になる', () => {
      localStorage.setItem('todos', 'invalid json')
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      wrapper.vm.loadFromLocalStorage()

      expect(wrapper.vm.todos).toEqual([])
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('優先度ラベル', () => {
    it('優先度ラベルを正しく表示できる', () => {
      expect(wrapper.vm.priorityLabel('high')).toBe('高')
      expect(wrapper.vm.priorityLabel('medium')).toBe('中')
      expect(wrapper.vm.priorityLabel('low')).toBe('低')
    })
  })
})
