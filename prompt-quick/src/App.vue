<template>
  <div id="app">
    <header>
      <h1>PROMPT MANAGEMENT</h1>
      <nav>
        <a href="#" @click.prevent="showAbout" aria-label="About">ABOUT</a>
        <a href="#" @click.prevent="showContact" aria-label="Contact">CONTACT</a>
      </nav>
    </header>
    <main>
      <section class="add-prompt-section">
        <button @click="openNewPromptModal" aria-label="Open new prompt modal">ADD NEW PROMPT</button>
      </section>
      <section class="prompts-list">
        <h2>SAVED PROMPTS</h2>
        <div v-if="hasPrompts" class="prompts-grid">
          <PromptCard v-for="prompt in prompts" :key="prompt.id" :title="prompt.title" :content="prompt.content"
            :views="prompt.views" :likes="prompt.likes" :comments="prompt.comments" :date="prompt.date"
            @click="openModal(prompt)" />
        </div>
        <p class="note" v-else>No prompts saved yet. Add a new prompt to get started!</p>
      </section>
    </main>

    <NewPromptModal v-if="showNewPromptModal" @close="showNewPromptModal = false" @add-prompt="addPrompt"
      @show-toast="showToast" />

    <PromptViewModal v-if="selectedPrompt" :prompt="selectedPrompt" :show-menu="showMenu" @close="closeModal"
      @toggle-menu="toggleMenu" />

    <EditPromptModal v-if="editingPrompt" :prompt="editingPrompt" @save="saveEditedPrompt" @cancel="cancelEditing" />

    <ActionMenu v-if="showMenu" :style="menuPosition" @edit="editPrompt" @fork="forkPrompt" @copy="copyPrompt"
      @delete="deletePrompt" />

    <ToastNotification v-if="toast.show" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import PromptCard from './components/PromptCard.vue';
