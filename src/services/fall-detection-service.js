// fall-detection-service.js
class FallDetectionService {
    constructor(options = {}) {
        // Configurable sensitivity parameters
        this.options = {
            accelerationThreshold: options.accelerationThreshold || 2.5, // m/s²
            inactivityThreshold: options.inactivityThreshold || 1000, // milliseconds
            debounceTime: options.debounceTime || 5000, // milliseconds between fall checks
        };

        this.lastAcceleration = null;
        this.lastMotionTimestamp = null;
        this.isFallDetected = false;
        this.fallDetectionCallbacks = [];
    }

    // Start monitoring device motion
    startMonitoring() {
        if ('DeviceMotionEvent' in window) {
            window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this));
            console.log('Fall detection monitoring started');
        } else {
            console.warn('Device motion not supported');
            return false;
        }
        return true;
    }

    // Stop monitoring device motion
    stopMonitoring() {
        window.removeEventListener('devicemotion', this.handleDeviceMotion.bind(this));
        console.log('Fall detection monitoring stopped');
    }

    // Add callback for fall detection
    onFallDetected(callback) {
        this.fallDetectionCallbacks.push(callback);
    }

    // Internal method to handle device motion events
    handleDeviceMotion(event) {
        const { acceleration } = event;
        const currentTime = Date.now();

        // Calculate total acceleration magnitude
        const totalAcceleration = Math.sqrt(
            Math.pow(acceleration.x, 2) +
            Math.pow(acceleration.y, 2) +
            Math.pow(acceleration.z, 2)
        );

        // Check for sudden, high acceleration followed by inactivity
        if (this.lastAcceleration && this.lastMotionTimestamp) {
            const accelerationChange = Math.abs(totalAcceleration - this.lastAcceleration);
            const timeSinceLastMotion = currentTime - this.lastMotionTimestamp;

            // Potential fall detection logic
            if (
                accelerationChange > this.options.accelerationThreshold &&
                timeSinceLastMotion > this.options.inactivityThreshold
            ) {
                this.triggerFallDetection();
            }
        }

        // Update last known acceleration and timestamp
        this.lastAcceleration = totalAcceleration;
        this.lastMotionTimestamp = currentTime;
    }

    // Trigger fall detection process
    triggerFallDetection() {
        if (this.isFallDetected) return;

        this.isFallDetected = true;
        console.log('Potential fall detected!');

        // Notify all registered callbacks
        this.fallDetectionCallbacks.forEach(callback => {
            callback({
                timestamp: new Date().toISOString(),
                accelerationData: this.lastAcceleration
            });
        });

        // Debounce to prevent multiple fall detections
        setTimeout(() => {
            this.isFallDetected = false;
        }, this.options.debounceTime);
    }

    // Calibrate sensitivity (optional method)
    calibrate(options = {}) {
        this.options = { ...this.options, ...options };
        console.log('Fall detection calibrated', this.options);
    }
}

export default FallDetectionService;