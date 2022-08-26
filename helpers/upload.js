
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


const upload = (files, validExtensions = ['jpg', 'png'], subpath = '') => {

    return new Promise((resolve, reject) => {
        const { file } = files;
        const shortName = file.name.split('.');
        const extension = shortName[shortName.length - 1];


        if (!validExtensions.includes(extension)) {
            return reject(`Invalid file extension, permitted ${validExtensions}`);
        }

        const tmpFileName = uuidv4() + '.' + extension;
        const uploadPath = path.join(process.cwd(), '/uploads/', subpath, tmpFileName);

        // Use the mv() method to place the file somewhere on your server
        file.mv(uploadPath, (err) => {
            if (err)
                reject(err);

            resolve(tmpFileName);
        });
    })

}

export {
    upload
};

