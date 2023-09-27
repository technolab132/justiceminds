import React, { useEffect, useState } from "react";
import DefaultMessage from "./DefaultMessage";
import LoadingComponent from "./LoadingComponent";
import PDFViewer from "./PDFViewer";
import { axiosRetry } from "./retryAxios"; // Import the axiosRetry function

// const axios = require("axios")
const DetailPanel = ({
  selectedData,
  sentEmails,
  receivedEmails,
  onClose,
  loading,
  extractedTexts,
  setExtractedTexts,
  handleExtractText,
  loadingtext,
  currentlyExtractingEmailIndex,
}) => {
  const [activeTab, setActiveTab] = useState("sent");
  const [showFullMessages, setShowFullMessages] = useState({}); // State to track if the full message should be shown
  // const [loadingtext, setLoadingText] = useState(false); // State to track if
  // const [googleDriveFileId, setGoogleDriveFileId] = useState('');
  // const [extractedText, setExtractedText] = useState('');

  const [combinedPdfLinks, setCombinedPdfLinks] = useState([]);

  useEffect(() => {
    const combinedLinks = [
      ...sentEmails?.map(
        (email) =>
          `https://drive.google.com/uc?id=${
            email.PDFLINK.match(/\/d\/([a-zA-Z0-9_-]+)\//)[1]
          }`
      ),
      ...receivedEmails?.map(
        (email) =>
          `https://drive.google.com/uc?id=${
            email.PDFLINK.match(/\/d\/([a-zA-Z0-9_-]+)\//)[1]
          }`
      ),
    ];
    setCombinedPdfLinks(combinedLinks);
  }, [sentEmails, receivedEmails]);

  // const handleExtractText = async () => {
  //   try {
  //     // let combinedText = '';

  //     // for (const pdfLink of combinedPdfLinks) {
  //     //   const googleDriveUrl = `https://drive.google.com/uc?id=${pdfLink}`;

  //     //   const response = await axios.post('/api/extract-pdf', { pdfUrl: googleDriveUrl });

  //     //   combinedText += response.data.text + '\n';
  //     // }

  //     // setExtractedText(combinedText);

  //     // Construct the direct download link for the Google Drive file
  //     const googleDriveUrl = `https://drive.google.com/uc?id=${googleDriveFileId}`;

  //     // // Send the Google Drive URL to the API for text extraction
  //     const response = await axios.post('/api/extract-pdf', { pdfUrl: googleDriveUrl });
  //     setExtractedText(response.data.text);
  //     // console.log(combinedPdfLinks);
  //   } catch (error) {
  //     console.error('Error extracting text:', error);
  //   }
  // };
  // const handleExtractText = async (pdfLink) => {
  //   try {
  //     const response = await fetch('/api/extract-pdf', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ pdfUrl: pdfLink }),
  //     });

  //     if (response.ok) {
  //       const { text } = await response.json();
  //       setExtractedText(text);
  //     } else {
  //       console.error('Error extracting text:', response.statusText);
  //       setExtractedText('Error extracting text');
  //     }
  //   } catch (error) {
  //     console.error('Error extracting text:', error);
  //     setExtractedText('Error extracting text');
  //   }
  // };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExtractedTexts({});
  };

  const handleClose = () => {
    onClose(); // Call the onClose function from props to reset selectedData to null
  };

  const handleToggleMessage = (email) => {
    setShowFullMessages((prevShowFullMessages) => {
      return { ...prevShowFullMessages, [email]: !prevShowFullMessages[email] };
    });
  };

  // const getEmailContent = (email) => {
  //   const showFullMessage = showFullMessages[email];

  //   if (email.length > 100) {
  //     return (
  //       <p>
  //         {showFullMessage ? email + " " : email.substring(0, 100) + "..."}
  //         <button
  //           style={{ color: "#fff" }}
  //           onClick={() => handleToggleMessage(email)}
  //         >
  //           {showFullMessage ? "Show Less" : "Show More"}
  //         </button>
  //       </p>
  //     );
  //   }

  //   return <p>{email}</p>;
  // };

  return (
    <div style={{ lineHeight: "2rem", height: "100vh", overflowY: "scroll" }}>
      <div
        style={{
          padding: "30px",
          borderBottom: "2px solid #424242",
          fontSize: "17px",
        }}
      >
        <button
          style={{
            position: "absolute",
            right: "60px",
            top: "20px",
            zIndex: "1000",
          }}
          onClick={handleClose}
        >
          [x]
        </button>
        <h2>
          <span style={{ color: "#adadad" }}>Name</span> :{" "}
          {selectedData["Name"]}
        </h2>
        <p>
          <span style={{ color: "#adadad" }}>Company</span> :{" "}
          {selectedData["CompanyName"]}
        </p>
        <p>
          <span style={{ color: "#adadad" }}>Email</span> :{" "}
          {selectedData["Email"]}
        </p>
        <p>
          <span style={{ color: "#adadad" }}>Phone</span> :{" "}
          {selectedData["Phone"]}
        </p>

        {sentEmails ? (
          <>
            <p>
              <span style={{ color: "#adadad" }}>Email Sent</span> :
              {loading ? (
                <span> Fetching . . . </span>
              ) : (
                <span> {sentEmails?.length}</span>
              )}
            </p>
            <p>
              <span style={{ color: "#adadad" }}>Email Received</span> :
              {loading ? (
                <span> Fetching . . . </span>
              ) : (
                <span> {receivedEmails?.length}</span>
              )}
            </p>
            <p>
              <span style={{ color: "#adadad" }}>Total Email</span> :
              {loading ? (
                <span> Fetching . . . </span>
              ) : (
                <span> {sentEmails?.length + receivedEmails?.length}</span>
              )}
            </p>
            <p>
              <span style={{ color: "#adadad" }}>Date of First Email Sent</span>{" "}
              :
              {loading ? (
                <span> Fetching . . . </span>
              ) : (
                <span> {sentEmails[0]?.SENT}</span>
              )}
            </p>
            <p>
              <span style={{ color: "#adadad" }}>Date of Last Email Sent</span>{" "}
              :
              {loading ? (
                <span> Fetching . . . </span>
              ) : (
                <span> {sentEmails[sentEmails.length - 1]?.SENT}</span>
              )}
            </p>
          </>
        ) : (
          <>
            <span>Loading data . . </span>
          </>
        )}
      </div>

      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <div>
            <div
              style={{
                borderBottom: "2px solid #424242",
                marginBottom: "30px",
              }}
            >
              {sentEmails.length > 0 && (
                <button
                  className={`${
                    activeTab === "sent"
                      ? "text-white bg-[#262626]"
                      : "text-[#adadad]"
                  }`}
                  style={{ padding: "15px 30px" }}
                  onClick={() => handleTabChange("sent")}
                >
                  Sent Emails
                </button>
              )}
              {/* <button style={{padding:"30px", color:"#adadad"}} onClick={() => handleTabChange("sent")}>Received Emails</button> */}
              {/* <button style={{padding:"30px", color:"#adadad"}} onClick={() => handleTabChange("received")}>Sent Emails</button> */}
              {receivedEmails.length > 0 && (
                <button
                  className={`${
                    activeTab === "received"
                      ? "text-white bg-[#262626]"
                      : "text-[#adadad]"
                  }`}
                  style={{ padding: "15px 30px" }}
                  onClick={() => handleTabChange("received")}
                >
                  Received Emails
                </button>
              )}
              {/* {messages.length > 0 && (
            <button style={{ padding: "30px", color: "#adadad" }} onClick={() => handleTabChange("messages")}>Messages</button>
          )} */}
            </div>

            <div style={{ padding: "0px 30px 30px 30px" }}>
              {activeTab === "sent" && (
                <ul className="">
                  {sentEmails.map((email, index) => (
                    <li
                      style={{
                        padding: "20px",
                        marginBottom: "20px",
                        background: "#262626",
                        color: "#adadad",
                      }}
                      key={index}
                    >
                      <strong style={{ color: "#fff" }}>From : </strong>{" "}
                      {email["FROM"]} <br />
                      <strong style={{ color: "#fff" }}>To : </strong>{" "}
                      {email["TO"]} <br />
                      <hr style={{ margin: "30px 0px 30px 0px" }} />
                      <strong style={{ color: "#fff" }}>Subject : </strong>{" "}
                      {email["SUBJECT"]} <br />
                      <strong style={{ color: "#fff" }}>Sent : </strong>{" "}
                      {email["SENT"]} <br />
                      <strong style={{ color: "#fff" }}>
                        Received :{" "}
                      </strong>{" "}
                      {email["RECEIVED"]} <br />
                      <strong style={{ color: "#fff" }}>PDF : </strong>{" "}
                      <a target="_blank" href={email["PDFLINK"]}>
                        View Pdf
                      </a>{" "}
                      <br/>
                      <strong style={{ color: "#fff" }}>
                        Complaint :{" "}
                      </strong>
                      <a target="_blank" href={email["COMPLAINTS"]}>
                        View Complaint
                      </a>{" "}
                      <br />
                      {`--------------------------------`}<br/>
                      <strong style={{ color: "#fff" }}>Message : </strong>{""}
                      <button
                        onClick={() =>
                          handleExtractText(
                            `https://drive.google.com/uc?id=${
                              email.PDFLINK.match(/\/d\/([a-zA-Z0-9_-]+)\//)[1]
                            }`,
                            index,
                            "sent"
                          )
                        }
                      >
                         Show Full Message
                      </button>
                      {extractedTexts[`sent_${index}`] && (
                        <div style={{background:"#000", padding:20, marginTop:10}}>{extractedTexts[`sent_${index}`]}</div>
                      )}
                      {currentlyExtractingEmailIndex === index &&
                        loadingtext && <p>Loading . .</p>}
                      <br />
                      
                      {/* <hr style={{ margin: "30px 0px 30px 0px" }} />
                <strong style={{ color: "#fff" }}>Message : </strong>
                <div>
                  {getEmailContent(email["MESSAGE"])}
                </div> */}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === "received" && (
                <ul className="">
                  {receivedEmails.map((email, index) => (
                    <li
                      style={{
                        padding: "20px",
                        marginBottom: "20px",
                        background: "#262626",
                        color: "#adadad",
                      }}
                      key={index}
                    >
                      <strong style={{ color: "#fff" }}>To : </strong>{" "}
                      {email["TO"]} <br />
                      <strong style={{ color: "#fff" }}>From : </strong>{" "}
                      {email["FROM"]} <br />
                      <hr style={{ margin: "30px 0px 30px 0px" }} />
                      <strong style={{ color: "#fff" }}>Subject : </strong>{" "}
                      {email["SUBJECT"]} <br />
                      <strong style={{ color: "#fff" }}>Sent : </strong>{" "}
                      {email["SENT"]} <br />
                      <strong style={{ color: "#fff" }}>
                        Received :{" "}
                      </strong>{" "}
                      {email["RECEIVED"]} <br />
                      <strong style={{ color: "#fff" }}>PDF : </strong>{" "}
                      <a target="_blank" href={email["PDFLINK"]}>
                        View Pdf
                      </a>{" "}
                      <br />
                      <strong style={{ color: "#fff" }}>
                        Complaint :{" "}
                      </strong>{" "}
                      <a target="_blank" href={email["Complaints"]}>
                        View Complaint
                      </a>{" "}
                      <br />
                      {`--------------------------------`}<br/>
                      <strong style={{ color: "#fff" }}>Message : </strong>{""}
                      <button
                        onClick={() =>
                          handleExtractText(
                            `https://drive.google.com/uc?id=${
                              email.PDFLINK.match(/\/d\/([a-zA-Z0-9_-]+)\//)[1]
                            }`,
                            index,
                            "sent"
                          )
                        }
                      >
                         Show Full Message
                      </button>
                      {extractedTexts[`sent_${index}`] && (
                        <div style={{background:"#000", padding:20, marginTop:10}}>{extractedTexts[`sent_${index}`]}</div>
                      )}
                      {currentlyExtractingEmailIndex === index &&
                        loadingtext && <p>Loading . .</p>}
                      <br />
                      {/* <hr style={{ margin: "30px 0px 30px 0px" }} />
                <strong style={{ color: "#fff" }}>Message : </strong>
                <div>
                  {getEmailContent(email["MESSAGE"])}
                </div> */}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailPanel;

// {activeTab === "messages" && (<div className="">
//             {messages.map((message, index) => (
//               <>
//               {/* // <li style={{ padding: "20px", marginBottom: "20px", background: "#262626", color: "#adadad" }} key={index}> */}
//                 {message.Type === "Outgoing" && (
//                   <>
//                     <strong style={{padding:"10px",marginBottom:"10px",background:"#202020",color: "#fff", float:"right"}}>Outgoing : {message.Text}</strong><br /><br />
//                   </>
//                 )}
//                 {message.Type === "Incoming" && (
//                   <>
//                     <strong style={{padding:"10px",marginBottom:"10px",background:"#606060" ,color: "#fff", float:"left" }}>Incoming : {message.Text}</strong><br /><br />

//                   </>
//                 )}

//               {/* // </li> */}
//               </>
//             ))}
//           </div>)}
