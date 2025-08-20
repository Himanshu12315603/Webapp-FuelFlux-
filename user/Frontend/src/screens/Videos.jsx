// import React from 'react'
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router'
// const Videos = () => {

//     const navigate = useNavigate() ;
//     const handleskip = () =>{
//         navigate('/permission') ;
//     }
    

//   return (
//     <div>
//         <div>Videos</div>
//         <button onClick={handleskip}>Skip</button>
//     </div >
//   )
// }

// export default Videos
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Videos = () => {
  const navigate = useNavigate();

  const handleskip = () => {
    navigate('/permission');
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromGoogle = queryParams.get("token");

    if (tokenFromGoogle) {
      localStorage.setItem("token", tokenFromGoogle);
      localStorage.setItem("isLoggedIn", true);
        console.log(tokenFromGoogle) ;
      // ✅ Remove token param from URL
      window.history.replaceState({}, document.title, "/video");
    }
  }, []);

  return (
    <div>
      <div>Videos</div>
      <button onClick={handleskip}>Skip</button>
    </div>
  );
};

export default Videos;
