<script setup>
const props = defineProps({
  task: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete', 'drag-start'])

const priorityMap = {
  high: { label: '高', bar: 'bg-[#c5362b]', chip: 'text-[#c5362b] bg-[#c5362b]/10' },
  medium: { label: '中', bar: 'bg-[#d4a017]', chip: 'text-[#b8860b] bg-[#d4a017]/12' },
  low: { label: '低', bar: 'bg-[#3d8b5c]', chip: 'text-[#3d8b5c] bg-[#3d8b5c]/10' },
}

function onDragStart(event) {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', props.task.id)
  emit('drag-start', props.task.id)
}
</script>

<template>
  <article
    draggable="true"
    class="group relative cursor-grab rounded-xl border border-[#eadcc6] bg-[#fffdf8] p-3.5 shadow-[0_1px_0_rgba(42,33,24,0.04)] transition active:cursor-grabbing hover:-translate-y-0.5 hover:border-[#d2b48c] dark:border-[#3d342b] dark:bg-[#241f1a] dark:hover:border-[#5a4c3c]"
    @dragstart="onDragStart"
  >
    <span
      class="absolute inset-y-0 left-0 w-1 rounded-l-xl"
      :class="priorityMap[task.priority].bar"
      aria-hidden="true"
    />

    <div class="pl-2">
      <div class="mb-2 flex items-start justify-between gap-2">
        <h3 class="text-[15px] leading-snug font-semibold text-[#2a2118] dark:text-[#f3e8d7]">
          {{ task.title }}
        </h3>
        <span
          class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
          :class="priorityMap[task.priority].chip"
        >
          {{ priorityMap[task.priority].label }}
        </span>
      </div>

      <p
        v-if="task.description"
        class="mb-3 line-clamp-3 text-sm leading-relaxed text-[#6b5d4d] dark:text-[#cbbba6]"
      >
        {{ task.description }}
      </p>

      <div class="flex items-center gap-3 text-xs font-medium">
        <button
          type="button"
          class="text-[#8a7a66] hover:text-[#c45c26] dark:hover:text-[#e07a3d]"
          @click="emit('edit', task)"
        >
          编辑
        </button>
        <button
          type="button"
          class="text-[#8a7a66] hover:text-[#c5362b]"
          @click="emit('delete', task.id)"
        >
          删除
        </button>
      </div>
    </div>
  </article>
</template>
