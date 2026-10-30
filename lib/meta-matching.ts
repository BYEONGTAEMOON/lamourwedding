// Meta advanced-matching fields for a Korean visitor, before hashing. Used by the browser
// Pixel (which hashes them itself) and the Conversions API (which hashes them in lib/meta-capi.ts).
// "홍길동", "010-1234-5678" → ln 홍, fn 길동, ph 821012345678.

const DOUBLE_SURNAMES = ['남궁', '황보', '제갈', '사공', '선우', '서문', '독고', '동방'];

export function matchingFields(name: string, phone: string) {
    const surnameLength = name.length > 2 && DOUBLE_SURNAMES.includes(name.slice(0, 2)) ? 2 : 1;
    const digits = phone.replace(/\D/g, '');
    return {
        ln: name.slice(0, surnameLength),
        fn: name.slice(surnameLength),
        ph: digits.startsWith('0') ? `82${digits.slice(1)}` : digits,
        country: 'kr',
    };
}
