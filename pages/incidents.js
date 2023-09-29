import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import Login from "../components/Login"; // Update the path
import { setCookie } from "nookies";
import { parse } from "cookie";
import Link from "next/link";
import FilterSidebar from "@/components/FilterSidebar";
import DefaultMessage from "@/components/DefaultMessage";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Complaints() {
  const [isLoading, setisLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [ForNameArray, setForNameArray] = useState([]);
  const [activeNameId, setActiveNameId] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleShowAll = () => {
    setShowAll(true);
    setSelectedName(null);
  };
  const handleCloseShowAll = () => {
    setShowAll(false);
  };

  const handleLogout = () => {
    // Set the "isLoggedIn" cookie to expire immediately
    setCookie(null, "isLoggedIn", "true", { maxAge: -1 });
    setIsLoggedIn(false);
  };

  const handleSelectName = async (ID) => {
    setShowAll(false);
    const selectedRow = complaints.find((row) => row.id === ID);
    setSelectedName(selectedRow);
    setisLoading(true);

    const { data: ForNameData, error: ForNameError } = await supabase
      .from("Complaints")
      .select("*")
      .eq("complaint_for", selectedRow?.complaint_for);

    if (ForNameError) {
      console.error("ForNameError", ForNameError);
      return;
    }

    setForNameArray(ForNameData);
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

  useEffect(() => {
    // Parse the cookie after the page is mounted
    const cookies = parse(document.cookie);
    setIsLoggedIn(cookies.isLoggedIn === "true");
  }, []);

  useEffect(() => {
    // Fetch initial data from Supabase
    const fetchData = async () => {
      const { data, error } = await supabase.from("Complaints").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setComplaints(data);
    };
    fetchData();
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <>
          <div className="flex justify-between items-center ">
            <div className="items-center absolute top-0 right-2">
              <Link className="mx-5 my-6 bg-black p-[15px]" href={"/"}>{`< Back`}</Link>
              <button className="mx-5 my-6 bg-black p-[15px]" style={{}} onClick={toggleSidebar}>
                {showSidebar ? `<Close Filter>` : `<Open Filter>`}
              </button>
              {showAll ? (
                <>
                  <button
                    className="mx-5 my-6 bg-black p-[15px]"
                    style={{}}
                    onClick={handleCloseShowAll}
                  >
                    {`<Close Show All>`}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="mx-5 my-6 bg-black p-[15px]"
                    style={{}}
                    onClick={handleShowAll}
                  >
                    {`<Show All>`}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex">
            {/* Sidebar Toggle Button */}

            {/* Sidebar */}
            <div
              className={` w-2/4 md:w-1/3 lg:w-1/5 md:flex-shrink-0 ${
                showSidebar ? "" : "hidden"
              }`}
            >
              {showSidebar && (
                <FilterSidebar
                  data={complaints}
                  activeNameId={activeNameId}
                  onSelectName={handleSelectName}
                />
              )}
            </div>

            {/* Dashboard */}
            {isLoading ? (
              <p className="p-8">Loading . . . </p>
            ) : (
              <div className="flex-grow md:w-2/3 lg:w-3/4">
                {selectedName ? (
                  <section className="text-gray-400 body-font overflow-y-scroll" style={{height:"100vh"}}>
                    <div className="container px-5 pt-24 mx-auto">
                      <div className="mt-2">
                        <>
                          {complaints ? (
                            <>
                              {ForNameArray?.map((comp) => (
                                <div className="py-8 border-b-2 border-[#060606] bg-[#1d1d1d] p-5 justify-between flex flex-wrap md:flex-nowrap">
                                  <div className=" md:mb-0 mb-6">
                                    <div className="flex flex-col">
                                      <span className="font-semibold title-font text-white capitalize">
                                        <span className="text-[#9f9f9f]">
                                          Name:
                                        </span>
                                        <br />
                                        {comp.complainer_name}
                                      </span>
                                      <span className="mt-1 text-gray-200 text-md">
                                        {comp.complainer_email}
                                      </span>
                                      <span className="mt-1 text-gray-500 text-md">
                                        {
                                          new Date(comp?.created_at)
                                            .toISOString()
                                            .split("T")[0]
                                        }{" "}
                                        {
                                          new Date(comp?.created_at)
                                            .toISOString()
                                            .split("T")[1]
                                        }
                                      </span>
                                    </div>
                                  </div>

                                  <div className=" md:mb-0 mb-6 w-3/4">
                                    <div>
                                      <p className="leading-relaxed text-justify">
                                        {comp.complaint_text}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="w-44 text-right">
                                    <div>
                                      <span className="font-semibold title-font text-white capitalize">
                                        For: <br />
                                        {comp.complaint_for}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <p>No Incidents to Display . . </p>
                          )}
                        </>
                      </div>
                    </div>
                  </section>
                ) : (
                  <>
                    {!showAll ? (
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
                          <h1 className="text-3xl py-6">Incident Dashboard</h1>
                          <p className="text-gray-600 py-6">
                            Please select the <br />
                            Name of Complainee ( for whom )
                          </p>

                          <button
                            onClick={handleLogout}
                            className=" text-white px-8 py-2 cursor-pointer m-5"
                            style={{ background: "#1d1d1d" }}
                          >
                            LOGOUT
                          </button>
                          {/* <h1 style={{color:"#fff", fontSize:"50px",fontWeight:"bolder", paddingBottom:"30px"}}>JusticeMinds</h1> */}
                          {/* <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Welcome!</h1> */}
                          {/* <p style={{ fontSize: "18px", color:"#adadad"}}>Select a name from the sidebar to view details.</p> */}
                        </div>
                      </div>
                    ) : (
                      <section className="text-gray-400 body-font overflow-y-scroll" style={{height:"100vh"}}>
                        <div className="container px-5 pt-24 mx-auto">
                          <div className="mt-2">
                            <>
                              {complaints ? (
                                <>
                                  {complaints?.map((comp) => (
                                    <div className="py-8 border-b-2 border-[#060606] bg-[#1d1d1d] p-5 justify-between flex flex-wrap md:flex-nowrap">
                                      <div className=" md:mb-0 mb-6">
                                        <div className="flex flex-col">
                                          <span className="font-semibold title-font text-white capitalize">
                                            <span className="text-[#9f9f9f]">
                                              Name:
                                            </span>
                                            <br />
                                            {comp.complainer_name}
                                          </span>
                                          <span className="mt-1 text-gray-200 text-md">
                                            {comp.complainer_email}
                                          </span>
                                          <span className="mt-1 text-gray-500 text-md">
                                            {
                                              new Date(comp?.created_at)
                                                .toISOString()
                                                .split("T")[0]
                                            }{" "}
                                            {
                                              new Date(comp?.created_at)
                                                .toISOString()
                                                .split("T")[1]
                                            }
                                          </span>
                                        </div>
                                      </div>

                                      <div className=" md:mb-0 mb-6 w-3/4">
                                        <div>
                                          <p className="leading-relaxed text-justify">
                                            {comp.complaint_text}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="w-44 text-right">
                                        <div>
                                          <span className="font-semibold title-font text-white capitalize">
                                            For: <br />
                                            {comp.complaint_for}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <p>No Incidents to Display . . </p>
                              )}
                            </>
                          </div>
                        </div>
                      </section>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <Login onSuccess={handleLoginSuccess} />
      )}
    </>
  );
}
