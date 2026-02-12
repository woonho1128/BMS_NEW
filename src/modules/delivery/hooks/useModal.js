import { useState, useCallback } from 'react';

/**
 * Custom hook to manage modal state.
 * @param {any} initialData - Initial data for the modal.
 * @returns {Object} { isOpen, data, open, close }
 */
export const useModal = (initialData = null) => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState(initialData);

    const open = useCallback((newData = null) => {
        if (newData !== null) {
            setData(newData);
        }
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        // Optional: Reset data on close if needed, but keeping it might be useful for animations
        // setData(initialData); 
    }, [initialData]);

    return { isOpen, data, open, close };
};
