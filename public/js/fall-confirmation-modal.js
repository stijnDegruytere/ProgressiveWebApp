// js/fall-confirmation-modal.js
class FallConfirmationModal {
    constructor(onConfirm, onDecline) {
        this.createModalElement();
        this.onConfirm = onConfirm;
        this.onDecline = onDecline;
    }

    createModalElement() {
        // Create modal container
        this.modal = document.createElement('div');
        this.modal.id = 'fallConfirmationModal';
        this.modal.classList.add('modal');
        this.modal.innerHTML = `
            <div class="modal-content">
                <h2>Are You Okay?</h2>
                <p>A potential fall has been detected. Please confirm if you are alright.</p>
                <div class="modal-buttons">
                    <button id="confirmSafeBtn" class="btn btn-green">I'm Safe</button>
                    <button id="needHelpBtn" class="btn btn-red">I Need Help</button>
                </div>
                <p id="countdownText" class="countdown"></p>
            </div>
        `;

        // Append to body
        document.body.appendChild(this.modal);

        // Add event listeners
        this.confirmSafeBtn = this.modal.querySelector('#confirmSafeBtn');
        this.needHelpBtn = this.modal.querySelector('#needHelpBtn');
        this.countdownText = this.modal.querySelector('#countdownText');

        this.confirmSafeBtn.addEventListener('click', () => this.handleConfirmation(true));
        this.needHelpBtn.addEventListener('click', () => this.handleConfirmation(false));
    }

    show() {
        this.modal.style.display = 'block';
        this.startCountdown();
    }

    hide() {
        this.modal.style.display = 'none';
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    startCountdown(duration = 30) {
        let timeLeft = duration;
        this.countdownText.textContent = `Time to respond: ${timeLeft} seconds`;

        this.countdownInterval = setInterval(() => {
            timeLeft--;
            this.countdownText.textContent = `Time to respond: ${timeLeft} seconds`;

            if (timeLeft <= 0) {
                clearInterval(this.countdownInterval);
                this.handleConfirmation(false);
            }
        }, 1000);
    }

    handleConfirmation(isSafe) {
        this.hide();
        
        if (isSafe) {
            this.onConfirm();
        } else {
            this.onDecline();
        }
    }
}

export default FallConfirmationModal;