<template>
  <v-container>
    <h1>Welcome to Prompt Manager</h1>
    <p>This application helps you manage and explore prompts for various purposes.</p>
    <v-row class="mt-4">
      <v-col cols="12" sm="6">
        <v-btn block color="primary" @click="$router.push('/explorer')">
          Explore Prompts
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn block color="secondary" @click="$router.push('/management')">
          Manage Prompts
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// No additional script needed for now
</script>