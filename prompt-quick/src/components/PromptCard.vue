<template>
  <div class="prompt-card" @click="$emit('click')" tabindex="0" @keydown.enter="$emit('click')" role="button"
    :aria-label="'Open prompt: ' + title">
    <h3 class="prompt-title">{{ title }}</h3>
    <p class="prompt-description">{{ content }}</p>
    <div class="prompt-divider"></div>
    <div class="prompt-meta">
      <div class="prompt-stats">
        <span><font-awesome-icon :icon="['far', 'eye']" /> {{ views }}</span>
        <span><font-awesome-icon :icon="['far', 'heart']" /> {{ likes }}</span>
        <span><font-awesome-icon :icon="['far', 'comment']" /> {{ comments }}</span>
      </div>
      <div class="prompt-date">{{ formattedDate }}</div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '../utils/dateUtils';

export default {
  name: 'PromptCard',
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    date: {
      type: String,
      required: true
    }
  },
  computed: {
    formattedDate() {
      return formatDate(this.date);
    }
  }
};
</script>

<style scoped>
.prompt-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.prompt-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.prompt-title {
  font-size: 1em;
  font-weight: 700;
  color: #000000;
  margin-bottom: 16px;
  line-height: 1.2;
}

.prompt-description {
  font-size: 0.8em;
  color: #333333;
  line-height: 1.5;
  margin-bottom: 20px;
  flex-grow: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.prompt-divider {
  width: 33%;
  height: 2px;
  background-color: #ff4136;
  margin-bottom: 16px;
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

@media (forced-colors: active) {
  .prompt-card {
    border: 1px solid ButtonText;
  }
}
</style>