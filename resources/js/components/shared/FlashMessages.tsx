import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

interface FlashMessagesProps {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export default function FlashMessages({ success, error, warning, info }: FlashMessagesProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [success, error, warning, info]);

    if (!visible || (!success && !error && !warning && !info)) return null;

    const dismiss = () => setVisible(false);

    const message = success || error || warning || info;
    const type = success ? 'success' : error ? 'error' : warning ? 'warning' : 'info';

    const styles = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        warning: 'bg-orange-50 text-orange-800 border-orange-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
    };

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg border shadow-lg ${styles[type]}`}>
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{message}</p>
                <button onClick={dismiss} className="flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
