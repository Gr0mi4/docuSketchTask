import { ref, readonly } from 'vue';

interface ErrorInfo {
    id: string;
    message: string;
    context: string;
    details?: any;
}

const errors = ref<ErrorInfo[]>([]);
const isErrorVisible = ref(false);

export function useErrorHandler() {
    function safeExecute<T>(fn: () => T, context: string, details?: any): T | null {
        try {
            return fn();
        } catch (error) {
            handleError(error as Error, context, details);
            return null;
        }
    }

    function handleError(
        error: Error | string,
        context: string,
        details?: any
    ): void {
        const errorInfo: ErrorInfo = {
            id: Date.now().toString(),
            message: typeof error === 'string' ? error : error.message,
            context,
            details,
        };

        errors.value.unshift(errorInfo);
        isErrorVisible.value = true;
    }

    function dismissError(errorId: string): void {
        errors.value = errors.value.filter(err => err.id !== errorId);
        if (errors.value.length === 0) {
            isErrorVisible.value = false;
        }
    }

    return {
        errors: readonly(errors),
        isErrorVisible: readonly(isErrorVisible),
        safeExecute,
        handleError,
        dismissError
    };
}
