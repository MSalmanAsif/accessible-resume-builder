const DEFAULT_CONFIG = {
    duration: 3000,
    position: 'top-right',
    showIcon: true
};
const ICONS = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
};
const COLORS = {
    success: '#48bb78',
    error: '#f56565',
    info: '#4299e1',
    warning: '#ed8936'
};
export function showNotification(message, type = 'info', config = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
    position: fixed;
    ${getPositionStyles(finalConfig.position)}
    padding: 1rem 1.5rem;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    background: ${COLORS[type]};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    word-wrap: break-word;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `;
    const icon = finalConfig.showIcon ? ICONS[type] : '';
    notification.innerHTML = `${icon} ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, finalConfig.duration);
}
function getPositionStyles(position) {
    switch (position) {
        case 'top-left':
            return 'top: 20px; left: 20px;';
        case 'bottom-right':
            return 'bottom: 20px; right: 20px;';
        case 'bottom-left':
            return 'bottom: 20px; left: 20px;';
        case 'top-right':
        default:
            return 'top: 20px; right: 20px;';
    }
}
export function showSuccess(message, config) {
    showNotification(message, 'success', config);
}
export function showError(message, config) {
    showNotification(message, 'error', { ...config, duration: 5000 });
}
export function showInfo(message, config) {
    showNotification(message, 'info', config);
}
export function showWarning(message, config) {
    showNotification(message, 'warning', config);
}
export function initializeNotifications() {
    if (document.getElementById('notification-animations'))
        return;
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
    @keyframes slideIn {
      from { 
        transform: translateX(100%); 
        opacity: 0; 
      }
      to { 
        transform: translateX(0); 
        opacity: 1; 
      }
    }
    
    @keyframes slideOut {
      from { 
        transform: translateX(0); 
        opacity: 1; 
      }
      to { 
        transform: translateX(100%); 
        opacity: 0; 
      }
    }
  `;
    document.head.appendChild(style);
}
