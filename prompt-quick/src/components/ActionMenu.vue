<template>
  <div class="action-menu" role="menu">
    <button
      v-for="(action, index) in actions"
      :key="index"
      @click="$emit(action.emit)"
      role="menuitem"
    >
      {{ action.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'ActionMenu',
  props: {
    actions: {
      type: Array,
      default: () => [
        { label: 'EDIT', emit: 'edit' },
        { label: 'FORK', emit: 'fork' },
        { label: 'COPY', emit: 'copy' },
        { label: 'DELETE', emit: 'delete' },
      ],
    },
  },
  emits: ['edit', 'fork', 'copy', 'delete'],
};
</script>

<style scoped>
.action-menu {
  position: absolute;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.action-menu button {
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9em;
  color: #333333;
  transition: background-color 0.3s ease;
  height: 44px; /* Set a fixed height for all items */
  line-height: 20px; /* Adjust line height for vertical centering */
  position: relative; /* For pseudo-element positioning */
  overflow: hidden; /* To contain the pseudo-element */
}

.action-menu button:hover {
  background-color: #f8f8f8;
}

.action-menu button:hover::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: #ff4136;
  transform: translateX(-100%);
  animation: slide-in 0.3s forwards;
}

@keyframes slide-in {
  to {
    transform: translateX(0);
  }
}

.action-menu button:not(:last-child) {
  border-bottom: 1px solid #e0e0e0;
}
</style>