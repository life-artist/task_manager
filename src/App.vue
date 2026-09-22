<script setup>
import { ref } from 'vue'
import BoardColumn from './components/BoardColumn.vue'
import TaskForm from './components/TaskForm.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { useTasks } from './composables/useTasks'

const { tasks, addTask, updateTask, deleteTask, moveTask, tasksByStatus } = useTasks()

const columns = [
  { status: 'todo', title: '待办', hint: '准备开始的事' },
  { status: 'doing', title: '进行中', hint: '正在推进' },
  { status: 'done', title: '完成', hint: '已经放下' },
]

const formOpen = ref(false)
const editingTask = ref(null)
const activeStatus = ref('')

function openCreate() {
  editingTask.value = null
  formOpen.value = true
}

function openEdit(task) {
  editingTask.value = task
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  editingTask.value = null
}

function handleSubmit(payload) {
  const ok = editingTask.value
    ? updateTask(editingTask.value.id, payload)
    : addTask(payload)
  if (ok) closeForm()
}

function handleDelete(id) {
  if (window.confirm('确定删除这条任务？')) {
    deleteTask(id)
  }
}

function handleDrop(id, status) {
  moveTask(id, status)
  activeStatus.value = ''
}

function handleDragEnd() {
  activeStatus.value = ''
}
</script>

<template>
  <div
    class="min-h-screen bg-[#efe6d6] text-[#2a2118] dark:bg-[#14110e] dark:text-[#f3e8d7]"
    @dragend="handleDragEnd"
  >
    <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header class="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs font-medium tracking-[0.22em] text-[#a8895d] uppercase">
            Personal Board
          </p>
          <h1 class="font-display mt-1 text-4xl tracking-tight sm:text-5xl">任务看板</h1>
        </div>

        <div class="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            class="rounded-full bg-[#c45c26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a84c1d] dark:bg-[#e07a3d] dark:hover:bg-[#c45c26]"
            @click="openCreate"
          >
            新建任务
          </button>
        </div>
      </header>

      <p class="mb-3 text-sm text-[#8a7a66]">
        共 {{ tasks.length }} 条任务 · 拖到另一列即可改状态
      </p>

      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <BoardColumn
          v-for="column in columns"
          :key="column.status"
          :status="column.status"
          :title="column.title"
          :hint="column.hint"
          :tasks="tasksByStatus(column.status)"
          :is-active="activeStatus === column.status"
          @drag-over="activeStatus = column.status"
          @drag-leave="activeStatus = ''"
          @drop-task="handleDrop($event, column.status)"
          @edit="openEdit"
          @delete="handleDelete"
        />
      </div>
    </div>

    <TaskForm
      :open="formOpen"
      :task="editingTask"
      @close="closeForm"
      @submit="handleSubmit"
    />
  </div>
</template>
