// extract your Cloudinary logic here
export async function uploadImage(file: File): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'xyz');

    const res = await fetch('https://api.cloudinary.com/v1_1/…/upload', {
        method: 'POST',
        body: form,
    });
    const data = await res.json();
    return data.secure_url as string;
}
