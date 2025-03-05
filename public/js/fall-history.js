// js/fall-history.js
import IndexedDBService from '../services/indexedDB-service.js';

class FallHistoryManager {
    constructor() {
        this.indexedDBService = new IndexedDBService();
        this.fallHistoryList = document.getElementById('fallHistoryList');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');

        this.initEventListeners();
        this.loadFallHistory();
    }

    initEventListeners() {
        if (this.clearHistoryBtn) {
            this.clearHistoryBtn.addEventListener('click', this.clearFallHistory.bind(this));
        }
    }

    async loadFallHistory() {
        try {
            // Retrieve fall logs from IndexedDB
            const fallLogs = await this.indexedDBService.getAllFallLogs();
            
            // Clear existing list
            this.fallHistoryList.innerHTML = '';

            if (fallLogs.length === 0) {
                this.fallHistoryList.innerHTML = '<li>No fall events recorded</li>';
                return;
            }

            // Sort logs by most recent first
            fallLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Render fall logs
            fallLogs.forEach(log => {
                const logItem = document.createElement('li');
                logItem.innerHTML = `
                    <div class="fall-log-item">
                        <div class="fall-log-header">
                            <span class="fall-log-date">${this.formatDate(log.timestamp)}</span>
                            <span class="fall-log-status ${this.getStatusClass(log)}">
                                ${this.getStatusText(log)}
                            </span>
                        </div>
                        <div class="fall-log-details">
                            <p>Acceleration: ${log.accelerationData.toFixed(2)} m/s²</p>
                            ${log.emergencyContactNotified ? 
                                '<p class="emergency-notification">Emergency contacts notified</p>' : 
                                ''}
                        </div>
                    </div>
                `;
                this.fallHistoryList.appendChild(logItem);
            });
        } catch (error) {
            console.error('Error loading fall history:', error);
            this.fallHistoryList.innerHTML = '<li>Error loading fall history</li>';
        }
    }

    async clearFallHistory() {
        try {
            // Implement method in IndexedDB service to clear fall logs
            await this.indexedDBService.clearFallLogs();
            this.loadFallHistory(); // Refresh the view
            this.showNotification('Fall history cleared', 'success');
        } catch (error) {
            console.error('Error clearing fall history:', error);
            this.showNotification('Failed to clear fall history', 'error');
        }
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getStatusClass(log) {
        // Determine status class based on log details
        return log.emergencyContactNotified ? 'status-emergency' : 'status-resolved';
    }

    getStatusText(log) {
        return log.emergencyContactNotified ? 'Emergency' : 'Resolved';
    }

    showNotification(message, type = 'info') {
        const notificationContainer = document.getElementById('fallHistoryNotification');
        notificationContainer.textContent = message;
        notificationContainer.className = `notification ${type}`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notificationContainer.textContent = '';
            notificationContainer.className = 'notification';
        }, 3000);
    }
}

// Initialize fall history when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FallHistoryManager();
});