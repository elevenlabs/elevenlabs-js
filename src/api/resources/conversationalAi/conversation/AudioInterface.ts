/**
 * AudioInterface provides an abstraction for handling audio input and output.
 * 
 * This interface is designed to work with Node.js audio libraries and provides
 * the necessary methods for real-time audio processing in conversational AI applications.
 */
export abstract class AudioInterface {
    /**
     * Starts the audio interface.
     * 
     * Called one time before the conversation starts.
     * The `inputCallback` should be called regularly with input audio chunks from
     * the user. The audio should be in 16-bit PCM mono format at 16kHz. Recommended
     * chunk size is 4000 samples (250 milliseconds).
     * 
     * @param inputCallback Function to call with audio chunks from the microphone
     */
    abstract start(inputCallback: (audio: Buffer) => void): void;

    /**
     * Stops the audio interface.
     * 
     * Called one time after the conversation ends. Should clean up any resources
     * used by the audio interface and stop any audio streams. Do not call the
     * `inputCallback` from `start` after this method is called.
     */
    abstract stop(): void;

    /**
     * Output audio to the user.
     * 
     * The `audio` input is in 16-bit PCM mono format at 16kHz. Implementations can
     * choose to do additional buffering. This method should return quickly and not
     * block the calling thread.
     * 
     * @param audio Audio data to output to the speaker
     */
    abstract output(audio: Buffer): void;

    /**
     * Interruption signal to stop any audio output.
     * 
     * User has interrupted the agent and all previously buffered audio output should
     * be stopped.
     */
    abstract interrupt(): void;
} 