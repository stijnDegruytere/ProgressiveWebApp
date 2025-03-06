// fall-detection-service.js
// Example of more advanced fall detection logic
class AdvancedFallDetectionService {
    constructor(options = {}) {
        this.options = {
            accelerationThreshold: 3.5,  // Higher precision threshold
            gyroscopeThreshold: 2.0,     // Include rotational data
            fallWindow: 500,             // Milliseconds to analyze
            recoveryWindow: 2000         // Time to check user's response
        };

        this.motionHistory = [];
        this.fallDetectionCallbacks = [];
    }

    // Enhanced motion tracking with multiple sensor inputs
    handleDeviceMotion(event) {
        const { acceleration, rotationRate } = event;
        const currentTime = Date.now();

        // Calculate more complex motion signature
        const motionSignature = {
            totalAcceleration: Math.sqrt(
                acceleration.x ** 2 + 
                acceleration.y ** 2 + 
                acceleration.z ** 2
            ),
            rotationalVelocity: rotationRate ? Math.abs(
                rotationRate.alpha + 
                rotationRate.beta + 
                rotationRate.gamma
            ) : 0,
            timestamp: currentTime
        };

        this.motionHistory.push(motionSignature);

        // Keep only recent motion data
        this.motionHistory = this.motionHistory.filter(
            motion => currentTime - motion.timestamp < this.options.fallWindow
        );

        // Advanced fall detection logic
        if (this.detectPotentialFall(this.motionHistory)) {
            this.triggerFallDetection(motionSignature);
        }
    }

    detectPotentialFall(motionData) {
        // More sophisticated fall detection algorithm
        const highAccelerationEvents = motionData.filter(
            motion => motion.totalAcceleration > this.options.accelerationThreshold
        );

        const suddenRotationalChanges = motionData.filter(
            motion => motion.rotationalVelocity > this.options.gyroscopeThreshold
        );

        return highAccelerationEvents.length > 2 && 
               suddenRotationalChanges.length > 1;
    }
}