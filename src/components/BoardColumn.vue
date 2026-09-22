<script setup>
import TaskCard from './TaskCard.vue'

defineProps({
  status: { type: String, required: true },
  title: { type: String, required: true },
  hint: { type: String, required: true },
  tasks: { type: Array, default: () => [] },
  isActive: { type: Boolean, default: false },
})

const emit = defineEmits(['drop-task', 'edit', 'delete', 'drag-start', 'drag-over', 'drag-leave'])

function onDragOver(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  emit('drag-over')
}

function onDrop(event) {
  event.preventDefault()
  const id = event.dataTransfer.getData('text/plain')
  if (id) emit('drop-task', id)
}
</script>

<template>
  <section
    class="flex min-h-[420px] flex-col rounded-2xl border p-3 transition sm:min-h-[560px]"
    :class="
      isActive
        ? 'border-[#c45c26] bg-[#c45c26]/8 dark:border-[#e07a3d] dark:bg-[#e07a3d]/10'
        : 'border-[#e4d6be] bg-[#fff8ec]/80 dark:border-[#3d342b] dark:bg-[#1a1612]/80'
    "
    @dragover="onDragOver"
    @dragleave="emit('drag-leave')"
    @drop="onDrop"
  >
    <header class="mb-3 flex items-end justify-between px-1">
      <div>
        <h2 class="font-display text-xl text-[#2a2118] dark:text-[#f3e8d7]">{{ title }}</h2>
        <p class="mt-0.5 text-xs text-[#8a7a66]">{{ hint }}</p>
      </div>
      <span
        class="rounded-full bg-[#efe6d6] px-2 py-0.5 text-xs font-semibold text-[#6b5d4d] dark:bg-[#2a241e] dark:text-[#cbbba6]"
      >
        {{ tasks.length }}
      </span>
    </header>

    <div class="flex flex-1 flex-col gap-2.5">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @drag-start="emit('drag-start', $event)"
      />

      <p
        v-if="!tasks.length"
        class="rounded-xl border border-dashed border-[#d8c9b0] px-3 py-8 text-center text-sm text-[#8a7a66] dark:border-[#4a3f34]"
      >
        这一列还没有任务
      </p>
    </div>
  </section>
</template>
