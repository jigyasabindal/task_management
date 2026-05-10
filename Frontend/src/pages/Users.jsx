import React from 'react'

const Users = (role) => {
    const [users,setusers]= useState([]);
    try{
        fetch("http://localhost:3000/user/getUsers")
        .then(res=>console.log(res.data))
        .then(res=>{
            res.json();
            setusers(res);
        })
    }catch(err){
        console.log(err);
    }
  return (
    <div>
      
    </div>
  )
}

export default Users
