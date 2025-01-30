import multer from 'multer';

const storageConfig = multer.diskStorage({
    //specify where the file should be stored
    destination: (req, file, callback) => {
        callback(null, 'public/images/');
    },

    //specify how the file name should be'
    filename: (req, file, callback) => {
        const name = Date.now() + "-" + file.originalname;
        callback(null, name)
    }
});

export const uploadFile = multer({ storage: storageConfig });