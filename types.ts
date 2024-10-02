// deno-lint-ignore-file no-explicit-any
export interface Metadata {
    name: string;
    labels: Record<string, string>;
    annotations: Record<string, string>;
    creationDate: Date;
    lastModifiedDate: Date;
}

export interface Game {
    metadata: Metadata;
    spec: Record<string, any>;
}