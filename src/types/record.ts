export type RecordStatus = "valid" | "warning" | "error";

export interface ParsedAddress {
    id: string;
    raw: string;
    street: string;
    postcode: string | null;
    state: string | null;
    status: RecordStatus;
    issues: string[];
}