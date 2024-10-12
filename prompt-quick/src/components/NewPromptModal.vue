<template>
  <div class="modal" @click.self="$emit('close')" role="dialog" aria-labelledby="new-prompt-title">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="new-prompt-title">ADD NEW PROMPT</h2>
        <button class="close-modal" @click="$emit('close')" aria-label="Close modal">&times;</button>
      </div>
      <div class="prompt-form">
        <input v-model="title" placeholder="Enter prompt title" aria-label="Prompt title">
        <textarea v-model="content" placeholder="Enter prompt content" aria-label="Prompt content"></textarea>
        <button @click="addPrompt" aria-label="Add prompt">ADD PROMPT</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'NewPromptModal',
  emits: ['close', 'add-prompt', 'show-toast'],
  setup(props, { emit }) {
    const title = ref('');
    const content = ref('');

    function addPrompt() {
      if (title.value.trim() && content.value.trim()) {
        emit('add-prompt', { title: title.value.trim(), content: content.value.trim() });
        title.value = '';
        content.value = '';
        emit('close');
      } else {
        emit('show-toast', 'Please fill in both title and content fields', 'error');
      }
    }

    return {
      title,
      content,
      addPrompt
    };
  }
};
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.prompt-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0;
  padding: 0;
  box-shadow: none;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0;
}

textarea {
  min-height: 150px;
  resize: vertical;
}

button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0;
  width: 200px;
}

button:hover {
  background-color: #ff5252;
}
</style>