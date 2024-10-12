<template>
  <div class="modal" @click.self="$emit('cancel')" role="dialog" aria-labelledby="edit-modal-title">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="edit-modal-title" class="prompt-title">Edit Prompt</h2>
        <button class="close-modal" @click="$emit('cancel')" aria-label="Close edit modal">&times;</button>
      </div>
      <div class="prompt-divider"></div>
      <div class="edit-form">
        <input v-model="editedPrompt.title" aria-label="Edit prompt title" placeholder="Prompt Title">
        <textarea v-model="editedPrompt.content" aria-label="Edit prompt content"
          placeholder="Prompt Content"></textarea>
        <div class="prompt-actions">
          <button @click="saveEdit" aria-label="Save edited prompt">SAVE</button>
          <button @click="$emit('cancel')" aria-label="Cancel editing">CANCEL</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue';

export default {
  name: 'EditPromptModal',
  props: {
    prompt: {
      type: Object,
      required: true
    }
  },
  emits: ['save', 'cancel', 'show-toast'],
  setup(props, { emit }) {
    const editedPrompt = ref({ ...props.prompt });

    watchEffect(() => {
      editedPrompt.value = { ...props.prompt };
    });

    function saveEdit() {
      if (editedPrompt.value.title.trim() && editedPrompt.value.content.trim()) {
        emit('save', editedPrompt.value);
      } else {
        emit('show-toast', 'Please fill in both title and content fields', 'error');
      }
    }

    return {
      editedPrompt,
      saveEdit
    };
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
}

.prompt-title {
  font-size: 1.2em;
  font-weight: 700;
  color: #000000;
  margin: 0;
  line-height: 1.2;
}

.close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  color: #666666;
}

.prompt-divider {
  width: 33%;
  height: 2px;
  background-color: #ff4136;
  margin: 0px 0px 15px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9em;
  color: #333;
  background-color: #e5e5e5;
}

textarea {
  min-height: 350px;
  resize: vertical;
  line-height: 1.2;
}

.prompt-actions {
  display: flex;
  justify-content: flex-end;
  align-self: flex-end;
  min-width: 250px;
  gap: 1rem;
  margin-top: 0;
}

.prompt-actions button {
  margin: 0;
}

button {
  padding: 0.5rem 1rem;
  background-color: #ff4136;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 700;
}

button:hover {
  background-color: #ff5252;
}

button:last-child {
  background-color: #ccc;
  color: #333;
}

button:last-child:hover {
  background-color: #bbb;
}
</style>
