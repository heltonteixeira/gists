<template>
  <div class="modal" @click.self="$emit('close')" role="dialog" aria-labelledby="modal-title">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modal-title" class="prompt-title">{{ prompt.title }}</h2>
        <div class="modal-controls">
          <button class="menu-button" @click="$emit('toggle-menu', $event)" ref="menuButtonRef" aria-label="Open menu" aria-haspopup="true" :aria-expanded="showMenu">&#8942;</button>
          <button class="close-modal" @click="$emit('close')" aria-label="Close modal">&times;</button>
        </div>
      </div>
      <div class="prompt-divider"></div>
      <pre><code class="language-markdown prompt-content" v-html="escapedContent" ref="contentRef"></code></pre>
      <div class="prompt-meta">
        <div class="prompt-stats">
          <span><font-awesome-icon :icon="['far', 'eye']" /> {{ prompt.views }}</span>
          <span><font-awesome-icon :icon="['far', 'heart']" /> {{ prompt.likes }}</span>
          <span><font-awesome-icon :icon="['far', 'comment']" /> {{ prompt.comments }}</span>
        </div>
        <div class="prompt-date">{{ formattedDate }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markdown';

export default {
  name: 'PromptViewModal',
  props: {
    prompt: {
      type: Object,
      required: true
    },
    showMenu: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'toggle-menu'],
  setup(props) {
    const contentRef = ref(null);

    const escapedContent = computed(() => {
      return escapeHtml(props.prompt.content);
    });

    const formattedDate = computed(() => {
      return new Date(props.prompt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    });

    function escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    onMounted(() => {
      nextTick(() => {
        if (contentRef.value) {
          Prism.highlightElement(contentRef.value);
        }
      });
    });

    return {
      escapedContent,
      contentRef,
      formattedDate
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
  max-width: 80vw;
  max-height: 80vh;
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

.modal-controls {
  display: flex;
  gap: 0.5rem;
}

.menu-button,
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
  margin: 0;
}

.prompt-content {
  font-size: 0.9em;
  color: #333333;
  line-height: 1.5;
  margin-bottom: 20px;
  flex-grow: 1;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.prompt-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666666;
}

.prompt-stats {
  display: flex;
}

.prompt-stats span {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.prompt-stats svg {
  margin-right: 4px;
}

.prompt-date {
  font-size: 12px;
}

/* Prism theme overrides */
pre {
  background-color: #f8f8f8;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

code {
  font-family: 'Fira Code', Arial, Sans-serif;
}

/* Additional Prism theme overrides as needed */
</style>