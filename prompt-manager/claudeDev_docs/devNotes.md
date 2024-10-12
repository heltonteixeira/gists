# Development Notes

## Best Practices

1. Use Composition API with `<script setup>` for Vue components, as it provides a more concise and readable way to define component logic.
2. Utilize Pinia for state management, as it offers a simpler and more intuitive API compared to Vuex.
3. Implement modular routing using Vue Router, defining routes in a separate file for better organization.
4. Use Vuetify components for consistent UI design and faster development.
5. Keep components small and focused on a single responsibility for better maintainability.
6. Always use the `autocomplete` attribute on password fields to improve security and user experience.
7. Implement proper form validation and error handling to provide a better user experience.
8. Use watchers to react to prop changes in child components when necessary.
9. Utilize computed properties for derived state to improve performance and readability.
10. Implement theme switching functionality using Vuetify's built-in theme system.
11. Write unit tests for store modules and critical components to ensure code reliability.
12. Use mocking techniques in tests to isolate units and avoid dependencies on external services.
13. When implementing form validation, ensure that error messages are only displayed after form submission to avoid premature validation feedback.
14. Use computed properties to manage complex validation logic and error messages.
15. Expose necessary methods from child components using `defineExpose` to allow parent components to interact with them.

## Error Solutions

1. When encountering "command not found" errors, ensure you're in the correct directory (prompt-manager) before running npm commands.
2. If Vuetify components are not rendering properly, double-check that Vuetify is correctly imported and installed in the main.js file.
3. When form validation messages persist after saving, make sure to reset the form or update the validation state after successful submission.
4. If edit functionality is not populating form fields, ensure that you're properly watching for changes in the props and updating the local state accordingly.
5. When testing store modules that use localStorage, create a custom storage object that can be easily mocked in tests.
6. To prevent premature validation messages, use a separate flag (e.g., `showErrors`) to control when validation messages should be displayed.

## Project Structure

```medusa
prompt-manager/
├── src/
│   ├── assets/
│   ├── components/
│   ├── router/
│   │   └── index.js
│   ├── store/
│   │   └── index.js
│   ├── views/
│   │   └── Home.vue
│   ├── tests/
│   │   └── promptStore.test.js
│   ├── App.vue
│   └── main.js
├── claudeDev_docs/
│   ├── currentTask.md
│   └── devNotes.md
└── package.json
```

## Key Implementations

1. Form Validation with Delayed Error Messages:

  ```vue
  <template>
    <v-form @submit.prevent="submitForm" ref="form">
      <v-combobox
        v-model="promptData.tags"
        label="Tags"
        multiple
        chips
        small-chips
        deletable-chips
        :rules="tagRules"
        :error-messages="tagsErrorMessage"
        :error="showErrors && !isTagsValid"
      ></v-combobox>
    </v-form>
  </template>

  <script setup>
  import { ref, computed } from 'vue'

  const showErrors = ref(false)
  const isTagsValid = computed(() => promptData.value.tags && promptData.value.tags.length > 0)
  const tagsErrorMessage = computed(() => {
    if (showErrors.value && !isTagsValid.value) {
      return 'At least one tag is required'
    }
    return ''
  })

  const tagRules = [() => isTagsValid.value || 'At least one tag is required']

  function submitForm() {
    showErrors.value = true
    if (form.value.validate()) {
      // Handle form submission
    }
  }

  function validate() {
    showErrors.value = true
    return form.value ? form.value.validate() : false
  }

  defineExpose({
    validate
  })
  </script>
  ```

2. Handling Form Submission in Parent Component:

  ```vue
  <template>
    <PromptForm
      :prompt="editingPrompt || {}"
      @submit="savePrompt"
      ref="promptForm"
    />
  </template>

  <script setup>
  import { ref } from 'vue'

  const promptForm = ref(null)

  async function savePrompt(promptData) {
    if (!promptForm.value || !promptForm.value.validate()) {
      showMessage('Please fill in all required fields', 'error')
      return
    }

    // Handle saving the prompt
  }
  </script>
  ```

## Next Steps

1. Implement CRUD operations for prompts (Create, Read, Update, Delete).
2. Add form validation for prompt input.
3. Implement prompt categorization and filtering.
4. Design and implement additional views for prompt management.
5. Begin planning the backend API structure.
6. Implement error handling and user feedback for various operations.
7. Add loading indicators for asynchronous operations.
8. Optimize the application for performance, especially when dealing with large numbers of prompts.
9. Implement unit and integration tests for critical components and functions.
10. Consider adding more advanced features like prompt versioning or collaboration tools.
