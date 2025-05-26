<template>
    <div class="error-container">
        <div class="error-list">
            <div
                v-for="error in errors"
                :key="error.id"
                class="error-item"
            >
                <div class="error-main">
                    <div class="error-context">{{ error.context }}</div>
                    <div class="error-message">{{ error.message }}</div>
                </div>

                <div v-if="error.details" class="error-details">
                    <details>
                        <summary>Details</summary>
                        <pre>{{ JSON.stringify(error.details, null, 2) }}</pre>
                    </details>
                </div>

                <button
                    @click="dismissError(error.id)"
                    class="dismiss-btn"
                >
                    Hide the error
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useErrorHandler } from "@/composables/useErrorHandler";

const { errors, dismissError } = useErrorHandler();

</script>

<style scoped>
.error-container {
    position: fixed;
    top: 5%;
    right: 5%;
    min-width: 500px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
}

.error-list {
    padding: 20px;
}

.error-item {
    border: 1px solid #fecaca;
    border-radius: 6px;
    padding: 15px;
    margin-bottom: 15px;
    background: #fef2f2;
}

.error-item:last-child {
    margin-bottom: 0;
}

.error-context {
    font-weight: bold;
    color: #991b1b;
    margin-bottom: 5px;
}

.error-message {
    color: #dc2626;
    margin-bottom: 5px;
}

.error-details {
    margin: 10px 0;
}

.error-details summary, summary {
    cursor: pointer;
    font-weight: bold;
    color: #7c3aed;
}

.error-details pre {
    background: #f8f9fa;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
    margin-top: 5px;
}

.dismiss-btn {
    background: #6b7280;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

.dismiss-btn:hover {
    background: #4b5563;
}
</style>
