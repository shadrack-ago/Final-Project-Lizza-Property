import { useState } from "react"
import { useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom';

export default function CreateListing () {

  const {currentUser} = useSelector((state)=> state.user);
  const navigate = useNavigate();
  const [ imgFiles, setImgFiles] = useState([]);
  //console.log(imgFiles);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        regularPrice: 50,
        discountPrice: 0,
        bathrooms:1,
        bedrooms:1,
        furnished: false,
        parking: false,
        type: 'rent',
        offer: false,
        
    });
    console.log(formData)
    const [imgUploadError, setImgUploadError] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ uploading, setUploading] = useState(false);
    

    const handleImgSubmit = async (e) => {
        if(imgFiles.length > 0 && imgFiles.length + formData.imageUrls.length < 7){
            setUploading(true);
            setImgUploadError(false);
            
            try {
                const uploadData = new FormData();
                for(let i = 0; i < imgFiles.length; i++){
                    uploadData.append('images', imgFiles[i]);
                }

                const res = await fetch('/api/upload/images', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`,
                    },
                    body: uploadData,
                });

                const data = await res.json();
                
                if(data.success === false){
                    setImgUploadError(data.message);
                    setUploading(false);
                    return;
                }

                setFormData({
                    ...formData, 
                    imageUrls: formData.imageUrls.concat(data.imageUrls),
                });
                setImgUploadError(false);
                setUploading(false);
                
            } catch (error) {
                setImgUploadError('Image upload failed (2 mb max per image)');
                setUploading(false);
            }
        } else {
            setImgUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };

   const handleRemoveImage= (index)=>{
       setFormData({
        ...formData, imageUrls: formData.imageUrls.filter((_,i)=> i!== index),
       })
    };

    const handleChange = (e) =>{
            if(e.target.id === 'rent' || e.target.id === 'sale'){
                setFormData({...formData, type: e.target.id})
            }

            if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
                setFormData({...formData,[e.target.id]:e.target.checked});
            }

            if (e.target.type === 'number' || e.target.type === 'text' ||
                e.target.type === 'textarea') {
                   setFormData({ ...formData, [e.target.id]: e.target.value });
              }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            if(formData.imageUrls.length <1)
            return setError('You must upload at least one image');

            if (+formData.regularPrice < +formData.discountPrice)
            return setError('Discount price must be lower than regular price');

           setLoading(true);
           setError(false);

            const res = await fetch('/api/listing/create',{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    ...formData, userRef: currentUser._id
                })
            });

            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message);
            }
            
            navigate(`/listing/${data._id}`);

        }catch(error){
            setError(error.message);
            setLoading(false);
        }
    };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 bg-gray-200 rounded p-2 shadow-lg'>Create a listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>

            <input className=' border p-3 rounded-lg' type="text" 
            placeholder='Name' id='name'  onChange={handleChange}
            maxLength='62' minLength='5' required  value={formData.name}   />

        <textarea  className='border p-3 rounded-lg' type='text'
          placeholder='Description'  onChange={handleChange} value={formData.description}
          id='description' required/>
     <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required  onChange={handleChange}
            value={formData.address} />

            <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>
                    <input type='checkbox' id='sale'
                className='w-5'  onChange={handleChange} checked={formData.type === 'sale'}/>
                    <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
                </div>
                <div className='flex gap-2'>
                <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
            </div>
            <div className='flex flex-wrap gap-6'>
                <div  className='flex items-center gap-2'>
                <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg' 
                onChange={handleChange}
                value={formData.bedrooms}    
              />
              <p>Beds</p>
                </div>
                <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                
                {formData.type === 'rent' && (
                  <span className='text-xs'>(Rs / month)</span>
                )}
                
              </div>
            </div>
            {formData.offer && (
            <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>

                  {formData.type === 'rent' && (
                    
                    <span className='text-xs'>(Rs / month)</span>
                  )}
                  
                </div>
              </div>
              )}
            </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
                <span className='font-normal text-gray-600 ml-2'>First image will be the cover image(max6)</span>
                
            </p>
            <div  className='flex gap-4'>
            <input
              onChange={(e)=> setImgFiles(e.target.files)}
              
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple       
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImgSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
           >
             {uploading ? 'Uploading...' : 'upload'}
            </button>
            </div>
            <p className='text-red-700 text-sm'>{imgUploadError && imgUploadError}</p>
            {formData.imageUrls.length >0 && formData.imageUrls.map((url, index)=>(

            <div key={url} className="flex justify-between p-3 border items-center bg-gray-200 rounded shadow-xl">
                <img src={url} alt="listing image" className="w-20 h-20 object-cover rounded-lg" />
                <button onClick={() => handleRemoveImage(index)} type="button" className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
            </div>
            ))}
            <button disabled ={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
               {loading ? 'Creating...' : 'Create listing'}</button>
              {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
