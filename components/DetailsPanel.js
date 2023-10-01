import React, { useEffect, useState } from "react";
import DefaultMessage from "./DefaultMessage";
import LoadingComponent from "./LoadingComponent";
import PDFViewer from "./PDFViewer";
import { axiosRetry } from "./retryAxios"; // Import the axiosRetry function
import copy from "clipboard-copy";

// const axios = require("axios")
const DetailPanel = ({
  selectedData,
  sentEmails,
  receivedEmails,
  onClose,
  loading,
  extractedTexts,
  setExtractedTexts,
  extractedUrls,
  handleExtractText,
  loadingtext,
  currentlyExtractingEmailIndex,
  incident,
}) => {
  const [activeTab, setActiveTab] = useState("sent");
  const [showFullMessages, setShowFullMessages] = useState({}); // State to track if the full message should be shown
  // const [loadingtext, setLoadingText] = useState(false); // State to track if
  // const [googleDriveFileId, setGoogleDriveFileId] = useState('');
  // const [extractedText, setExtractedText] = useState('');

  const [combinedPdfLinks, setCombinedPdfLinks] = useState([]);
  const [complaintLink, setComplaintLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

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
    setComplaintLink(
      `https://submit-to-justiceminds.vercel.app/${selectedData?.Name.replace(
        " ",
        "%20"
      )}`
    );
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
  const handleCopy = () => {
    copy(complaintLink); // Call the onClose function from props to reset selectedData to null
    setIsCopied(true);

    // Reset the copied state after a few seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
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
            <br />
            <div className="flex items-center">
              <button
                className="text-white px-8 py-2 cursor-pointer bg-[#1d1d1d]"
                onClick={handleCopy}
              >
                Copy Incident Link
              </button>
              <span className="text-green-600 px-2">
                {isCopied && <p>✅ Link copied to clipboard!</p>}
              </span>
            </div>
            <p className="text-gray-600">{complaintLink}</p>
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
              {(sentEmails.length > 0 || receivedEmails.length > 0) && (
                <button
                  className={`${
                    activeTab === "pdflinks"
                      ? "text-white bg-[#262626]"
                      : "text-[#adadad]"
                  }`}
                  style={{ padding: "15px 30px" }}
                  onClick={() => handleTabChange("pdflinks")}
                >
                  All Pdf Links
                </button>
              )}
              {(sentEmails.length > 0 || receivedEmails.length > 0) && (
                <button
                  className={`${
                    activeTab === "innerlinks"
                      ? "text-white bg-[#262626]"
                      : "text-[#adadad]"
                  }`}
                  style={{ padding: "15px 30px" }}
                  onClick={() => handleTabChange("innerlinks")}
                >
                  All Inner Links
                </button>
              )}
              {incident.length > 0 && (
                <button
                  className={`${
                    activeTab === "incidents"
                      ? "text-white bg-[#262626]"
                      : "text-[#adadad]"
                  }`}
                  style={{ padding: "15px 30px" }}
                  onClick={() => handleTabChange("incidents")}
                >
                  Incidents
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
                      <br />
                      <strong style={{ color: "#fff" }}>Complaint : </strong>
                      <a target="_blank" href={email["COMPLAINTS"]}>
                        View Complaint
                      </a>{" "}
                      <br />
                      {`--------------------------------`}
                      <br />
                      <strong style={{ color: "#fff" }}>Message : </strong>
                      {""}
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
                        <div
                          style={{
                            background: "#000",
                            padding: 20,
                            marginTop: 10,
                          }}
                        >
                          {extractedUrls[`sent_${index}`] ? (
                            <>
                              <p className="text-green-500 text-xl">
                                Links Found in the Mail . . .
                              </p>
                              {`------------------`}
                              {extractedUrls[`sent_${index}`]?.map((url) => (
                                <pre
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    color: "#fff",
                                  }}
                                >
                                  <a
                                    target="_blank"
                                    className="underline"
                                    href={url}
                                  >
                                    {url}
                                  </a>
                                  <br />
                                </pre>
                              ))}
                              {`------------------`}
                            </>
                          ) : (
                            <>
                            <p className="text-xl text-yellow-500">No Inner Links Found . . .</p>{`------------------`}</>
                          )}
                          <pre
                            style={{
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                              color: "#fff",
                              marginTop: "-60px",
                              marginBottom: "50px",
                            }}
                          >
                            {extractedTexts[`sent_${index}`]}
                          </pre>
                        </div>
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
                      {`--------------------------------`}
                      <br />
                      <strong style={{ color: "#fff" }}>Message : </strong>
                      {""}
                      <button
                        onClick={() =>
                          handleExtractText(
                            `https://drive.google.com/uc?id=${
                              email.PDFLINK.match(/\/d\/([a-zA-Z0-9_-]+)\//)[1]
                            }`,
                            index,
                            "received"
                          )
                        }
                      >
                        Show Full Message
                      </button>
                      {extractedTexts[`received_${index}`] && (
                        <div
                          style={{
                            background: "#000",
                            padding: 20,
                            marginTop: 10,
                          }}
                        >
                          {extractedUrls[`received_${index}`] ? (
                            <>
                              <p className="text-xl text-green-500">
                                Links Found in the Mail . . .
                              </p>
                              {`------------------`}
                              {extractedUrls[`received_${index}`]?.map((url) => (
                                <pre
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    color: "#fff",
                                  }}
                                >
                                  <a
                                    target="_blank"
                                    className="underline"
                                    href={url}
                                  >
                                    {url}
                                  </a>
                                  <br />
                                </pre>
                              ))}
                              {`------------------`}
                            </>
                          ) : (
                            <>
                            <p className="text-xl text-yellow-500">No Inner Links Found . . .</p>{`------------------`}</>
                          )}
                          <pre
                            style={{
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                              color: "#fff",
                              marginTop: "-60px",
                              marginBottom: "50px",
                            }}
                          >
                            {extractedTexts[`received_${index}`]}
                          </pre>
                        </div>
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
              {activeTab === "pdflinks" && (
                <ul className="">
                  <>
                    <table>
                      <tr className="border-b-2 border-b-gray-800">
                        <td className="p-3 font-semibold">Date</td>
                        <td className="p-3 font-semibold">Pdf Link</td>
                      </tr>
                      <p className="p-3 text-green-500">Sent</p>
                      {sentEmails.map((email, index) => (
                        <>
                          <tr key={index} className="">
                            <td className="p-3 text-gray-400">
                              {email["SENT"]}
                            </td>
                            <td className="p-3">
                              <a href={email["PDFLINK"]} target="_blank">
                                {email["SUBJECT"]}
                              </a>
                            </td>
                          </tr>
                        </>
                      ))}
                      <p className="p-3 text-green-500">Received</p>
                      {receivedEmails.map((email, index) => (
                        <tr className="">
                          <td className="p-3 text-gray-400">{email["SENT"]}</td>
                          <td className="p-3">
                            <a href={email["PDFLINK"]} target="_blank">
                              {email["SUBJECT"]}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </table>
                    {/* <div className="flex md:flex-row flex-col">

                      <p className="text-gray-400 mr-10">
                        <strong className="text-white">Date :</strong>{" "}
                        {email["SENT"]}
                      </p>
                      <a className="text-white text-left" key={index} target="_blank" href={email["PDFLINK"]}>
                        Email : {email["SUBJECT"]}
                      </a>
                    </div> */}
                    <br />
                  </>
                </ul>
              )}
              {activeTab === "innerlinks" && (
                <ul className="">
                  {sentEmails.map((email, index) => (
                    <li
                      style={{
                        padding: "20px",
                        marginBottom: "",
                        // background: "#262626",
                        color: "#adadad",
                      }}
                      key={index}
                    >
                      {`--------------------------------`}
                      <br />
                      <strong style={{ color: "#fff" }}>SENT : </strong>
                      {""}{email.SUBJECT}<br />
                      <button
                        onClick={() =>
                          handleExtractText(
                            `https://drive.google.com/uc?id=${
                              email.PDFLINK.match(/\/d\/([a-zA-Z0-9_-]+)\//)[1]
                            }`,
                            index,
                            "inner"
                          )
                        }
                      >
                        View All Links Found . .
                      </button>
                      {extractedTexts[`inner_${index}`] && (
                        <div
                          style={{
                            background: "#1d1d1d",
                            padding: 20,
                            marginTop: "",
                          }}
                        >
                          {extractedUrls[`inner_${index}`] ? (
                            <>
                              <p className="text-xl text-green-500">
                                Links Found in the Mail . . .
                              </p>
                              {`------------------`}
                              {extractedUrls[`inner_${index}`]?.map((url) => (
                                <pre
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    color: "#fff",
                                  }}
                                >
                                  <a
                                    target="_blank"
                                    className="underline"
                                    href={url}
                                  >
                                    {url}
                                  </a>
                                  <br />
                                </pre>
                              ))}
                              {`------------------`}
                            </>
                          ) : (
                            <>
                            <p className="text-xl text-yellow-500">No Inner Links Found . . .</p>{`------------------`}</>
                          )}
                        </div>
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
              {activeTab === "incidents" && (
                <>
                  {incident.map((inci) => (
                    <div className="bg-[#1d1d1d] p-8 mb-5">
                      <h2 className="text-gray-400">
                        <strong className="font-semibold text-white">
                          Name :{" "}
                        </strong>{" "}
                        {inci.complainer_name}
                      </h2>
                      <p className="text-gray-400">
                        <strong className="font-semibold text-white">
                          Date :
                        </strong>{" "}
                        {inci.created_at}
                      </p>
                      <p className="text-gray-200">
                        <strong className="text-white font-semibold">
                          Incident :
                        </strong>{" "}
                        <br />
                        <div dangerouslySetInnerHTML={{ __html: (inci.complaint_text) }}></div>
                      </p>
                    </div>
                  ))}
                </>
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
