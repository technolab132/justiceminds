import DefaultMessage from '@/components/DefaultMessage';
import DetailPanel from '@/components/DetailsPanel';
import Sidebar from '@/components/Sidebar';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react'
import Login from "../components/Login"; // Update the path
import { setCookie } from "nookies";
import { parse } from "cookie";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home({ data }) {


  const [selectedName, setSelectedName] = useState(null);
  // const [selectedNameWW, setSelectedNameWW] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const [filteredNames, setFilteredNames] = useState(data.map((row) => row.Name));

  const [sentEmails, setSentEmails] = useState([]);
  const [receivedEmails, setReceivedEmails] = useState([]);
  // const [messages, setMessages] = useState([]);


  const [isLoading, setisLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Parse the cookie after the page is mounted
    const cookies = parse(document.cookie);
    setIsLoggedIn(cookies.isLoggedIn === "true");
  }, []); // Empty dependency array ensures this effect runs only once after mount

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Set the "isLoggedIn" cookie to expire immediately
    setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
    setIsLoggedIn(false);
  };

  const handleSelectName = async (ID) => {
    const selectedRow = data.find((row) => row.id === ID);
    // const selectedRowW = sheetdata3.find((row) => row[0] === name);
    setSelectedName(selectedRow);
    setisLoading(true)
    // console.log(selectedName);
    // console.log(selectedRow);
    // setSelectedNameWW(selectedRowW);
    // const { data, error } = supabase.from('EmailData').select('*').eq("email", )

    const { data: SentEmails, error: semailError } = await supabase
      .from('EmailData')
      .select('*')
      .eq('TO', selectedRow.Email);
      
      // Assuming 'Email' is the column name that links data between the tables
    const { data: ReceivedEmails, error: remailError } = await supabase
      .from('EmailData')
      .select('*')
      .eq('FROM', selectedRow.Email); // Assuming 'Email' is the column name that links data between the tables
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

    setSentEmails(SentEmails)
    setReceivedEmails(ReceivedEmails)
    // setMessages(Messages)
    setisLoading(false)

    // console.log(sentEmails);


  };

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
          <button className="p-4 text-3xl absolute" style={{ right: "6px", top: "4px", zIndex: "1000" }} onClick={toggleSidebar}>
            =
          </button>

          {/* Sidebar */}
          <div className={` w-2/4 md:w-1/3 lg:w-1/4 md:flex-shrink-0 ${showSidebar ? "" : "hidden"}`}>
            {showSidebar && <Sidebar data={data} onSelectName={handleSelectName}/>}
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

export async function getStaticProps() {
  const { data, error } = await supabase.from('Clients').select('*')

  if (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
    },
  };
}
