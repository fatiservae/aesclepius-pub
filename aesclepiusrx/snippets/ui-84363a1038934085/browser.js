// export async function copyText(text) {
//     try {
//         await navigator.clipboard.writeText(text);
//         return true;
//     } catch (err) {
//         console.error(err);
//         return false;
//     }
// }

export function copyText(text) {
    navigator.clipboard.writeText(text).catch(console.error);
}
