import { Camera, CameraResultType } from '@capacitor/camera';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

export const takePhoto = async () => {
  var cameraResult=null;
  var imageUrl="";
  try {
   
      cameraResult = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        width:800,
        height:600,
        saveToGallery	:true,
        resultType: CameraResultType.Base64,
        //resultType: CameraResultType.Uri,
      });
      imageUrl = `data:image/jpeg;base64,${(await cameraResult).base64String}`;
      //imageUrl=cameraResult?.path || cameraResult?.webPath;

  }
  catch(error){
   
    console.log(error.message)
  }
  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  
  console.log(imageUrl);

  return imageUrl;

};
defineCustomElements(window);
