import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {

  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState('');

    useEffect(()=>{
        const fetchOwner = async()=>{
            try{

                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setOwner(data);
            }catch(error){
                console.log(error);
            }
        };
        fetchOwner();
    },[listing.userRef]);

  return (
    <>
     {owner && (
        <div className='flex flex-col gap-2'>
            <p>Contact <span className='font-semibold'>{owner.username}</span>{' '}
            for {' '} <span className='font-semibold'>{listing.name} </span>to this email:{' '}<span className='font-semibold'>{owner.email}</span>
            </p>

            <textarea name='message' id='message' value={message} 
            onChange={(e) => setMessage(e.target.value)} rows='2' placeholder='Enter your message here....'
            className='w-full border p-3 rounded-lg'>
            </textarea>

            <Link to={`mailto:${owner.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'> Send Message</Link>
        </div>
     )}
    </>
  )
}

export default Contact
