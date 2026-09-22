import { ref, watch } from 'vue'

const STORAGE_KEY = 'task-manager.tasks'
const STATUSES = ['todo', 'doing', 'done']
const PRIORITY_RANK = { high: 0, medium: 1, low: 2 }

function compareByPriority(a, b) {
  return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (task) =>
        task &&
        typeof task.id === 'string' &&
        typeof task.title === 'string' &&
        STATUSES.includes(task.status) &&
        ['high', 'medium', 'low'].includes(task.priority),
    )
  } catch {
    return []
  }
}

const tasks = ref(loadTasks())

watch(
  tasks,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

export function useTasks() {
  function addTask({ title, description, priority }) {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return false

    tasks.value.push({
      id: crypto.randomUUID(),
      title: trimmedTitle,
      description: (description || '').trim(),
      status: 'todo',
      priority: priority || 'medium',
    })
    return true
  }

  function updateTask(id, { title, description, priority }) {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return false

    const task = tasks.value.find((item) => item.id === id)
    if (!task) return false

    task.title = trimmedTitle
    task.description = (description || '').trim()
    task.priority = priority
    return true
  }

  function deleteTask(id) {
    tasks.value = tasks.value.filter((item) => item.id !== id)
  }

  function moveTask(id, status) {
    if (!STATUSES.includes(status)) return
    const task = tasks.value.find((item) => item.id === id)
    if (!task || task.status === status) return
    task.status = status
  }

  function tasksByStatus(status) {
    return tasks.value
      .filter((item) => item.status === status)
      .slice()
      .sort(compareByPriority)
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    tasksByStatus,
  }
}