import NewPromptModal from './components/NewPromptModal.vue';
import PromptViewModal from './components/PromptViewModal.vue';
import EditPromptModal from './components/EditPromptModal.vue';
import ActionMenu from './components/ActionMenu.vue';
import ToastNotification from './components/ToastNotification.vue';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'App',
  components: {
    PromptCard,
    NewPromptModal,
    PromptViewModal,
    EditPromptModal,
    ActionMenu,
    ToastNotification
  },
  setup() {
    const prompts = ref([]);
    const selectedPrompt = ref(null);
    const editingPrompt = ref(null);
    const showMenu = ref(false);
    const showNewPromptModal = ref(false);
    const toast = ref({ show: false, message: '', type: '' });
    const menuPosition = ref({ top: '0px', left: '0px' });

    const hasPrompts = computed(() => prompts.value.length > 0);

    onMounted(() => {
      loadPrompts();
      window.addEventListener('keydown', handleKeydown);
      document.addEventListener('click', handleOutsideClick);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('click', handleOutsideClick);
    });

    watch(showMenu, (newValue) => {
      if (newValue) {
        document.addEventListener('click', handleOutsideClick);
      } else {
        document.removeEventListener('click', handleOutsideClick);
      }
    });

    function handleOutsideClick(event) {
      const menu = document.querySelector('.action-menu');
      const menuButton = document.querySelector('.menu-button');
      if (menu && !menu.contains(event.target) && !menuButton.contains(event.target)) {
        showMenu.value = false;
      }
    }

    function loadPrompts() {
      const savedPrompts = localStorage.getItem('prompts');
      if (savedPrompts) {
        prompts.value = JSON.parse(savedPrompts).map(prompt => ({
          ...prompt,
          date: prompt.date ? new Date(prompt.date).toISOString() : new Date().toISOString()
        }));
        savePrompts();
      }
    }

    function savePrompts() {
      localStorage.setItem('prompts', JSON.stringify(prompts.value));
    }

    function openNewPromptModal() {
      showNewPromptModal.value = true;
    }

    function addPrompt(newPrompt) {
      const prompt = {
        id: uuidv4(),
        ...newPrompt,
        date: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments: 0
      };
      prompts.value.push(prompt);
      savePrompts();
      showToast('Prompt added successfully', 'success');
    }

    function openModal(prompt) {
      selectedPrompt.value = prompt;
      prompt.views++;
      savePrompts();
    }

    function closeModal() {
      selectedPrompt.value = null;
      showMenu.value = false;
    }

    function toggleMenu(event) {
      event.stopPropagation();
      showMenu.value = !showMenu.value;
      if (showMenu.value) {
        const rect = event.target.getBoundingClientRect();
        menuPosition.value = {
          top: `${rect.bottom + window.scrollY}px`,
          left: `${rect.right - 150}px`, // Adjust the menu to align with the right side of the button
          minWidth: '150px', // Set a minimum width for the menu
        };
      }
    }

    function editPrompt() {
      editingPrompt.value = { ...selectedPrompt.value };
      showMenu.value = false;
    }

    function saveEditedPrompt(editedPrompt) {
      const index = prompts.value.findIndex(p => p.id === editedPrompt.id);
      if (index !== -1) {
        prompts.value[index] = { ...editedPrompt };
        savePrompts();
        selectedPrompt.value = { ...editedPrompt }; // Update the selected prompt
        editingPrompt.value = null; // Close the edit modal
        showToast('Prompt updated successfully', 'success');
      }
    }

    function cancelEditing() {
      editingPrompt.value = null;
    }

    function forkPrompt() {
      const forkedPrompt = {
        ...selectedPrompt.value,
        id: uuidv4(),
        title: `Fork of ${selectedPrompt.value.title}`,
        date: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments: 0
      };
      prompts.value.push(forkedPrompt);
      savePrompts();
      showMenu.value = false;
      showToast('Prompt forked successfully', 'success');
    }

    function copyPrompt() {
      navigator.clipboard.writeText(selectedPrompt.value.content)
        .then(() => {
          showToast('Prompt copied to clipboard', 'success');
        })
        .catch(() => {
          showToast('Failed to copy prompt', 'error');
        });
      showMenu.value = false;
    }

    function deletePrompt() {
      const index = prompts.value.findIndex(p => p.id === selectedPrompt.value.id);
      if (index !== -1) {
        prompts.value.splice(index, 1);
        savePrompts();
        selectedPrompt.value = null;
        showMenu.value = false;
        showToast('Prompt deleted successfully', 'success');
      }
    }

    function showToast(message, type) {
      toast.value = { show: true, message, type };
      setTimeout(() => {
        toast.value.show = false;
      }, 3000);
    }

    function showAbout() {
      showToast('This is a minimalist prompt management app designed with Swiss web style principles.', 'info');
    }

    function showContact() {
      showToast('Contact: example@email.com', 'info');
    }

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        if (editingPrompt.value) {
          cancelEditing();
        } else if (selectedPrompt.value) {
          closeModal();
        } else if (showMenu.value) {
          showMenu.value = false;
        } else if (showNewPromptModal.value) {
          showNewPromptModal.value = false;
        }
      }
    }

    return {
      prompts,
      selectedPrompt,
      editingPrompt,
      showMenu,
      showNewPromptModal,
      toast,
      menuPosition,
      hasPrompts,
      openNewPromptModal,
      addPrompt,
      openModal,
      closeModal,
      toggleMenu,
      editPrompt,
      saveEditedPrompt,
      cancelEditing,
      forkPrompt,
      copyPrompt,
      deletePrompt,
      showToast,
      showAbout,
      showContact,
      handleKeydown
    };
  }
};
</script>

<style>
/* Additional component-specific styles */
p.note {
  font-size: 1.5rem;
}

.add-prompt-section {
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
}

.add-prompt-section button {
  padding: 0.5rem 1rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-prompt-section button:hover {
  background-color: #ff5252;
}

.prompts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

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
  background-color: white;
  padding: 2rem;
  border-radius: 4px;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-controls {
  display: flex;
  gap: 0.5rem;
}

.close-modal,
.menu-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.prompt-content {
  white-space: pre-wrap;
}

.prompt-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>