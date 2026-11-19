
export const convertBase64ToImage = (base64String: string) => {
    return `data:image/jpeg;base64,${base64String}`;
};
