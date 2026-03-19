<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './utils/supabase'

const todos = ref([])

async function getTodos() {
  const { data, error } = await supabase.from('todos').select()
  if (error) {
    console.error('Error fetching todos:', error)
  } else {
    todos.value = data
  }
}

onMounted(() => {
  getTodos()
})
</script>

<template>
  <div class="todo-container">
    <h1>Todo List</h1>
    <ul v-if="todos.length > 0">
      <li v-for="todo in todos" :key="todo.id">{{ todo.name }}</li>
    </ul>
    <p v-else>No todos found or loading...</p>
  </div>
</template>

<style scoped>
.todo-container {
  padding: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 8px;
  border-bottom: 1px solid #eee;
}
</style>
