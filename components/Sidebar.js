
import React, {useState} from "react";

const Sidebar = ({ names, onSelectName }) => {

  const [searchTerm, setSearchTerm] = useState("");
  const filteredNames = names.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{display: "flex", flexDirection : "column", alignItems: "flex-start", borderRight:"2px solid #424242",padding:"10px", height: "100vh", overflowY: "scroll", background:"black", width:"100%"}}>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "15px",width:"100%", background:"#000", border:"1px solid rgb(45,45,45)", marginBottom:"10px"}}
      />
      {filteredNames.map((name, index) => (
        <button
          key={index}
          style={{
            padding: "20px",
            backgroundColor:"#0e0e0e",
            width:"100%",
            marginBottom:"10px",
            textAlign:"left"
          }}
          onClick={() => onSelectName(name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;