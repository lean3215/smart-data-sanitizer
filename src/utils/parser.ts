import type { ParsedAddress, RecordStatus } from "../types/record";

const MALAYSIAN_STATES = [
    "Johor",
    "Kedah",
    "Kelantan",
    "Kuala Lumpur",
    "Labuan",
    "Melaka",
    "Negeri Sembilan",
    "Pahang",
    "Penang",
    "Perak",
    "Perlis",
    "Pulau Pinang",
    "Putrajaya",
    "Sabah",
    "Sarawak",
    "Selangor",
    "Terengganu",
];

export function parseSingleAddress(raw: string, index: number): ParsedAddress {
    const cleaned = raw.trim().replace(/\s+/g, " ");
    const issues: string[] = [];

    const postcodeMatch = cleaned.match(/\b\d{5}\b/);
    const postcode: string | null = postcodeMatch ? postcodeMatch[0] : null;
    if (!postcode) {
        issues.push("Missing 5-digit postcode");
    }

    const matchedState = 
        MALAYSIAN_STATES.find((state) => 
            new RegExp(`\\b${state}\\b`, "i").test(cleaned)
        ) ?? null;

    if (!matchedState) {
        issues.push("Unrecognized or missing state");
    }

    let street = cleaned;
    if (postcode) {
        street = street.replace(postcode, "");
    }
    if (matchedState) {
        street = street.replace(new RegExp(`\\b${matchedState}\\b`, "i"), "");
    }

    street = street
        .replace(/[\s,]*,[\s,]*/g, ", ")
        .replace(/^[\s,]+|[\s,]+$/g, "")
        .trim();

    if (street.length < 5) {
        issues.push("Street details look incomplete");
    }

    let status: RecordStatus = "valid";
    if (issues.length === 1) {
        status = "warning";
    } else if (issues.length >= 2) {
        status = "error";
    }

    return {
        id: `addr-${index + 1}`,
        raw,
        street: street || "-",
        postcode,
        state: matchedState,
        status,
        issues,
    };
}

export function parseAddressBatch(input: string): ParsedAddress[] {
    return input
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line, index) => parseSingleAddress(line, index));
}