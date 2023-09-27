import DefaultMessage from "@/components/DefaultMessage";
import DetailPanel from "@/components/DetailsPanel";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import Login from "../components/Login"; // Update the path
import { setCookie } from "nookies";
import { parse } from "cookie";
import { axiosRetry } from "../components/retryAxios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [selectedName, setSelectedName] = useState(null);
  // const [selectedNameWW, setSelectedNameWW] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const [sentEmails, setSentEmails] = useState([]);
  const [receivedEmails, setReceivedEmails] = useState([]);
  const [extractedTexts, setExtractedTexts] = useState({});
  const [loadingtext, setLoadingText] = useState(false);
  const [currentlyExtractingEmailIndex, setCurrentlyExtractingEmailIndex] =
    useState(-1);

  // const [messages, setMessages] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [masterData, setMasterData] = useState([]);
  const [activeNameId, setActiveNameId] = useState(null);

  useEffect(() => {
    // Parse the cookie after the page is mounted
    const cookies = parse(document.cookie);
    setIsLoggedIn(cookies.isLoggedIn === "true");
  }, []); // Empty dependency array ensures this effect runs only once after mount

  useEffect(() => {
    // Fetch initial data from Supabase
    const fetchData = async () => {
      const { data, error } = await supabase.from("Clients").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setMasterData(data);
    };

    // Subscribe to real-time updates from Supabase
    // const subscription = supabase
    //   .from('Clients')
    //   .on('INSERT', (payload) => {
    //     // Handle insert event, update your data state
    //     setData((prevData) => [...prevData, payload.new]);
    //   })
    //   .on('UPDATE', (payload) => {
    //     // Handle update event, update your data state
    //     setData((prevData) =>
    //       prevData.map((item) =>
    //         item.id === payload.new.id ? payload.new : item
    //       )
    //     );
    //   })
    //   .subscribe();

    // // Clean up the subscription when the component unmounts
    // return () => {
    //   subscription.unsubscribe();
    // };

    // Fetch initial data when the component mounts
    fetchData();
  }, []);

  const handleExtractText = async (pdfLink, index, type) => {
    try {
      setCurrentlyExtractingEmailIndex(index);
      setLoadingText(true);
      const response = await axiosRetry({
        method: "POST",
        url: "/api/extract-pdf",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ pdfUrl: pdfLink }),
      });

      if (response.status === 200) {
        const { text } = response.data;
        setExtractedTexts((prevTexts) => ({
          ...prevTexts,
          [`${type}_${index}`]: text,
        }));
      } else {
        console.error("Error extracting text:", response.statusText);
        setExtractedTexts((prevTexts) => ({
          ...prevTexts,
          [`${type}_${index}`]: "Error extracting text",
        }));
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      setExtractedTexts((prevTexts) => ({
        ...prevTexts,
        [`${type}_${index}`]: "Error extracting text",
      }));
    }
    setLoadingText(false);
    setCurrentlyExtractingEmailIndex(-1);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Set the "isLoggedIn" cookie to expire immediately
    setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
    setIsLoggedIn(false);
  };

  const handleSelectName = async (ID) => {
    setExtractedTexts({});
    const selectedRow = masterData.find((row) => row.id === ID);
    // const selectedRowW = sheetdata3.find((row) => row[0] === name);
    setSelectedName(selectedRow);
    setisLoading(true);
    // console.log(selectedName);
    // console.log(selectedRow);
    // setSelectedNameWW(selectedRowW);
    // const { data, error } = supabase.from('EmailData').select('*').eq("email", )

    const { data: SentEmails, error: semailError } = await supabase
      .from("EmailData")
      .select("*")
      .eq("TO", selectedRow.Email);

    // Assuming 'Email' is the column name that links data between the tables
    const { data: ReceivedEmails, error: remailError } = await supabase
      .from("EmailData")
      .select("*")
      .eq("FROM", selectedRow.Email); // Assuming 'Email' is the column name that links data between the tables
    // const { data: Messages, error: messageError } = await supabase
    //   .from('Chats')
    //   .select('*')
    //   .eq('Chat Session', selectedRow.Name); // Assuming 'Email' is the column name that links data between the tables

    if (semailError) {
      console.error("sentmaail", semailError);
      return;
    }
    if (remailError) {
      console.error("receivedmaail", remailError);
      return;
    }
    // if (messageError) {
    //   console.error("messageerror", messageError);
    //   return;
    // }

    setSentEmails(SentEmails);
    setReceivedEmails(ReceivedEmails);
    // setMessages(Messages)
    setisLoading(false);

    // console.log(sentEmails);
  };

  useEffect(() => {
    if (selectedName) {
      setActiveNameId(selectedName.id);
    } else {
      setActiveNameId(null); // No active name
    }
  }, [selectedName]);

  const handleCloseDetailPanel = () => {
    setSelectedName(null); // Reset selectedName to null when the close button is clicked
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      {/* <div>
      <h1>Supabase Data Fetching Example</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.Name}</li>
        ))}
      </ul>
    </div> */}
      {isLoggedIn ? (
        <div className="flex">
          {/* Sidebar Toggle Button */}
          <button
            className="p-4 text-3xl absolute"
            style={{ right: "6px", top: "4px", zIndex: "1000" }}
            onClick={toggleSidebar}
          >
            =
          </button>

          {/* Sidebar */}
          <div
            className={` w-2/4 md:w-1/3 lg:w-1/4 md:flex-shrink-0 ${
              showSidebar ? "" : "hidden"
            }`}
          >
            {showSidebar && (
              <Sidebar
                data={masterData}
                activeNameId={activeNameId}
                onSelectName={handleSelectName}
              />
            )}
          </div>

          {/* Dashboard */}
          <div className="flex-grow md:w-2/3 lg:w-3/4">
            {selectedName ? (
              <DetailPanel
                selectedData={selectedName}
                sentEmails={sentEmails}
                receivedEmails={receivedEmails}
                onClose={handleCloseDetailPanel}
                loading={isLoading}
                extractedTexts={extractedTexts}
                setExtractedTexts={setExtractedTexts}
                handleExtractText={handleExtractText}
                loadingtext={loadingtext}
                currentlyExtractingEmailIndex={currentlyExtractingEmailIndex}
              />
            ) : (
              <>
                <DefaultMessage onlogout={handleLogout} />
              </>
            )}
          </div>
        </div>
      ) : (
        <Login onSuccess={handleLoginSuccess} />
      )}
    </>
  );
}
