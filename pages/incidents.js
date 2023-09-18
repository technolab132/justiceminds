import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import Login from "../components/Login"; // Update the path
import { setCookie } from "nookies";
import { parse } from "cookie";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Complaints() {
  const [isLoading, setisLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [complaints, setComplaints] = useState([]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
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
          <div className="flex justify-between items-center">
            <img
              src="/logo 1.svg"
              width={290}
              className="px-10 py-10"
              alt="logo"
            />
            <Link className="px-10 py-10" href={"/"}>{`< Back`}</Link>
          </div>
          <section class="text-gray-400 bg-[#1d1d1d] body-font overflow-hidden">
            <div class="container px-5 py-24 mx-auto">
              <div class="-my-8">
                <>
                  {complaints ? (
                    <>
                      {complaints?.map((comp) => (
                        <div class="py-8 border-b-2 border-[#060606] flex flex-wrap md:flex-nowrap">
                          <div class="md:w-2/6 md:mb-0 mr-10 mb-6 flex-shrink-0 flex flex-col">
                            <span class="font-semibold title-font text-white capitalize">
                              Name : {comp.complainer_name}
                            </span>
                            <span class="mt-1 text-gray-200 text-md">
                              {comp.complainer_email}
                            </span>
                            <span class="mt-1 text-gray-500 text-md">
                              {
                                new Date(comp?.created_at)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </span>
                          </div>
                          <div class="md:flex-grow">
                            <h2 class="text-2xl font-medium text-white title-font mb-2">
                              {`Addressed by --> ${comp.complainer_email}`}
                            </h2>
                            <p class="leading-relaxed">{comp.complaint_text}</p>
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
        </>
      ) : (
        <Login onSuccess={handleLoginSuccess} />
      )}
    </>
  );
}
