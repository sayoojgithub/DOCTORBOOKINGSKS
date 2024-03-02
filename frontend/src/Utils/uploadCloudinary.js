const upload_preset=import.meta.env.VITE_UPLOAD_PRESET;
const cloud_name=import.meta.env.VITE_CLOUD_NAME
const uploadImageToCloudinary = async (file, onProgress) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', upload_preset);
    uploadData.append('cloud_name', cloud_name);
  
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
          method: 'POST',
          body: uploadData,
          // You may need to add headers like Authorization if required by your Cloudinary setup
        });
  
        if (!response.ok) {
          throw new Error('Image upload failed');
        }
  
        const total = response.headers.get('content-length');
        let loaded = 0;
  
        const reader = response.body.getReader();
        let chunks = [];
  
        while (true) {
          const { done, value } = await reader.read();
  
          if (done) {
            const responseData = chunks.join('');
            const jsonData = JSON.parse(responseData);
            resolve(jsonData);
            break;
          }
  
          chunks.push(new TextDecoder().decode(value));
  
          loaded += value.length;
  
          // Calculate and update progress
          const progress = total ? Math.round((loaded / total) * 100) : 0;
          onProgress(progress);
        }
      } catch (error) {
        reject(error);
      }
    });
  };
  
  export default uploadImageToCloudinary;