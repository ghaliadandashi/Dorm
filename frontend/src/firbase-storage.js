import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFileToFirebase = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};
