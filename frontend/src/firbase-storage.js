import { getStorage, ref, uploadBytes, getDownloadURL,deleteObject } from "firebase/storage";

export const uploadFileToFirebase = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};

export const deleteFileFromFirebase = async (fileUrl) => {
    const storage = getStorage();
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
};