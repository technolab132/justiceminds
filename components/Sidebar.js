
import React, {useState} from "react";

const Sidebar = ({ data, onSelectName }) => {

  const [searchTerm, setSearchTerm] = useState("");
  const filteredNames = data.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase())
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
      {filteredNames.map((item, index) => (
        <button
          key={index}
          style={{
            padding: "20px",
            backgroundColor:"#0e0e0e",
            width:"100%",
            marginBottom:"10px",
            textAlign:"left"
          }}
          onClick={() => onSelectName(item.id)}
        >
          {item.Name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;