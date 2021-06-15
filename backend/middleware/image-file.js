const multer = require("multer");


const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
  };
  
  // ** Imp Note: This function does not create the image directory automatically. 
  // There has to be a directory pre-created: in our example the images folder had to be created manually.
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      // The path "backend/images" is stored relative to the server.js file
      cb(error, "images");
      // Refer link
      // https://stackoverflow.com/questions/48418680/enoent-no-such-file-or-directory/48653921#48653921
      // To be able to create a folder on fly without having to pre-create
      //cb(error, path.join(__dirname, "/images"));
  
    },
    filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(" ").join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    }
  });

module.exports =  multer({storage: storage }).single("image");