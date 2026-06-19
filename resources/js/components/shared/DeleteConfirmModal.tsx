import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Delete',
    message = 'Are you sure you want to delete this item? This action cannot be undone.',
}: DeleteConfirmModalProps) {
    const [processing, setProcessing] = useState(false);

    const handleConfirm = async () => {
        setProcessing(true);
        await onConfirm();
        setProcessing(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="text-sm text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleConfirm} disabled={processing}>
                    {processing ? 'Deleting...' : 'Delete'}
                </Button>
            </div>
        </Modal>
    );
}
