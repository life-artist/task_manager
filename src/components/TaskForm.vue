<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  task: { type: Object, default: null },
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
})

const error = reactive({ title: '' })

const isEditing = computed(() => Boolean(props.task))
const heading = computed(() => (isEditing.value ? '编辑任务' : '新建任务'))

watch(
  () => [props.open, props.task],
  () => {
    if (!props.open) return
    form.title = props.task?.title ?? ''
    form.description = props.task?.description ?? ''
    form.priority = props.task?.priority ?? 'medium'
    error.title = ''
  },
)

function close() {
  emit('close')
}

function submit() {
  if (!form.title.trim()) {
    error.title = '请填写标题'
    return
  }

  emit('submit', {
    title: form.title,
    description: form.description,
    priority: form.priority,
  })
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-40 flex items-end justify-center bg-[#2a2118]/45 p-4 backdrop-blur-[2px] sm:items-center dark:bg-black/55"
      @click.self="close"
    >
      <section
        class="w-full max-w-lg rounded-2xl border border-[#e4d6be] bg-[#fff8ec] p-5 shadow-[0_20px_50px_rgba(42,33,24,0.18)] dark:border-[#3d342b] dark:bg-[#1f1b16] dark:shadow-black/40"
        role="dialog"
        aria-modal="true"
        :aria-label="heading"
      >
        <header class="mb-5 flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-medium tracking-[0.18em] text-[#a8895d] uppercase">
              {{ isEditing ? 'Edit' : 'New' }}
            </p>
            <h2 class="font-display mt-1 text-2xl text-[#2a2118] dark:text-[#f3e8d7]">
              {{ heading }}
            </h2>
          </div>
          <button
            type="button"
            class="rounded-full px-2 text-lg leading-none text-[#8a7a66] hover:text-[#2a2118] dark:hover:text-[#f3e8d7]"
            aria-label="关闭"
            @click="close"
          >
            ×
          </button>
        </header>

        <form class="space-y-4" @submit.prevent="submit">
          <label class="block">
            <span class="mb-1.5 block text-sm font-medium">标题 <span class="text-[#c5362b]">*</span></span>
            <input
              v-model="form.title"
              type="text"
              maxlength="80"
              placeholder="例如：整理本周待办"
              class="w-full rounded-xl border bg-[#fffdf8] px-3 py-2.5 outline-none transition dark:bg-[#16130f]"
              :class="
                error.title
                  ? 'border-[#c5362b] focus:border-[#c5362b]'
                  : 'border-[#e4d6be] focus:border-[#c45c26] dark:border-[#3d342b] dark:focus:border-[#e07a3d]'
              "
              @input="error.title = ''"
            />
            <p v-if="error.title" class="mt-1 text-sm text-[#c5362b]">{{ error.title }}</p>
          </label>

          <label class="block">
            <span class="mb-1.5 block text-sm font-medium">描述 <span class="text-[#8a7a66] font-normal">选填</span></span>
            <textarea
              v-model="form.description"
              rows="4"
              maxlength="400"
              placeholder="补充一点上下文，也可以留空"
              class="w-full resize-none rounded-xl border border-[#e4d6be] bg-[#fffdf8] px-3 py-2.5 outline-none focus:border-[#c45c26] dark:border-[#3d342b] dark:bg-[#16130f] dark:focus:border-[#e07a3d]"
            />
          </label>

          <fieldset>
            <legend class="mb-2 text-sm font-medium">优先级</legend>
            <div class="grid grid-cols-3 gap-2">
              <label
                class="flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition"
                :class="
                  form.priority === 'high'
                    ? 'border-[#c5362b] bg-[#c5362b]/10 text-[#c5362b]'
                    : 'border-[#e4d6be] text-[#6b5d4d] dark:border-[#3d342b] dark:text-[#cbbba6]'
                "
              >
                <input v-model="form.priority" type="radio" value="high" class="sr-only" />
                <span class="h-2 w-2 rounded-full bg-[#c5362b]" />
                高
              </label>
              <label
                class="flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition"
                :class="
                  form.priority === 'medium'
                    ? 'border-[#d4a017] bg-[#d4a017]/10 text-[#b8860b]'
                    : 'border-[#e4d6be] text-[#6b5d4d] dark:border-[#3d342b] dark:text-[#cbbba6]'
                "
              >
                <input v-model="form.priority" type="radio" value="medium" class="sr-only" />
                <span class="h-2 w-2 rounded-full bg-[#d4a017]" />
                中
              </label>
              <label
                class="flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition"
                :class="
                  form.priority === 'low'
                    ? 'border-[#3d8b5c] bg-[#3d8b5c]/10 text-[#3d8b5c]'
                    : 'border-[#e4d6be] text-[#6b5d4d] dark:border-[#3d342b] dark:text-[#cbbba6]'
                "
              >
                <input v-model="form.priority" type="radio" value="low" class="sr-only" />
                <span class="h-2 w-2 rounded-full bg-[#3d8b5c]" />
                低
              </label>
            </div>
          </fieldset>

          <footer class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              class="rounded-xl px-4 py-2 text-sm font-medium text-[#6b5d4d] hover:bg-[#efe6d6] dark:text-[#cbbba6] dark:hover:bg-[#2a241e]"
              @click="close"
            >
              取消
            </button>
            <button
              type="submit"
              class="rounded-xl bg-[#c45c26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a84c1d] dark:bg-[#e07a3d] dark:hover:bg-[#c45c26]"
            >
              保存
            </button>
          </footer>
        </form>
      </section>
    </div>
  </Teleport>
</template>
