import type * as ElevenLabs from "../../../api/index";

/** @internal */
export type HeaderModel = ElevenLabs.WebhookToolApiSchemaConfigInputRequestHeadersValue;

/** The value of a webhook request header. */
export class Header {
    private readonly _model: HeaderModel;

    private constructor(model: HeaderModel) {
        this._model = model;
    }

    /** A fixed value. */
    static value(text: string): Header {
        return new Header(text);
    }

    /** A secret from the workspace's secret store, so the value never appears in the config. */
    static secret(secretId: string): Header {
        return new Header({ secretId });
    }

    /** The value of a dynamic variable when the tool runs. */
    static variable(name: string): Header {
        return new Header({ variableName: name });
    }

    /** A workspace environment variable, by label. */
    static envVar(label: string): Header {
        return new Header({ envVarLabel: label });
    }

    /** @internal */
    toModel(): HeaderModel {
        return this._model;
    }
}

/** @internal */
export type AuthConnectionModel = ElevenLabs.WebhookToolApiSchemaConfigInputAuthConnection;

/** The auth connection a webhook tool authenticates with. */
export class AuthConnection {
    private readonly _model: AuthConnectionModel;

    private constructor(model: AuthConnectionModel) {
        this._model = model;
    }

    /** An auth connection from the workspace's store, by id. */
    static id(authConnectionId: string): AuthConnection {
        return new AuthConnection({ authConnectionId });
    }

    /** An environment variable of type auth connection, by label, resolved for the current environment. */
    static envVar(label: string): AuthConnection {
        return new AuthConnection({ envVarLabel: label });
    }

    /** @internal */
    toModel(): AuthConnectionModel {
        return this._model;
    }
}
