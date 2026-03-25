/* eslint-disable @typescript-eslint/no-explicit-any */

export const getCroppedImg = async (
    imageSrc: string,
    crop: any,
): Promise<File> => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
        image.onload = () => resolve(image);
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas');
    }
    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height,
    );
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                throw new Error(
                    'No se pudo crear el blob de la imagen recortada',
                );
            }
            const file = new File([blob], 'cropped.jpg', {
                type: 'image/jpeg',
            });
            resolve(file);
        }, 'image/jpeg');
    });
};
