
import React, { useState } from "react";
import DefaultMessage from "./DefaultMessage";
import LoadingComponent from "./LoadingComponent";

const DetailPanel = ({ selectedData, sentEmails, receivedEmails,messages, onClose, loading }) => {
  const [activeTab, setActiveTab] = useState("sent");
  const [showFullMessages, setShowFullMessages] = useState({});  // State to track if the full message should be shown


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleClose = () => {
    onClose(); // Call the onClose function from props to reset selectedData to null
  };

  const handleToggleMessage = (email) => {
    setShowFullMessages((prevShowFullMessages) => {
      return { ...prevShowFullMessages, [email]: !prevShowFullMessages[email] };
    });
  };

  const getEmailContent = (email) => {
    const showFullMessage = showFullMessages[email];

    if (email.length > 100) {
      return (
        <p>
          {showFullMessage
            ? email + " "
            : email.substring(0, 100) + "..."}
          <button style={{ color: "#fff" }} onClick={() => handleToggleMessage(email)}>
            {showFullMessage ? "Show Less" : "Show More"}
          </button>
        </p>
      );
    }

    return <p>{email}</p>;
  };

  return (
    <div style={{ lineHeight: "2rem", height: "100vh", overflowY: "scroll" }}>
      <div style={{ padding: "30px", borderBottom: "2px solid #424242", fontSize: "17px" }}>
        <button style={{ position: "absolute", right: "60px", top: "20px" , zIndex:"1000"}} onClick={handleClose}>[x]</button>
        <h2><span style={{ color: "#adadad" }}>Name</span> : {selectedData["Name"]}</h2>
        <p><span style={{ color: "#adadad" }}>Company</span> : {selectedData["Company"]}</p>
        <p><span style={{ color: "#adadad" }}>Email</span> : {selectedData["Email"]}</p>
        <p><span style={{ color: "#adadad" }}>Phone</span> : {selectedData["Phone"]}</p>
        <p><span style={{ color: "#adadad" }}>Email Sent</span> : {selectedData["Email Total Sent"]}</p>
        <p><span style={{ color: "#adadad" }}>Email Received</span> : {selectedData["Email Total Received"]}</p>
        <p><span style={{ color: "#adadad" }}>Total Email</span> : {selectedData["Email Total"]}</p>
        <p><span style={{ color: "#adadad" }}>Total Email View</span> : {selectedData["Total Email View"]}</p>
        <p><span style={{ color: "#adadad" }}>Date of First Email Sent</span> : {selectedData["Date of First Email Sent"]}</p>
        <p><span style={{ color: "#adadad" }}>Date of Last Email Sent</span> : {selectedData["Date of Last Email Sent"]}</p>
      </div>


      {loading?(<LoadingComponent />):(
        <>
        <div>
        <div style={{ borderBottom: "2px solid #424242", marginBottom: "30px" }}>
          {sentEmails.length > 0 && (
            <button style={{ padding: "30px", color: "#adadad" }} onClick={() => handleTabChange("sent")}>Sent Emails</button>
          )}
          {/* <button style={{padding:"30px", color:"#adadad"}} onClick={() => handleTabChange("sent")}>Received Emails</button> */}
          {/* <button style={{padding:"30px", color:"#adadad"}} onClick={() => handleTabChange("received")}>Sent Emails</button> */}
          {receivedEmails.length > 0 && (
            <button style={{ padding: "30px", color: "#adadad" }} onClick={() => handleTabChange("received")}>Received Emails</button>
          )}
          {messages.length > 0 && (
            <button style={{ padding: "30px", color: "#adadad" }} onClick={() => handleTabChange("messages")}>Messages</button>
          )}
        </div>

        <div style={{ padding: "0px 30px 30px 30px" }}>
          {activeTab === "sent" && (<ul className="">
            {sentEmails.map((email, index) => (
              <li style={{ padding: "20px", marginBottom: "20px", background: "#262626", color: "#adadad" }} key={index}>
                <strong style={{ color: "#fff" }}>From : </strong> {email["FROM"]} <br />
                <strong style={{ color: "#fff" }}>To : </strong> {email["TO"]} <br />
                <hr style={{ margin: "30px 0px 30px 0px" }} />
                <strong style={{ color: "#fff" }}>Subject : </strong> {email["SUBJECT"]} <br />
                <strong style={{ color: "#fff" }}>Sent : </strong> {email["SENT"]} <br />
                <strong style={{ color: "#fff" }}>Received : </strong> {email["RECEIVED"]} <br />
                <strong style={{ color: "#fff" }}>PDF : </strong> <a target="_blank" href={email["PDFLINK"]}>View Pdf</a> <br />
                <strong style={{ color: "#fff" }}>Complaint : </strong> <a target="_blank" href={email["Complaints"]}>View Complaint</a> <br />
                <hr style={{ margin: "30px 0px 30px 0px" }} />
                <strong style={{ color: "#fff" }}>Message : </strong>
                <div>
                  {getEmailContent(email["MESSAGE"])}
                </div>
              </li>
            ))}
          </ul>)}
          {activeTab === "received" && (<ul className="">
            {receivedEmails.map((email, index) => (
              <li style={{ padding: "20px", marginBottom: "20px", background: "#262626", color: "#adadad" }} key={index}>
                <strong style={{ color: "#fff" }}>To : </strong> {email["TO"]} <br />
                <strong style={{ color: "#fff" }}>From : </strong> {email["FROM"]} <br />
                <hr style={{ margin: "30px 0px 30px 0px" }} />
                <strong style={{ color: "#fff" }}>Subject : </strong> {email["SUBJECT"]} <br />
                <strong style={{ color: "#fff" }}>Sent : </strong> {email["SENT"]} <br />
                <strong style={{ color: "#fff" }}>Received : </strong> {email["RECEIVED"]} <br />
                <strong style={{ color: "#fff" }}>PDF : </strong> <a target="_blank" href={email["PDFLINK"]}>View Pdf</a> <br />
                <strong style={{ color: "#fff" }}>Complaint : </strong> <a target="_blank" href={email["Complaints"]}>View Complaint</a> <br />
                <hr style={{ margin: "30px 0px 30px 0px" }} />
                <strong style={{ color: "#fff" }}>Message : </strong>
                <div>
                  {getEmailContent(email["MESSAGE"])}
                </div>
              </li>
            ))}
          </ul>)}
          {activeTab === "messages" && (<div className="">
            {messages.map((message, index) => (
              <>
              {/* // <li style={{ padding: "20px", marginBottom: "20px", background: "#262626", color: "#adadad" }} key={index}> */}
                {message.Type === "Outgoing" && (
                  <>
                    <strong style={{padding:"10px",marginBottom:"10px",background:"#202020",color: "#fff", float:"right"}}>Outgoing : {message.Text}</strong><br /><br />
                  </>
                )}
                {message.Type === "Incoming" && (
                  <>
                    <strong style={{padding:"10px",marginBottom:"10px",background:"#606060" ,color: "#fff", float:"left" }}>Incoming : {message.Text}</strong><br /><br />

                  </>
                )}

              {/* // </li> */}
              </>
            ))}
          </div>)}

         
          
        </div>
      </div>
        </>
      )}
      


    </div>
  );
};

export default DetailPanel;
