// deno-lint-ignore-file no-explicit-any
export interface Metadata {
    ulid: string;
    name: string;
    labels: Record<string, string>;
    annotations: Record<string, string>;
    creationDate: string;
    lastModifiedDate: string;
}

export interface Game {
    metadata: Metadata;
    spec: Record<string, any>;
}