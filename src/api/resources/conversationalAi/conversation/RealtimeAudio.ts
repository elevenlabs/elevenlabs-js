import type { RealtimeWireFormat } from "./RealtimeSession";

/** The sample rate of the audio exchanged with `AudioInterface`. */
export const AUDIO_INTERFACE_SAMPLE_RATE = 16000;

/** Converts between the audio interface format (16-bit PCM mono at 16kHz) and the session's wire formats. */
export class RealtimeAudioConverter {
    private readonly inputStream = new Pcm16Stream();
    private readonly outputStream = new Pcm16Stream();
    private readonly inputResampler: LinearResampler;
    private readonly outputResampler: LinearResampler;

    constructor(
        private readonly inputFormat: RealtimeWireFormat,
        private readonly outputFormat: RealtimeWireFormat,
    ) {
        this.inputResampler = new LinearResampler(AUDIO_INTERFACE_SAMPLE_RATE, inputFormat.sampleRate);
        this.outputResampler = new LinearResampler(outputFormat.sampleRate, AUDIO_INTERFACE_SAMPLE_RATE);
    }

    public encodeInput(audio: Buffer): Buffer {
        const samples = this.inputResampler.process(this.inputStream.samples(audio));
        if (this.inputFormat.encoding === "ulaw") {
            const encoded = Buffer.alloc(samples.length);
            for (let i = 0; i < samples.length; i++) {
                encoded[i] = ulawEncode(samples[i]);
            }
            return encoded;
        }
        return packPcm16(samples);
    }

    public decodeOutput(audio: Buffer): Buffer {
        let samples: number[];
        if (this.outputFormat.encoding === "ulaw") {
            samples = new Array(audio.length);
            for (let i = 0; i < audio.length; i++) {
                samples[i] = ULAW_DECODE_TABLE[audio[i]];
            }
        } else {
            samples = this.outputStream.samples(audio);
        }
        return packPcm16(this.outputResampler.process(samples));
    }
}

/** Splits a byte stream into little-endian 16-bit samples, carrying odd bytes into the next chunk. */
class Pcm16Stream {
    private remainder: Buffer = Buffer.alloc(0);

    public samples(data: Buffer): number[] {
        const buffer = this.remainder.length > 0 ? Buffer.concat([this.remainder, data]) : data;
        const usable = buffer.length - (buffer.length % 2);
        this.remainder = Buffer.from(buffer.subarray(usable));
        const samples = new Array<number>(usable / 2);
        for (let i = 0; i < samples.length; i++) {
            samples[i] = buffer.readInt16LE(i * 2);
        }
        return samples;
    }
}

function packPcm16(samples: number[]): Buffer {
    const packed = Buffer.alloc(samples.length * 2);
    for (let i = 0; i < samples.length; i++) {
        packed.writeInt16LE(samples[i], i * 2);
    }
    return packed;
}

/**
 * Streaming linear-interpolation resampler for 16-bit samples.
 * Downsampling applies a [1, 2, 1] low-pass first to limit aliasing.
 */
class LinearResampler {
    private readonly sourceStep: number;
    private readonly targetStep: number;
    private readonly lowPass: boolean;
    private history: [number, number] = [0, 0];
    private previous?: number;
    // Position of the next output sample in source samples, scaled by `targetStep`, relative to `previous`.
    private position = 0;

    constructor(sourceRate: number, targetRate: number) {
        const divisor = gcd(sourceRate, targetRate);
        this.sourceStep = sourceRate / divisor;
        this.targetStep = targetRate / divisor;
        this.lowPass = targetRate < sourceRate;
    }

    public process(input: number[]): number[] {
        if (this.sourceStep === this.targetStep) {
            return input;
        }
        const samples = this.lowPass ? this.filter(input) : input;
        const buffer = this.previous === undefined ? samples : [this.previous, ...samples];
        if (buffer.length === 0) {
            return [];
        }

        const { sourceStep, targetStep } = this;
        const end = (buffer.length - 1) * targetStep;
        let position = this.position;
        const result: number[] = [];
        while (position < end) {
            const index = Math.floor(position / targetStep);
            const fraction = position - index * targetStep;
            result.push(
                Math.floor((buffer[index] * (targetStep - fraction) + buffer[index + 1] * fraction) / targetStep),
            );
            position += sourceStep;
        }
        this.position = position - end;
        this.previous = buffer[buffer.length - 1];
        return result;
    }

    private filter(samples: number[]): number[] {
        let [before, last] = this.history;
        const filtered = new Array<number>(samples.length);
        for (let i = 0; i < samples.length; i++) {
            filtered[i] = (before + 2 * last + samples[i]) >> 2;
            before = last;
            last = samples[i];
        }
        this.history = [before, last];
        return filtered;
    }
}

function gcd(a: number, b: number): number {
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

const ULAW_BIAS = 0x84;
const ULAW_CLIP = 32635;

export function ulawEncode(sample: number): number {
    const sign = sample < 0 ? 0x80 : 0;
    const magnitude = Math.min(sign ? -sample : sample, ULAW_CLIP) + ULAW_BIAS;
    let exponent = 7;
    while (exponent > 0 && (magnitude & (0x80 << exponent)) === 0) {
        exponent--;
    }
    const mantissa = (magnitude >> (exponent + 3)) & 0x0f;
    return ~(sign | (exponent << 4) | mantissa) & 0xff;
}

export function ulawDecode(byte: number): number {
    const inverted = ~byte & 0xff;
    const exponent = (inverted >> 4) & 0x07;
    const magnitude = ((((inverted & 0x0f) << 3) + ULAW_BIAS) << exponent) - ULAW_BIAS;
    return inverted & 0x80 ? -magnitude : magnitude;
}

const ULAW_DECODE_TABLE: number[] = Array.from({ length: 256 }, (_, byte) => ulawDecode(byte));
