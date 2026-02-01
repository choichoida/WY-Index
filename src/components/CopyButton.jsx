import { useState } from 'react';

/**
 * 클립보드 복사 버튼
 * 모바일 터치 최적화: 최소 44px 높이
 */
export const CopyButton = ({ text, disabled = false }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!text || disabled) return;

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            disabled={disabled || !text}
            className={`
                min-h-[44px] px-6 py-3 rounded-lg font-medium text-base
                transition-all duration-200
                ${disabled || !text
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : copied
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                }
            `}
        >
            {copied ? '복사 완료!' : '분석 결과 복사하기'}
        </button>
    );
};
