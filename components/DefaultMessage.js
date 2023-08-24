import React, {useState, useEffect} from 'react'

const DefaultMessage = ({onlogout}) => {

  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // const handleResize = () => {
  //   setIsMobile(window.innerWidth <= 768);
  // };

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize);
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#000000",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <img src="/jmlogosmall.png" style={{width:"50%", marginBottom:"30px", margin:"auto"}} />
        <img src="/logo 1.svg" style={{width:"50%", marginBottom:"30px", margin:"auto"}} />
        <button
                  onClick={onlogout}
                  className=" text-white px-8 py-2 cursor-pointer"
                  style={{ background: "#1d1d1d" }}
                >
                  LOGOUT
                </button>
        {/* <h1 style={{color:"#fff", fontSize:"50px",fontWeight:"bolder", paddingBottom:"30px"}}>JusticeMinds</h1> */}
        {/* <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Welcome!</h1> */}
        {/* <p style={{ fontSize: "18px", color:"#adadad"}}>Select a name from the sidebar to view details.</p> */}
      </div>
    </div>
  )
}

export default DefaultMessage