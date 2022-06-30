import { useRef, useState } from 'react';
import './ImageUpload.css';
import { uuidv4 } from '@firebase/util';

function ImageUpload({ setNewImage }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageObj, setImageObj] = useState<any>();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };
  const handleClick = async (imageClicked: any) => {
    const formData = new FormData();
    formData.append('file', imageClicked);
    formData.append('upload_preset', 'yvorzt4q');
    const url = process.env.REACT_APP_CLOUDURL as string;
    const upload = await fetch(url, { method: 'POST', body: formData });
    const res = await upload.json();
    setNewImage(res.url);
  };

  const updatePreview = (file: any) => {
    if (file) {
      file.preview = URL.createObjectURL(file);
      return file;
    }
  };

  return (
    <div className='uploadContainer'>
      <form className='navbarForm'>
        <input
          type='file'
          multiple={true}
          accept='image/*'
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files) {
              const files = e.target.files;
              setImageObj((prev: any) => {
                let arr: any = [];
                for (const indx in files) {
                  if (files.hasOwnProperty(indx)) {
                    const element = updatePreview(files[indx]);
                    arr.push(element);
                  }
                }
                if (prev) return [...prev, ...arr];
                else return [...arr];
              });
            } else {
              setImageObj(undefined);
            }
          }}
        />
        <button onClick={handleSubmit}>Upload images</button>
      </form>
      <div className='navbarImages'>
        {imageObj?.map((el: any, indx: any) => {
          return (
            <img
              onClick={() => {
                const file = el;
                handleClick(file);
              }}
              key={uuidv4()}
              src={el.preview}
              alt={'not uploaded'}
              style={{ height: '88px' }}
            ></img>
          );
        })}
      </div>
    </div>
  );
}

export default ImageUpload;