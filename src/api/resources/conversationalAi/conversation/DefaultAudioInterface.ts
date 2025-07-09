import { AudioInterface } from "./AudioInterface";

/**
 * Default audio interface implementation for Node.js using basic audio processing.
 *
 * Note: This is a basic implementation. For production use, consider using
 * professional audio libraries like 'naudiodon', 'mic'/'speaker', or similar.
 *
 * This implementation provides a foundation that can be extended with actual
 * audio capture and playback capabilities.
 */
export class DefaultAudioInterface extends AudioInterface {
    private static readonly INPUT_FRAMES_PER_BUFFER = 4000; // 250ms @ 16kHz
    private static readonly OUTPUT_FRAMES_PER_BUFFER = 1000; // 62.5ms @ 16kHz
    private static readonly SAMPLE_RATE = 16000;
    private static readonly CHANNELS = 1;

    private inputCallback?: (audio: Buffer) => void;
    private outputQueue: Buffer[] = [];
    private shouldStop = false;
    private inputInterval?: NodeJS.Timeout;
    private outputInterval?: NodeJS.Timeout;

    /**
     * Starts the audio interface.
     *
     * @param inputCallback Function to call with audio chunks from the microphone
     */
    public start(inputCallback: (audio: Buffer) => void): void {
        this.inputCallback = inputCallback;
        this.shouldStop = false;
        this.outputQueue = [];

        // Start audio input simulation
        // In a real implementation, this would capture from the microphone
        this._startAudioInput();

        // Start audio output processing
        this._startAudioOutput();
    }

    /**
     * Stops the audio interface and cleans up resources.
     */
    public stop(): void {
        this.shouldStop = true;

        if (this.inputInterval) {
            clearInterval(this.inputInterval);
            this.inputInterval = undefined;
        }

        if (this.outputInterval) {
            clearInterval(this.outputInterval);
            this.outputInterval = undefined;
        }

        this.outputQueue = [];
        this.inputCallback = undefined;
    }

    /**
     * Output audio to the user.
     *
     * @param audio Audio data to output to the speaker
     */
    public output(audio: Buffer): void {
        if (!this.shouldStop) {
            this.outputQueue.push(audio);
        }
    }

    /**
     * Interruption signal to stop any audio output.
     */
    public interrupt(): void {
        // Clear the output queue to stop any audio that is currently playing
        this.outputQueue.length = 0;
    }

    /**
     * Starts audio input processing.
     *
     * Note: This is a placeholder implementation. In a real scenario, you would
     * use libraries like 'mic', 'naudiodon', or 'node-record-lpcm16' to capture
     * actual microphone input.
     */
    private _startAudioInput(): void {
        // Simulate audio input by generating silent audio chunks
        // In production, replace this with actual microphone capture
        const chunkSize = DefaultAudioInterface.INPUT_FRAMES_PER_BUFFER * 2; // 16-bit = 2 bytes per sample

        this.inputInterval = setInterval(() => {
            if (this.shouldStop || !this.inputCallback) {
                return;
            }

            // Generate silent audio chunk (all zeros)
            // In a real implementation, this would be actual microphone data
            const silentChunk = Buffer.alloc(chunkSize);
            this.inputCallback(silentChunk);
        }, 250); // 250ms intervals for 4000 samples at 16kHz
    }

    /**
     * Starts audio output processing.
     *
     * Note: This is a placeholder implementation. In a real scenario, you would
     * use libraries like 'speaker', 'naudiodon', or similar to play audio
     * through the system speakers.
     */
    private _startAudioOutput(): void {
        this.outputInterval = setInterval(() => {
            if (this.shouldStop) {
                return;
            }

            // Process queued audio for output
            if (this.outputQueue.length > 0) {
                const audioChunk = this.outputQueue.shift();
                if (audioChunk) {
                    // In a real implementation, this would play the audio
                    // For now, we just log that audio would be played
                    console.debug(`Playing audio chunk of ${audioChunk.length} bytes`);
                }
            }
        }, 62.5); // ~62.5ms intervals for 1000 samples at 16kHz
    }
}

/**
 * Creates a new DefaultAudioInterface instance.
 *
 * @returns A new DefaultAudioInterface instance
 */
export function createDefaultAudioInterface(): DefaultAudioInterface {
    return new DefaultAudioInterface();
}