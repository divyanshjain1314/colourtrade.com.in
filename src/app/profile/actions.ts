export const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'colourtrade');

    const res = await fetch('https://api.cloudinary.com/v1_1/dmcb967lh/image/upload', {
        method: 'POST',
        body: formData
    });
    return res.json();
};