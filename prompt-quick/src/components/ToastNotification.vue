<template>
  <div class="toast-notification" :class="type" role="alert">
    {{ message }}
  </div>
</template>

<script>
const TOAST_TYPES = ['info', 'success', 'warning', 'error'];

export default {
  name: 'ToastNotification',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => TOAST_TYPES.includes(value),
    }
  }
};
</script>

<style scoped>
.toast-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: #333333;
  font-weight: bold;
  z-index: 1000;
  animation: fade-in 0.3s, fade-out 0.3s 2.7s;
}

.toast-notification::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
}

.info::after {
  background-color: #2196F3;
}

.success::after {
  background-color: #4CAF50;
}

.warning::after {
  background-color: #FFC107;
  color: #000;
}

.error::after {
  background-color: #FF4136;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style>