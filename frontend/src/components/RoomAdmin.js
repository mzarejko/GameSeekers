import React from "react";


const RoomAdmin = (props) => {
    return (
        <div>
        <p> { props.room_name }</p>
        <p> { props.maxsize }</p>
        <p> { props.admin }</p>
        <p> { props.available }</p>
        <p> To twoja sesja </p>
        </div>
    );
  }
  
  export default RoomAdmin;